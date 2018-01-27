const request = require("request");

var getTemperature = (latitude, longitude, returnResponse) => {
    var apiKey = "fc1a9bf3afc0690adf2bb24e22bc59bd";
    request({
        url: `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}`,
        json: true
    }, (error, response, body) => {
        if (error) {
            returnResponse("unable to connect to Forecast.io servers");
        } else if (body.code === 400){
            returnResponse("Your location is invalid!");
        } else {
            returnResponse(undefined, {
                temperature: body.currently.temperature,
                apparentTemp: body.currently.apparentTemperature
            });
        }
    })
};

module.exports = {
    getTemperature
};