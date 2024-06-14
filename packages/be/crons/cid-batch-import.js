// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Axios = require('axios')
const Fs = require('fs-extra')
const Express = require('express')
const Util = require('util')
const Stream = require('stream')
const Pipeline = Util.promisify(Stream.pipeline)
const Spawn = require('child_process').spawn
const Mongoose = require('mongoose')
const MongooseSlugUpdater = require('mongoose-slug-updater')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

const CID_TMP_DIR = Path.resolve(`${MC.packageRoot}/tmp/cid-files`)

// ////////////////////////////////////////////////////////////////// Initialize
MC.app = Express()
Mongoose.plugin(MongooseSlugUpdater)

// ///////////////////////////////////////////////////////////////////// Aliases
ModuleAlias.addAliases({
  '@Root': MC.packageRoot,
  '@Modules': `${MC.packageRoot}/modules`
})

try {
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  items.forEach((name) => {
    const path = `${modulesRoot}/${name}`
    if (Fs.statSync(path).isDirectory()) {
      const moduleName = `${name[0].toUpperCase() + name.substring(1)}`
      ModuleAlias.addAlias(`@Module_${moduleName}`, path)
    }
  })
} catch (e) {
  console.log(e)
}

// ///////////////////////////////////////////////////////////////////// Modules
require('@Module_Database')
require('@Module_Cidtemp')
const { GetFileFromDisk } = require('@Module_Utilities')
const { InitializeWorker } = require('@Root/scripts/worker-pool-batch-processor.js')

// /////////////////////////////////////////////////////////////////// Functions
// ------------------------------------------------------------ retrieveCidFiles
const retrieveCidFile = async (line, batchNo, retryNo = 0) => {
  try {
    if (retryNo > 0) {
      console.log(`Retry number ${retryNo}`)
    }
    const upload = JSON.parse(line)
    // fetch file using upload cid
    const response = await Axios.get(`https://${upload.cid}.ipfs.w3s.link/`, {
      responseType: 'stream'
    })
    // if a file already exists with this name in the temp folder,
    // delete it to make way for an updated version
    await deleteTemporaryFile(`batch_${batchNo}/${upload.name}`)
    // write file data to new zst file in the temp folder
    await Pipeline(response.data, Fs.createWriteStream(`${CID_TMP_DIR}/batch_${batchNo}/${upload.name}`))
    // unpack the zst and return the inner json
    return await unpackRetrievedFile({
      cid: upload.cid,
      name: upload.name,
      updated: upload.updated,
      created: upload.created
    }, batchNo)
  } catch (e) {
    if (retryNo < 10) {
      console.log(`Error retrieving CID ${JSON.parse(line).cid}. Retrying retrieval...`)
      await retrieveCidFile(line, batchNo, retryNo + 1)
    } else {
      const cid = JSON.parse(line).cid
      await cacheFailedCID(cid)
      console.log('==================================== [Function: unpackCids]')
      console.log(`Could not retrieve CID ${cid}. Max retries reached.`)
      console.log(e)
    }
  }
}

// --------------------------------------------------------------- unpackZstFile
const unpackZstFile = (file, batchNo) => {
  return new Promise((resolve, reject) => {
    const unzstd = Spawn('unzstd', [`../tmp/cid-files/batch_${batchNo}/${file.name}`])
    const errors = []
    unzstd.stderr.on('data', (msg) => {
      errors.push(`Error unpacking ${file.name}: ${msg.toString()}`)
    })
    unzstd.on('exit', (code) => {
      const err = errors.length > 0 && code !== 0
      if (err) {
        console.log(errors.join('\n'))
      }
      resolve()
    })
  })
}

// --------------------------------------------------------- unpackRetrievedFile
const unpackRetrievedFile = async (file, batchNo) => {
  try {
    const jsonFilename = file.name.substring(0, file.name.length - 4)
    await unpackZstFile(file, batchNo)
    const json = await GetFileFromDisk(`${CID_TMP_DIR}/batch_${batchNo}/${jsonFilename}`, true)
    const fileMetadata = {
      piece_cid: json.piece_cid,
      payload_cid: json.payload_cid,
      raw_car_file_size: json.raw_car_file_size,
      dataset_slug: json.dataset,
      filename: jsonFilename,
      web3storageCreatedAt: file.created,
      web3storageUpdatedAt: file.updated
    }
    await deleteTemporaryFile(`batch_${batchNo}/${jsonFilename}`)
    return fileMetadata
  } catch (e) {
    console.log('============================ [Function: unpackRetrievedFiles]')
    console.log(e)
  }
}

