//
// Subscribing to streams
//

/* Loading ripple-lib with Node.js */
var Remote = require('ripple-lib').Remote;

var remote = new Remote({
  // see the API Reference for available options
  servers: [ 'wss://s-west.ripple.com:443' ]
});

remote.connect(function() {
  console.log('Remote connected');

  var streams = [
    'ledger',
    'transactions'
  ];

  var request = remote.requestSubscribe(streams);

  request.on('error', function(error) {
    console.log('request error: ', error);
  });


  // the `ledger_closed` and `transaction` will come in on the remote
  // since the request for subscribe is finalized after the success return
  // the streaming events will still come in, but not on the initial request
  remote.on('ledger_closed', function(ledger) {
    console.log('ledger_closed: ', JSON.stringify(ledger, null, 2));
  });

  remote.on('transaction', function(transaction) {
    console.log('transaction: ', JSON.stringify(transaction, null, 2));
  });

  remote.on('error', function(error) {
    console.log('remote error: ', error);
  });

  // fire the request
  request.request();
});