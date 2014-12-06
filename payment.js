/*
Submit a payment
*/

var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var ripple = require('ripple-lib');

var fromAccount = '';
var fromAccountSecret = '';
var toAccount = '';

var remote = new Remote({
  trace :         true,
  trusted:        true,
  local_signing:  true,

  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]
});

var request = remote.connect(function() {
  console.log('connected to rippled\n');
  submitPayment(
    fromAccount,
    toAccount,
    Amount.from_json({
      value: '0.00000001',
      currency: 'USD',
      issuer: 'radqi6ppXFxVhJdjzaATRBxdrPcVTf1Ung'
    })
  );
});

request.on('error', function(error) {
  console.log('error', error);
})


function submitPayment(fromAccount, toAccount, amount) {

  console.log(amount.to_json())

  // construct transaction
  var transaction = new ripple.Transaction(remote);

  // amount needs to ben a Amount object
  transaction.payment(
    fromAccount,
    toAccount,
    amount
  );

  // set secret
  transaction.secret(fromAccountSecret);

  console.log('\nSubmitting transaction\n');

  // you can use both a callback and event listeners
  // the callback returns an error and or response
  // this is effectively the same as the `error` and
  // `success` events
  var request = transaction.submit(function(err, res) {
    if (err) {
      console.error('Error occurred while submitting', err);
      process.exit(1);
    } else {
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
    }
  });

  request.on('error', function(message) {
    // console.log('error', message);
  });

  request.on('success', function(message) {
    // console.log('success', message);
  });

  // state will be be called on the different states a transaction goes through
  request.on('state', function(message) {
    console.log('state', message);
  });

}