const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  id : { type : Number, required: true, unique: true },
  url: { type : String, required: true }
})

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;
