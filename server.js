const express = require('express')
const bodyParser = require('body-parser')

var app = express()
var PORT = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var Router = require('./controllers/main')
app.use('', Router)

app.listen(PORT, function () {
  console.log('listening on ' + PORT)
})

module.exports = app
