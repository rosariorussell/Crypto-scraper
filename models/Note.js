const mongoose = require('mongoose')

const Schema = mongoose.Schema

const noteSchema = new Schema({
  _priceId: {
    type: Schema.Types.ObjectId,
    ref: 'Price'
  },
  date: String,
  noteText: String
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
