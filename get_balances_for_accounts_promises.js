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


    var results = _.map(data, function(entry) {
      // console.log(JSON.stringify(entry[0], null, 2));
    });
  })
  .error(function(e) {
    console.log("Error", e);
  });

}


function getBalances(account) {
  return new Promise(function (resolve, reject) {
    var request = remote.requestAccountLines(account.address);

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
    var xrpRequest = remote.requestAccountInfo(account.address);

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