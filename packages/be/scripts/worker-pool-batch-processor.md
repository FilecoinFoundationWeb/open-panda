## Multithread Batch Processing via Workerpool

### Overview

The `worker-pool-batch-processor.js` module manages a pool of node workers to process large lists of data or objects in batches. It is a simple layer built on top of the [workerpool npm package](https://www.npmjs.com/package/workerpool) that specifically makes processing large datasets in batches quick and straightforward. The worker-pool-batch-processor script exports two functions; `CreateWorkerPool` and `InitializeWorker`. 

`CreateWorkerPool` instantiates a pool of workers using the workerpool npm package. It then proceeds to siphon and queue batches from a manifest list one at a time. The manifest list can either be a list of data, objects or references to files. How this list is processed or used for processing depends entirely on the script supplied to `CreateWorkerPool`, the contents of which are passed on to each individual worker. The `CreateWorkerPool` function is agnostic to the contents of the script and only handles delegating batches to workers and managing results returned from each worker.

There are four arguments that the function will accept:

- **pathToScript**: (String) an absolute path to a script which each worker will run
- **operation**: (String) the name of the root function in the script that the worker will interface with
- **manifest**: (Array) an array of data to process or use within the script
- **options**: (Object) an object with the following options:
  - _threads_: (Number) the number of workers to run simultaneously
  - _batchSize_: (Number) how big each batch of data should be that is processed by each worker
  - _onBatchResult_: (Function) a function called that when a worker has finished a batch and returns the results of the batch processing. It is passed three arguments by the worker:
    - 1. result: the result returned by the worker
    - 2. num: the batch number
    - 3. results: all results to date including this result as the most recent
    These arguments would typically be used to display the worker pool's progress as each batch is completed.
  - _onWorkerPoolComplete_: (Function) a function that is called on completion of processing the entire manifest list. i.e. all workers and queued tasks have completed. This function is passed two arguments:
    - 1. results: (Array) an array of the results from each individual batch
    - 2. errors: (Array) an array of any errors returned by a worker while processing a batch

`InitializeWorker` is a simple initialization function that takes a single argument: 
- **operation**: (Function) a function that each worker will perform on each batch it receives. The name of this function must match the operation string described above.


### Use

The module must be used with two separate scripts: 

One runs in the main thread and is the source of the manifest list passed to the worker pool. In this thread/script the `CreateWorkerPool` function must be imported from the `worker-pool-batch-processor.js` module and called at the appropriate step with the arguments described above.

Likewise, the `InitializeWorker` function must be imported in a script representing all processes to be executed in a worker thread. This function must be called as the last step in the script and must be passed the top-most function in the script whose name exactly matches the operation string passed to the `CreateWorkerPool` function.
This function (the operation passed as an argument to `InitializeWorker`) must return a Promise which either resolves with the result of a processed batch or rejects upon error or null result. 
