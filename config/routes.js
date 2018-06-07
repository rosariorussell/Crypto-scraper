const scrape = require('../scripts/scrape')

const pricesController = require('../controllers/prices')
const notesController = require('../controllers/notes')

module.exports = function (router) {
  router.get('/', function (req, res) {
    res.render('home')
  })

  router.get('/saved', function (req, res) {
    res.render('saved')
  })

  router.get('/api/fetch', function (req, res) {
    pricesController.fetch(function (err, docs) {
      if (err) throw err
      if (!docs || docs.insertCount === 0) {
        res.json({
          message: 'No new prices. Check again later'
        })
      } else {
        res.json({
          message: 'Added ' + docs.insertCount + 'new prices'
        })
      }
    })
  })
  router.get('/api/prices', function (req, res) {
    var query = {}
    if (req.query.saved) {
      query = req.query
    }
    pricesController.get(query, function (data) {
      res.json(data)
    })
  })

  router.delete('/api/prices/:id', function (req, res) {
    var query = {}
    query._id = req.params.id
    pricesController.delete(query, function (err, data) {
      if (err) throw err
      res.json(data)
    })
  })

  router.patch('/api/prices', function (err, res) {
    if (err) throw err
    pricesController.update(req.body, function (err, data) {
      if (err) throw err
      res.json(data)
    })
  })

  router.get('/api/notes/:price_id?', function (req, res) {
    var query = {}
    if (req.params.price_id) {
      query._id = req.params.price_id
    }

    notesController.get(query, function (err, data) {
      if (err) throw err
      res.json(data)
    })
  })

  router.delete('/api/notes/:id', function (req, res) {
    var query = {}
    query._id = req.params.id
    notesController.delete(query, function (err, data) {
      if (err) throw err
      res.json(data)
    })
  })

  router.post('/api/notes', function (req, res) {
    notesController.save(req.body, function (data) {
      res.json(data)
    })
  })
}
