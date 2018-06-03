const express = require('express')
const path = require('path')

const Router = () => {
  'use strict'

  const appRoot = path.join(__dirname, '..')

  const Router = express.Router()

  /// /////////////////////////////////////////
  /// //          Routes          ////////////
  /// ///////////////////////////////////////
  // -- put all of your main routes here

  Router.get('/', (req, res) => {
    res.sendFile(appRoot + '/views/index.html')
  })

  return Router
}

// export htmlRoutes
module.exports = (Router)()
