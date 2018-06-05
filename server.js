const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const expressHandlebars = require('express-handlebars')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000
const app = express()

const router = express.Router()
require('./config/routes')(router)

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(router)

const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/CryptoScraper'

mongoose.connect(db, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('mongoose connection successful')
  }
})

app.listen(PORT, function () {
  console.log('listening on ' + PORT)
})

module.exports = app
