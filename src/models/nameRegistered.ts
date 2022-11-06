const mongoose = require('mongoose');
 

const Schema = mongoose.Schema;
const NameRegisteredSchema = new Schema({

    address:String,
    blockNumber:{ },
    transactionHash:String,
    args:{},
    label:String,
    owner:String

}, { collection: 'NameRegistered' })

module.exports = mongoose.model('NameRegistered', NameRegisteredSchema);