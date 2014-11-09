//
// get balances for given set of accounts
// the balances are the total sum of both XRP and IOU's
// balances for IOU's get retrieved by retrieving the account lines and summing the balances
// balances for XRP get retrieved by account info
//
// requires ripple-lib 0.9.2-rc5 or higher
//

var Remote = require('ripple-lib').Remote;
var _       = require('lodash');
var Promise = require('bluebird');

var accounts = [
  {
    'name' : '',
    'address' : ''
  },
  {
    'name' : '',
    'address' : ''
  }
]

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
  getAccountInfoForAccounts(accounts);
});

function getAccountInfoForAccounts(accounts) {

  var promises = _.map(accounts, function(account) {

    return new Promise(function (resolve, reject) {
      Promise.all([getXRPBalance(account), getBalances(account)])
      .then(function(data) {
        var result = {
          'account' : account,
          'balances' : [data[0]].concat(data[1])
        }
        resolve(result);
      })
      .error(reject);
    });

  });

  Promise.all(promises)
  .then(function(data) {
    console.log('all accounts have been processed');
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  })
  .error(function(e) {
    console.log("Error", e);
    process.exit(1);
  });

}


function getBalances(account) {
  return new Promise(function (resolve, reject) {
    var request = remote.requestAccountLines({account: account.address});

    // reject on error
    request.once('error', reject);

    // parse result on success
    request.once('success', function(result) {
      var balances = [];
        result.lines.forEach(function(line) {
            balances.push({
              value:         line.balance,
              currency:      line.currency,
              counterparty:  line.account
            });
        });

        resolve(balances);
      });

    request.request();
  });

}

function getXRPBalance(account) {

  return new Promise(function (resolve, reject) {
    var xrpRequest = remote.requestAccountInfo({account: account.address});

    // reject on error
    xrpRequest.once('error', reject);

    // parse result on success
    xrpRequest.once('success', function(result) {
      resolve({
        value: result.account_data.Balance / 1000000,
        currency: 'XRP',
        counterparty: ''
      });
    });

    xrpRequest.request();
  });

}
