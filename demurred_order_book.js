// Read order book for a currency pair with a demurred currency
// get the order book
// apply demurring to the orders with a demurred currency to reflect the rate for today
//
// This example doesn't actually change the orders, it copies the TakerGets and TakerPays object and updates the value
// the result is only printed, the original order that is returned is not modified
//
// For your usecase you might want to update the resulting orders

var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;

var currencies = {
  xrp: {
    currency: 'XRP'
  },
  staging_geert_XAU: {
    issuer: 'radqi6ppXFxVhJdjzaATRBxdrPcVTf1Ung',
    currency: '0158415500000000C1F76FF6ECB0BAC600000000'
  },
  staging_geert_USD: {
    issuer: 'radqi6ppXFxVhJdjzaATRBxdrPcVTf1Ung',
    currency: 'USD'
  }

}

var remote = new Remote({
  trace :         false,
  trusted:        true,
  local_signing:  true,

  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]

});

remote.connect(function() {

  // retreive order books for currency pairs containing a demurring currency
  getOrderBook(currencies.staging_geert_USD, currencies.staging_geert_XAU);
  getOrderBook(currencies.staging_geert_XAU, currencies.staging_geert_USD);
});


function getOrderBook(_gets, _pays) {
  var options = {
    gets: _gets,
    pays: _pays,
    limit: 100
  };

  var request = remote.requestBookOffers(options);

  request.on('success', function (data) {
    console.log('SUCCESS: ' + _gets.currency + '/' + _pays.currency);
    console.log(JSON.stringify(data, null, 4));
    parseOrder(data);

  });
  request.on('error', function(err) {
    console.log('ERROR: ' + _gets.currency + '/' + _pays.currency);
    console.log(JSON.stringify(err, null, 4));
  });
  request.request();
}

function calculateValue(offer) {
  var demAmount = Amount.from_json(offer.value + '/' + offer.currency + '/' + offer.issuer);
  demAmount = demAmount.applyInterest(new Date());
  return demAmount.to_json().value;
}

function parseOrder(data) {

  for (var n=0, l=data.offers.length; n<l; n++) {
    var offer = data.offers[n];

    var takerGets = offer.TakerGets;
    var offerPays = offer.TakerPays;

    if (takerGets.currency === '0158415500000000C1F76FF6ECB0BAC600000000') {
      console.log("ledger value XAU (0.5%pa): ", takerGets.value);
      takerGets.value = calculateValue(takerGets);
      console.log("value today XAU (0.5%pa):  ", takerGets.value);
    }

    if (offerPays.currency === '0158415500000000C1F76FF6ECB0BAC600000000') {
      console.log("ledger value XAU (0.5%pa): ", offerPays.value);
      offerPays.value = calculateValue(offerPays);
      console.log("value today XAU (0.5%pa):  ", offerPays.value);
    }
  }
}

