/*
Submit a payment with a memo field entry
in this case the base64 representation of the local file image.js
*/

var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var ripple = require('ripple-lib');
var sjcl = require('sjcl');

var fromAccount = '';
var fromAccountSecret = '';
var toAccount = '';

var remote = new Remote({
  trace :         false,
  trusted:        true,
  local_signing:  true,

  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]
});

remote.connect(function() {
  console.log('connected to rippled\n');
  submitXRPPayment(fromAccount, toAccount, 1);
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

  var someString = ""
  for (i=0; i<250; i++) {
    someString += "𦨴";
  }

  // 1000 bytes, for 250 utf-8 characters that take up 4 bytes each
  console.log(Buffer.byteLength(someString, 'utf-8'));
  console.log(sjcl.codec.hex.fromBits(sjcl.codec.utf8String.toBits(someString)).length/2);

  // set memo
  transaction.addMemo(void(0), someString);

  console.log('\nSubmitting transaction\n');
  var request = transaction.submit(function(err, res) {
    if (err) {
      console.error('Error occurred while submitting', err);
    } else {
      console.log(JSON.stringify(res, null, 2));
    }
  });

  request.on('error', function(message) {
    console.log('error', message);
  });

  request.on('success', function(message) {
    console.log('success', message);
    // var memo = message.tx_json.Memos[0].Memo.MemoData;
    // console.log(sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(memo)));
  });

  request.on('state', function(message) {
    console.log('state', message);
  });

}