var fs = require('fs');

fs.readFile('robot_heart.gif', function(err, original_data){

    if (err) {
      return console.log(err);
    }

    fs.writeFile('image_orig.gif', original_data, function(err) {});
    var base64Image = original_data.toString('base64');
    var decodedImage = new Buffer(base64Image, 'base64');
    fs.writeFile('image_decoded.gif', decodedImage, function(err) {});
});