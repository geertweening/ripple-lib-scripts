// Read the balances for a given account
// get the trust lines
// find the trust line for XAU (-0.5%pa)
// apply demurrage
// print result

var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;

// enter an account with a trust line containing XAU (-0.5%pa) -> hex: 0158415500000000C1F76FF6ECB0BAC600000000
var rippleAccount = '';

var remote = new Remote({
  trace :         false,
  trusted:        true,
  local_signing:  true,

  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]

});

remote.connect(function() {
  getBalances(rippleAccount);
});

function getBalances(account) {

  // request account lines
  remote.request_account_lines(account)
    .on('success', function(data) {
      console.log('SUCCESS');

      // on success find, the XAU
      processXAU(data);
      process.exit(0);
    })
    .on('error', function(data){
      console.log('ERROR');
      console.log(data);
      process.exit(1);
    }).request();
}

// - walk through trust lines
// - find the XAU currency
// - apply demurrage
function processXAU(data) {
   for (var n=0, l=data.lines.length; n<l; n++) {
    var line = data.lines[n];

    // find the XAU (-0.5%pa)
    if (line.currency === '0158415500000000C1F76FF6ECB0BAC600000000') {

      // print the trustline
      console.log(line);

      // print the current balance, this is what is saved in the ledger
      console.log('balance in ledger: ' + line.balance);

      // apply demurrage
      var demAmount = Amount.from_json(line.balance + '/' + line.currency + '/' + line.account);
      demAmount = demAmount.applyInterest(new Date());

      // print the value of XAU (-0.5%pa) as it's value today
      console.log('balance now: ' + demAmount.to_json().value);
    }
  }
}
