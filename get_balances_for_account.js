var Remote = require('ripple-lib').Remote;

var rippleAccount = '';
var rippleAccount2 = '';


var remote = new Remote({
  trace :         false,
  trusted:        true,
  local_signing:  true,

  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]

});

remote.connect(function() {
  console.log('connected');
  getAccountInfo(rippleAccount);
  getAccountInfo(rippleAccount2);
  // /submitPayment();
});

function getAccountInfo(rippleAccount) {
  var request = remote.requestAccountLines(rippleAccount);
  var xrpRequest = remote.requestAccountInfo(rippleAccount);
  var balances = [];

  request.once('error', function(error) {
    console.log('lines error', error);
  });
  request.once('success', function(result) {
      result.lines.forEach(function(line) {
          balances.push({
            value:         line.balance,
            currency:      line.currency,
            counterparty:  line.account
          });
      });

      console.log('result for: ' + rippleAccount,  balances);

    });


  xrpRequest.once('error', function(error) {
    console.log('xpr error', error);
  });
  xrpRequest.once('success', function(info) {
      balances.push({
        value: info.account_data.Balance / 1000000,
        currency: 'XRP',
        counterparty: ''
      });

      console.log('result for: ' + rippleAccount,  balances);

    });


  xrpRequest.request();
  request.request();
}