// -------------------------------------------------------------- cacheFailedCid
const cacheFailedCID = async (cid) => {
  try {
    await Pipeline(`${cid}\n`, Fs.createWriteStream(`${CID_TMP_DIR}/failed-cid-retrievals.txt`, { flags: 'a' }))
  } catch (e) {
    console.log('================================= [Function: cacheFailedCID ]')
    console.log(e)
  }
}

// --------------------------------------------------------- deleteTemporaryFile
const deleteTemporaryFile = async (path) => {
  try {
    if (Fs.existsSync(`${CID_TMP_DIR}/${path}`)) {
      Fs.unlinkSync(`${CID_TMP_DIR}/${path}`)
    }
  } catch (e) {
    console.log('============================ [Function: deleteTemporaryFile ]')
    console.log(e)
  }
}

// ------------------------------------------------ writeBatchMetadataToDatabase
const writeBatchMetadataToDatabase = async (retrievedFiles) => {
  try {
    const operations = []
    const len = retrievedFiles.length
    for (let i = 0; i < len; i++) {
      const file = retrievedFiles[i]
      operations.push({
        updateOne: {
          filter: { payload_cid: file.payload_cid },
          update: { $set: file },
          upsert: true
        }
      })
    }
    const response = await MC.model.Cidtemp.bulkWrite(operations, { ordered: false })
    return response.result
  } catch (e) {
    console.log('==================== [Function: writeBatchMetadataToDatabase]')
    console.log(e)
  }
}

// ------------------------------------------------- backupCidsToBackblazeBucket
const backupCidsToBackblazeBucket = async (batchNo) => {
  try {
    const rclone = Spawn('rclone', [
      'copy',
      `${MC.tmpRoot}/cid-files/batch_${batchNo}`,
      process.env.B2_OPENPANDA_BUCKET,
      '--filter-from',
      process.env.B2_OPENPANDA_FILTER
    ])
    const errors = []
    for await (const msg of rclone.stderr) {
      errors.push(msg.toString())
    }
    return await new Promise((resolve, reject) => {
      rclone.on('exit', (code) => {
        const err = errors.length > 0 && code !== 0
        err ? reject({
          success: false,
          message: errors.join('\n\n')
        }) : resolve({
          success: true,
          message: `✓ CID batch ${batchNo} backup successful`
        })
      })
    })
  } catch (e) {
    console.log('===================== [Function: backupCidsToBackblazeBucket]')
    console.log(e)
  }
}

// -------------------------------------------------------- processManifestBatch
const processManifestBatch = async (batch, batchNo) => {
  try {
    // make a temporary subdirectory for this batch
    if (!Fs.existsSync(`${CID_TMP_DIR}/batch_${batchNo}`)) {
      Fs.mkdirSync(`${CID_TMP_DIR}/batch_${batchNo}`)
    }
    // individually download each CID file in the batch
    // save zst to a temp/cid-files/batch_x folder, extract and return metadata
    // to the retrieved array
    const len = batch.length
    const retrievedFiles = []
    for (let i = 0; i < len; i++) {
      const cidManifestItem = batch[i] 
      const retrieved = await retrieveCidFile(cidManifestItem, batchNo)
      if (retrieved) { retrievedFiles.push(retrieved) }
    }
    if (!retrievedFiles.length) {
      throw new Error('No CIDs could be retrieved from this batch')
    }
    // save batch metadata to the database
    const databaseWriteResult = await writeBatchMetadataToDatabase(retrievedFiles)
    // backup zst files in the corresponding temp/cid-files/batch_x folder to backblaze
    const batchBackupResult = await backupCidsToBackblazeBucket(batchNo)
    // if the backup is successful clean up temp folder by deleting batch
    if (batchBackupResult && batchBackupResult.success) {
      if (Fs.existsSync(`${CID_TMP_DIR}/batch_${batchNo}`)) {
        Fs.rm(`${CID_TMP_DIR}/batch_${batchNo}`, { recursive: true, force: true })
      }
    }
    let result = undefined
    if (databaseWriteResult && batchBackupResult) {
      result = {
        batchNo: batchNo, 
        databaseWriteResult: databaseWriteResult,
        batchBackupResult: batchBackupResult
      }
    }
    // return results to the main thread
    return await new Promise((resolve, reject) => {
      if (result) {
        resolve(result)
      } else {
        reject()
      }
    })
  } catch (e) {
    console.log('============================ [Function: processManifestBatch]')
    console.log(e)
  }
}

// /////////////////////////////////////////////////////////// Initialize Worker
// -----------------------------------------------------------------------------
InitializeWorker(processManifestBatch)
