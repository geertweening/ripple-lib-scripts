/*
Submit a payment with a memo field entry
in this case the base64 representation of the local file image.js
*/

var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var ripple = require('ripple-lib');
var sjcl = require('sjcl');
var fs = require('fs');

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

  readFile(function(err, imageData) {
    if (err) {
      return console.error(err);
    }

    submitXRPPayment(fromAccount, toAccount, 1, imageData);
  });
});


function readFile(callback) {
  fs.readFile('image.js', function(err, original_data){
    if (err) {
      return callback(err);
    }

    var base64FileContents = new Buffer(original_data).toString('base64');
    callback(null, base64FileContents);
  });
}


function submitXRPPayment(fromAccount, toAccount, xrpAmount, memoData) {

  // construct transaction
  var transaction = new ripple.Transaction(remote);
  transaction.payment(
    fromAccount,
    toAccount,
    xrpAmount
  );

  // set secret
  transaction.secret(fromAccountSecret);

  // add memo
  transaction.addMemo('image.js', memoData);

  var memo = transaction.tx_json.Memos[0];

  console.log('memo size: ', memo.Memo.MemoData.length);

  console.log('MemoType', sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(memo.Memo.MemoType)));
  console.log('MemoData', sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(memo.Memo.MemoData)));

  var base64string = sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(memo.Memo.MemoData));
  console.log(new Buffer(base64string, 'base64').toString('utf8'));

  console.log('\nSubmitting transaction\n');
  transaction.submit(function(err, res) {
    if (err) {
      console.error('Error occurred while submitting', err);
    } else {
      if (res.metadata.TransactionResult === 'tesSUCCESS') {
        console.log('payment succussfully submitted');
        console.log('hash: ', res.tx_json.hash);
        console.log('memo: ');
        console.log('\tMemoType: ', sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(res.tx_json.Memos[0].Memo.MemoType)));
        console.log('\tMemoData: ', sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(res.tx_json.Memos[0].Memo.MemoData)));

        var base64string = sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(res.tx_json.Memos[0].Memo.MemoData));
        console.log('\n\n', new Buffer(base64string, 'base64').toString('utf8'));
      }
    }

  });

}