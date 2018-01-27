var request = require('request');

var geocodeAddress = (userAddress, returnResponseFromGoogleAPI) => {
    var encodedAddress = encodeURIComponent(userAddress);
    request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
    json: true
}, (error, response, body) => {
        if(error) {
            returnResponseFromGoogleAPI("Unable to connect to google servers!");
        } else if (body.status === "ZERO_RESULTS"){
            returnResponseFromGoogleAPI("Unable to find address.");    
        } else if (body.status === "OK") {
            returnResponseFromGoogleAPI(undefined, {
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng
            })
        }
    });
};

module.exports = {
    geocodeAddress
};
