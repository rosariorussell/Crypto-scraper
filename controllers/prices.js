const scrape = require('../scripts/scrape')
const makeDate = require('../scripts/date')

const Price = require('../models/Price')

module.exports = {
  fetch: function (cb) {
    scrape(function (data) {
      var cryptos = data
      for (var i = 0; i < cryptos.length; i++) {
        cryptos[i].date = makeDate()
        cryptos[i].saved = false
      }

      Price.collection.insertMany(cryptos, { ordered: false }, function (err, docs) {
        cb(err, docs)
      })
    })
  },
  delete: function (query, cb) {
    Price.remove(query, cb)
  },
  get: function (query, cb) {
    Price.find(query)
      .sort({
        _id: -1
      })
      .exec(function (err, doc) {
        if (err) throw err
        cb(doc)
      })
  },
  update: function (query, cb) {
    Price.update({ _id: query._id }, {
      $set: query
    }, {}, cb)
  }

}
