module.exports = function (router) {
  router.get('/', function (req, res) {
    console.log('this worked')
    res.render('home')
  })

  router.get('/saved', function (req, res) {
    res.render('saved')
  })
}
