const mongoose = require('mongoose')

const Schema = mongoose.Schema

const priceSchema = new Schema({
  crypto: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  date: String,
  saved: {
    type: Boolean,
    default: false
  }
})

const Price = mongoose.model('Price', priceSchema)

module.exports = Price
