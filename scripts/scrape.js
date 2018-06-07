const request = require('request')
const cheerio = require('cheerio')

const scrape = function (cb) {
  request('https://coinmarketcap.com/', function (err, res, body) {
    if (err) throw err

    var $ = cheerio.load(body)

    var cryptos = []

    $('tbody tr').each(function (i, element) {
      var name = $(this).children('.currency-name').children('.currency-name-container').text().trim()
      var price = $(this).children('.market-cap').data('sort')

      if (name && price) {
        var dataToAdd = {
          name,
          price
        }

        cryptos.push(dataToAdd)
      }
    })

    cb(cryptos)
  })
}

module.exports = scrape
