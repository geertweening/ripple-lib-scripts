//
// Example on how to request account currencies
//
// requires ripple-lib 0.9.2-rc4 or higher
//

var Remote = require('ripple-lib').Remote;

var rippleAccount = '';

var remote = new Remote({
  // enable trace for websocket requests and responses
  trace: false,
  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]
});

remote.connect(function() {
  console.log('connected');
  getAccountInfo(rippleAccount);
});

function getAccountInfo(rippleAccount) {
  var request = remote.requestAccountCurrencies({account: rippleAccount})
  var balances = [];

  request.once('error', function(error) {
    console.log('lines error', error);
    done();
  });

  request.once('success', function(result) {
    console.log("account: " + rippleAccount);
    console.log(result);
    done();
  });

  request.request();
}

function done() {
  process.exit(0);
}