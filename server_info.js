//
// Requesting info from a rippled
//

/* Loading ripple-lib with Node.js */
var Remote = require('ripple-lib').Remote;

var remote = new Remote({
  // see the API Reference for available options
  servers: [ 'wss://s-west.ripple.com:443' ]
});

remote.connect(function() {
  /* remote connected */
  remote.requestServerInfo(function(err, info) {
    console.log(err, info);
    process.exit(err === void(0));
  });
});