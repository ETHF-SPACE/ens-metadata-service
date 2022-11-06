const mongoose = require('mongoose');
 

const Schema = mongoose.Schema;
const NameRegisteredSchema = new Schema({

    address:String,
    blockNumber:{ },
    transactionHash:String,
    args_name:String,
    args_owner:String,
    args_label:String,
    block_time:Number,
    args_expires:{},

}, { collection: 'NameRegistered' })

module.exports = mongoose.model('NameRegistered', NameRegisteredSchema);