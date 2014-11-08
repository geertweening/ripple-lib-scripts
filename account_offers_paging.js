//
// Example on how to request account offers and page through the responses
//
// requires ripple-lib 0.9.2-rc4 or higher
//

var Remote = require('ripple-lib').Remote;

var rippleAccount = 'rBwhtkgKgq7cDnMNUAK98LBV1eRXsC9yzs';
var accountOffers = [];

var remote = new Remote({
  trace: false,
  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]
});

// min is 10, max is 400
function getRandomLimit() {
  return Math.round(Math.random() * (400 - 10) + 10);
}

remote.connect(function() {
  console.log('Connected');

});

remote.once('ledger_closed', function(ledger) {
  // we need to provide a ledger_index or ledger_hash to make sure we
  // get a complete and reliable result for all account lines
  getAccountOffers(rippleAccount, getRandomLimit(), ledger.ledger_index);
});

function getAccountOffers(rippleAccount, limit, ledger_index, marker) {
  var options = {
    account: rippleAccount,
    limit: limit,
    ledger: ledger_index
  }

  if (marker) {
    options.marker = marker;
  }

  var request = remote.requestAccountOffers(options);

  request.once('error', function(error) {
    console.log('Request account offers error', error);
  });

  request.once('success', function(result) {
    console.log('received ' + result.offers.length + ' offers, for limit of ' + limit);
    console.log('marker: ' + result.marker);

    // console.log(JSON.stringify(result, null, 2));

    result.offers.forEach(function(offer) {
        accountOffers.push(offer);
    });

    // if there's a marker, keep on querying
    if (result.marker) {
      getAccountOffers(rippleAccount, getRandomLimit(), ledger_index, result.marker);
    } else {
      done();
    }
  });

  request.request();
}

function done() {
  console.log('all done, ' + accountOffers.length + ' found');
  process.exit();
}