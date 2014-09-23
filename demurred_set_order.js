var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;

var rippleAccount = '';
var rippleSecret = '';

var currencies = {
  xrp: {
    currency: 'XRP'
  },
  staging_geert_XAU: {
    issuer: 'radqi6ppXFxVhJdjzaATRBxdrPcVTf1Ung',
    currency: '0158415500000000C1F76FF6ECB0BAC600000000'
  },
  staging_geert_USD: {
    issuer: 'radqi6ppXFxVhJdjzaATRBxdrPcVTf1Ung',
    currency: 'USD'
  }

}

var remote = new Remote({
  trace :         false,
  trusted:        true,
  local_signing:  true,

  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]

});

remote.connect(function() {
  submitOrder();
});

function submitOrder() {
  var tx = remote.transaction();

  var sell = Amount.from_json('1/' + currencies.staging_geert_XAU.currency + '/' + currencies.staging_geert_XAU.issuer);
  var buy = Amount.from_json('400/' + currencies.staging_geert_USD.currency + '/' + currencies.staging_geert_USD.issuer);

  tx.offer_create(
    rippleAccount,
    sell,
    buy
  );

  tx.set_flags('Sell');

  tx.on('proposed', function (res) {
    console.log('proposed', res);
  });

  tx.on('success', function(res) {
    console.log('success', res);
  });

  tx.on('error', function (err) {
   console.log('error', err);
  });

  tx.secret(rippleSecret);
  tx.submit();

}


