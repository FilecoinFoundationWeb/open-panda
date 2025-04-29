/* eslint-disable no-console */

import Path from 'path'
import Fs from 'fs'

/**
 * Splits an array of pieces into chunks and saves them to separate files
 * @param {Array} pieces - Array of piece objects to split
 * @param {string} datasetName - Name of the dataset (used in file paths)
 * @param {number} chunkSize - Number of items per chunk (default: 50). ❗️ Must be hardcoded on frontend as well.
 * @returns {Promise<Array>} Array of file paths created
 */
export const splitDatasetPieces = async (options, pieces, datasetName, chunkSize = 50) => {
  // Create chunks of specified size
  const chunks = []
  for (let i = 0; i < pieces.length; i += chunkSize) {
    chunks.push(pieces.slice(i, i + chunkSize))
  }

  // Create directory if it doesn't exist
  const dirPath = Path.join(options.rootDir, 'static', 'datasets', datasetName.split('.')[0])
  if (!Fs.existsSync(dirPath)) {
    Fs.mkdirSync(dirPath, { recursive: true })
  }

  // Save each chunk to a file
  const filePaths = []
  for (let i = 0; i < chunks.length; i++) {
    const filePath = Path.join(dirPath, `chunk-${i + 1}.json`)
    await Fs.promises.writeFile(filePath, JSON.stringify(chunks[i], null, 2))
    filePaths.push(filePath)
  }

  return filePaths
}

/**
 * Main function to process all datasets
 * Reads dataset list and processes each dataset by splitting its pieces into chunks
 */

export default async function () {
  console.log('\n—— Processing datasets...\n')

  // Clean up existing processed datasets directory
  const processedDatasetsPath = Path.resolve(this.options.rootDir, 'static/datasets')
  if (Fs.existsSync(processedDatasetsPath)) {
    Fs.rmSync(processedDatasetsPath, { recursive: true, force: true })
  }

  // Read and parse dataset list
  const datasetListPath = Path.resolve(this.options.rootDir, 'content/data/dataset-list.json')
  const datasetList = JSON.parse(Fs.readFileSync(datasetListPath, 'utf8'))
  
  for (let i = 0; i < datasetList.length; i++) {
    const datasetMetadata = datasetList[i]

    // Skip datasets without a valid slug
    if (!datasetMetadata.slug || datasetMetadata.slug === '') {
      console.log(`❗️ Dataset at position [${i}] in content/data/dataset-list.json is missing a slug property`)
      continue
    }

    // Check if dataset file exists
    const datasetPiecesPath = Path.resolve(this.options.rootDir, 'content/datasets', `${datasetMetadata.slug}.json`)
    if (!Fs.existsSync(datasetPiecesPath)) {
      console.log(`❗️ Dataset [${datasetMetadata.slug}] file does not exist`)
      continue
    }

    // Read and parse dataset data
    const datasetData = Fs.readFileSync(datasetPiecesPath, 'utf8')
    const dataset = JSON.parse(datasetData)
    const pieces = dataset.pieces

    // Record the number of pieces in the dataset
    const pieceCount = pieces.length
    if (!datasetMetadata.hasOwnProperty('cid')) {
      datasetMetadata.cid = pieceCount
    }

    // Split dataset pieces into chunks and save
    const filePaths = await splitDatasetPieces(this.options, pieces, datasetMetadata.slug)

    // Record the number of pages of cids in the dataset
    datasetMetadata.totalPages = filePaths.length

    // Write metadata file to static directory
    const metadataFilePath = Path.resolve(this.options.rootDir, 'static/datasets', datasetMetadata.slug, 'metadata.json')
    Fs.writeFileSync(metadataFilePath, JSON.stringify(datasetMetadata, null, 2))

    console.log(`✅ Dataset [${datasetMetadata.slug}] processed`)
  }

  console.log(`\n—— ${datasetList.length} datasets processed\n`)
}
