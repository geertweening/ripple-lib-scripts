//
// Account Info
//

var Remote = require('ripple-lib').Remote;
var remote = new Remote({servers: [ 'wss://s1.ripple.com:443' ]});

remote.connect(function() {
  var options = {
    account: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    ledger: 'validated'
  };

  var request = remote.requestAccountInfo(options, function(err, info) {
    console.log(JSON.stringify(info, null, 2));
    process.exit(err === void(0));
  });


});