//
// Example on how to request account lines and page through the responses
//
// requires ripple-lib 0.9.2-rc4 or higher and rippled-0.26.4-sp2 or higher
//

var Remote = require('ripple-lib').Remote;

var rippleAccount = 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B';
var accountLines = [];

var remote = new Remote({
  trace: false,
  servers: [
    { host: 's-west.ripple.com', port: 443, secure: true }
  ]
});

// min is 10, max is 400
function getRandomLimit() {
  return Math.round(Math.random() * (400 - 10) + 10);
}

remote.connect(function() {
  console.log('Connected');
});

remote.once('ledger_closed', function(ledger) {
  // we need to provide a ledger_index or ledger_hash to make sure we
  // get a complete and reliable result for all account lines
  getAccountLines(rippleAccount, getRandomLimit(), 'validated');
});

function getAccountLines(rippleAccount, limit, ledger_index, marker) {
  var options = {
    account: rippleAccount,
    limit: limit,
    ledger: ledger_index
  }

  if (marker) {
    options.marker = marker;
  }

  var request = remote.requestAccountLines(options);

  request.once('error', function(error) {
    console.log('Request account lines error', error);
  });

  request.once('success', function(result) {
    // console.log(JSON.stringify(result, null, 2));
    console.log('received ' + result.lines.length + ' lines, for limit of ' + limit);
    console.log('ledger_current_index: ' + result.ledger_current_index);
    console.log('ledger_index: ' + result.ledger_index);
    console.log('ledger_hash: ' + result.ledger_hash);
    console.log('validated: ' + result.validated);
    console.log('marker: ' + result.marker);

    result.lines.forEach(function(line) {
        accountLines.push({
          value:         line.balance,
          currency:      line.currency,
          counterparty:  line.account
        });
    });

    // if there's a marker, keep on querying
    if (result.marker) {
      ledger_index = result.ledger_hash || result.ledger_index || result.ledger_current_index || ledger_index;
      console.log('used ledger index', ledger_index);
      getAccountLines(rippleAccount, getRandomLimit(), ledger_index, result.marker);
    } else {
      done();
    }
  });

  request.request();
}

function done() {
  console.log('all done, ' + accountLines.length + ' found');
  // to print the result
  // console.log(JSON.stringify(accountLines, null, 2));
  process.exit();
}