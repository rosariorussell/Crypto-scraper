$(document).ready(function () {
  // Setting a reference to the crypto-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save crypto"
  // and "scrape new crypto" buttons
  var cryptoContainer = $('.crypto-container')
  $(document).on('click', '.btn.save', handleCryptoSave)
  $(document).on('click', '.scrape-new', handleCryptoScrape)

  // Once the page is ready, run the initPage function to kick things off
  initPage()

  function initPage () {
    // Empty the crypto container, run an AJAX request for any unsaved prices
    cryptoContainer.empty()
    $.get('/api/prices?saved=false').then(function (data) {
      // If we have prices, render them to the page
      if (data && data.length) {
        renderCryptos(data)
      } else {
        // Otherwise render a message explaing we have no cryptos
        renderEmpty()
      }
    })
  }

  function renderCryptos (cryptos) {
    // This function handles appending HTML containing our crypto data to the page
    // We are passed an array of JSON containing all available cryptos in our database
    var cryptoPanels = []
    // We pass each crypto JSON object to the createPanel function which returns a bootstrap
    // panel with our crypto data inside
    for (var i = 0; i < cryptos.length; i++) {
      cryptoPanels.push(createPanel(cryptos[i]))
    }
    // Once we have all of the HTML for the cryptos stored in our cryptoPanels array,
    // append them to the cryptoPanels container
    cryptoContainer.append(cryptoPanels)
  }

  function createPanel (crypto) {
    // This functiont takes in a single JSON object for an crypto/price
    // It constructs a jQuery element containing all of the formatted HTML for the
    // crypto panel
    var url = 'https://coinmarketcap.com/currencies/'
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        '<h3>',
        "<a class='crypto-link' target='_blank' href='" + url + crypto.name + "'>",
        crypto.name,
        '</a>',
        "<a class='btn btn-success save'>",
        'Save Crypto',
        '</a>',
        '</h3>',
        '</div>',
        "<div class='panel-body'>",
        crypto.price,
        '</div>',
        '</div>'
      ].join('')
    )
    // We attach the crypto's id to the jQuery element
    // We will use this when trying to figure out which crypto the user wants to save
    panel.data('_id', crypto._id)
    // We return the constructed panel jQuery element
    return panel
  }

  function renderEmpty () {
    // This function renders some HTML to the page explaining we don't have any cryptos to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new cryptos.</h4>",
        '</div>',
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        '<h3>What Would You Like To Do?</h3>',
        '</div>',
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Cryptos</a></h4>",
        "<h4><a href='/saved'>Go to Saved Cryptos</a></h4>",
        '</div>',
        '</div>'
      ].join('')
    )
    // Appending this data to the page
    cryptoContainer.append(emptyAlert)
  }

  function handleCryptoSave () {
    // This function is triggered when the user wants to save an crypto
    // When we rendered the crypto initially, we attatched a javascript object containing the price id
    // to the element using the .data method. Here we retrieve that.
    var cryptoToSave = $(this).parents('.panel').data()
    cryptoToSave.saved = true
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: 'PUT',
      url: '/api/prices',
      data: cryptoToSave
    }).then(function (data) {
      // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
      // (which casts to 'true')
      if (data.ok) {
        // Run the initPage function again. This will reload the entire list of cryptos
        initPage()
      }
    })
  }

  function handleCryptoScrape () {
    // This function handles the user clicking any "scrape new crypto" buttons
    $.get('/api/fetch').then(function (data) {
      // If we are able to succesfully scrape the NYTIMES and compare the cryptos to those
      // already in our collection, re render the cryptos on the page
      // and let the user know how many unique cryptos we were able to save
      initPage()
      bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + '<h3>')
    })
  }
})
