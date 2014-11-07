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
  return Math.random() * (400 - 10) + 10;
}

remote.connect(function() {
  console.log('Connected');
  getAccountOffers(rippleAccount, getRandomLimit());
});

function getAccountOffers(rippleAccount, limit, marker) {
  var options = {
    limit: 10
  }

  if (marker) {
    options.marker = marker;
  }

  var request = remote.requestAccountOffers(rippleAccount, options);

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
      getAccountOffers(rippleAccount, getRandomLimit(), result.marker);
    } else {
      done();
    }
  });

  request.request();
}

function done() {
  console.log('all done, ' + accountOffers.length + ' found');
}