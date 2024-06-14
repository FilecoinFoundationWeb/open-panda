// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const WorkerPool = require('workerpool')
let startTime

// /////////////////////////////////////////////////////////////////// Functions
// ------------------------------------ Convert Seconds To Hours|Minutes|Seconds
const SecondsToHms = (seconds) => {
  const input = Number(seconds)
  const h = Math.floor(input / 3600)
  const m = Math.floor(input % 3600 / 60)
  const s = Math.floor(input % 3600 % 60)
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : ''
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : ''
  return hDisplay + mDisplay + sDisplay
}

// ---------------------------------------------------------------- LogPoolStats
const logPoolStatus = (Pool, num) => {
  const activeTasks = `${Pool.stats().activeTasks} batches currently being processed`
  const pendingTasks = `${Pool.stats().pendingTasks} pending batches remaining`
  console.log(`Batch ${num} finished | ${activeTasks} | ${pendingTasks}`)
}

// ----------------------------------------------------- ScheduleBatchOperations
const scheduleBatchOperation = (
  Pool,
  manifest,
  operation,
  options = {},
  batchNo = 1,
  tasks = [],
  results = [],
  errors = []
) => {
  try {
    if (batchNo === 1) { 
      startTime = process.hrtime()[0]
      console.log('🤖 Worker pool started')
    }
    const batchSize = options.batchSize || 10
    const batch = manifest.slice(0, batchSize)
    const num = batchNo
    tasks.push(
      Pool.exec(operation, [batch, num]).then(async (result) => {
        if (!result) {
          throw new Error(`An issue occured with batch ${num}`)
        }
        results.push(result)
        logPoolStatus(Pool, num)
        if (typeof options.onBatchResult === 'function') {
          options.onBatchResult(result, num, results)
        }
      }).catch((e) => {
        errors.push({ num, batch, error: e })
        console.log(`Error returned by worker: Could not process batch ${num}.`)
        console.error(e)
      })
    )
    // remove batch from the manifest list
    manifest.splice(0, batchSize)
    // If there are items remaining in the manifest list, schedule a next batch
    // Otherwise proceed with compiling final results
    if (manifest.length) {
      scheduleBatchOperation(Pool, manifest, operation, options, ++batchNo, tasks, results, errors)
    } else {
      Promise.all(tasks).catch((e) => {
        console.log('=========================== Error returned by worker pool')
        console.log(e)
        process.exit(0)
      }).then(async () => {
        const endTime = process.hrtime()[0]
        console.log(`✅ Worker pool task list complete | took ${SecondsToHms(endTime - startTime)}`)
        if (typeof options.onWorkerPoolComplete === 'function') {
          options.onWorkerPoolComplete(results, errors)
        }
        Pool.terminate()
        process.exit(0)
      })
    }
  } catch (e) {
    console.log('======================= [Function: performCidBatchOperations]')
    console.log(e)
  }
}

// ------------------------------------------------------------ CreateWorkerPool
const CreateWorkerPool = async (pathToScript, operation, manifest, options) => {
  try {
    const Pool = WorkerPool.pool(pathToScript, {
      maxWorkers: options.threads || 15,
      workerType: 'thread'
    })
    scheduleBatchOperation(Pool, manifest, operation, options)
  } catch (e) {
    console.log('=========================== [Function: Initialize Worker Pool')
    console.log(e)
  }
}

// ------------------------------------------------------------ InitializeWorker
const InitializeWorker = (operation) => {
  const initOperation = {}
  initOperation[operation.name] = operation
  WorkerPool.worker(initOperation)
}

// --------------------------------------------------------------------- Exports
module.exports = {
  CreateWorkerPool,
  InitializeWorker
}
