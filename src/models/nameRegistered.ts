const mongoose = require('mongoose');
 

const Schema = mongoose.Schema;
const NameRegisteredSchema = new Schema({

    address:String,
    blockNumber:{ },
    transactionHash:String,
    args_name:String,
    args_owner:String,
    args_label:String

}, { collection: 'NameRegistered' })

module.exports = mongoose.model('NameRegistered', NameRegisteredSchema);