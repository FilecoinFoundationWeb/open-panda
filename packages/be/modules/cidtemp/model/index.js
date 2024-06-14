console.log('💿 [model] op_cids_temp')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const CIDtempSchema = new Schema({
  piece_cid: {
    type: String,
    required: true
  },
  payload_cid: {
    type: String,
    required: true,
    index: true
  },
  raw_car_file_size: {
    type: Number,
    required: true
  },
  dataset_slug: {
    type: String,
    required: true
  },
  web3storageCreatedAt: {
    type: Date,
    required: true
  },
  web3storageUpdatedAt: {
    type: Date,
    required: true
  },
  filename: {
    type: String,
    required: true
  }
}, {
  timestamps: false
})

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('op_cids_temp', CIDtempSchema)
