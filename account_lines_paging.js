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
  return Math.random() * (400 - 10) + 10;
}

remote.connect(function() {
  console.log('Connected');
  getAccountLines(rippleAccount, getRandomLimit());
});

function getAccountLines(rippleAccount, limit, marker) {
  var options = {
    limit: limit
  }

  if (marker) {
    options.marker = marker;
  }

  var request = remote.requestAccountLines(rippleAccount, options);

  request.once('error', function(error) {
    console.log('Request account lines error', error);
  });

  request.once('success', function(result) {
    console.log('received ' + result.lines.length + ' lines, for limit of ' + limit);
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
      getAccountLines(rippleAccount, getRandomLimit(), result.marker);
    } else {
      done();
    }
  });

  request.request();
}

function done() {
  console.log('all done, ' + accountLines.length + ' found');
}