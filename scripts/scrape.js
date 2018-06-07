const request = require('request')
const cheerio = require('cheerio')

const scrape = function (cb) {
  request('https://coinmarketcap.com/', function (err, res, body) {
    if (err) throw err

    var $ = cheerio.load(body)

    var cryptoList = []

    $('tbody tr').each(function (i, element) {
      var name = $(this).children('.currency-name').children('.currency-name-container').text().trim()
      var price = $(this).children('.market-cap').data('sort')

      if (name && price) {
        var dataToAdd = {
          name,
          price
        }

        cryptoList.push(dataToAdd)
      }
    })

    cb(cryptoList)
  })
}

module.exports = scrape
