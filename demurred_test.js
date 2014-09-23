// Read the balances for a given account
// get the trust lines
// find the trust line for XAU (-0.5%pa)
// apply demurrage
// print result

var Currency = require('ripple-lib').Currency;
var Amount = require('ripple-lib').Amount;

var xau = Currency.from_json('0158415500000000C1F76FF6ECB0BAC600000000');
console.log("yearly interst: ", xau.get_interest_percentage_at(xau._interest_start + 3600 * 24 * 365, 20));
console.log("human representation: ", xau.to_human());

var demAmount = Amount.from_json('0.25' + '/' + '0158415500000000C1F76FF6ECB0BAC600000000' + '/' + 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67');
console.log(demAmount.to_json());
// demAmount = demAmount.applyInterest(461791165.60930955);
console.log(demAmount.applyInterest().to_json());
// demAmount = demAmount.applyInterest(new Date());
console.log(demAmount.applyInterest(new Date()).to_json());


var interest = demAmount.currency().get_interest_at(new Date());

// XXX If we had better math utilities, we wouldn't need this hack.
var interestTempAmount = Amount.from_json(''+interest+'/1/1');

    if (interestTempAmount.is_valid()) {
      var v = demAmount.divide(interestTempAmount);
      console.log(v.to_json());
    }