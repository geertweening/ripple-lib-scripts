//
// create address/secret pair and fund to create a wallet
//

var ripple = require('ripple-lib');
var sjcl = require('sjcl');

var fromAccount = '';
var fromAccountSecret = '';

// generate a new address/secret pair
var newAccount = ripple.Wallet.generate();

// store the secret somewhere safe!
console.log(JSON.stringify(newAccount));
var toAccount = newAccount.address;

var remote = new ripple.Remote({
  trace :         false,
  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]
});

remote.connect(function() {
  console.log('connected to rippled\n');
  submitXRPPayment(fromAccount, toAccount, 30);
});


function submitXRPPayment(fromAccount, toAccount, xrpAmount) {

  // construct transaction
  var transaction = new ripple.Transaction(remote);
  transaction.payment(
    fromAccount,
    toAccount,
    xrpAmount
  );

  // set secret
  transaction.secret(fromAccountSecret);

  console.log('\nSubmitting transaction\n');
  var transaction = transaction.submit(function(err, info) {
    console.log('result', err, info);
  });

  transaction.on('error', function(message) {
    console.log('error', message);
  });

  transaction.on('success', function(message) {
    console.log('success', message);
  });

  transaction.on('state', function(message) {
    console.log('state', message);
  })

}