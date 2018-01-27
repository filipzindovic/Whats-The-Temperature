const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const geocode = require("./geocode/geocode");
const weather = require("./weather");

var app = express();

//View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static path
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    res.render("index.ejs");
});

app.post("/address", function(req, res) {
    var userAddress = req.body.address;
    
    if (!userAddress) { 
        renderResults(res, "Please enter an address.", "danger");
    }
    
    geocode.geocodeAddress(userAddress, (errorMessage, coordinateResults) => {
        if (errorMessage) {
            renderResults(res, errorMessage, "danger");
        } else {
            weather.getTemperature(coordinateResults.latitude, coordinateResults.longitude, (errorMessage, temperatureResults) => {
                if (errorMessage) {
                    renderResults(res, errorMessage, "danger");
                } else { 
                    renderResults(res, getTemperatureInCelsiusText(temperatureResults), "info");
                }
            });
        }
    });
});

function renderResults(res, resultOfTemperature, colourOfAlert) {
    
    res.render("address.ejs", { result: resultOfTemperature, colour: colourOfAlert }, (err, html) => {
        res.send(html);
    });

};

function getTemperatureInCelsiusText(temperatureResults) {
    
    var celsiusTemp = getCelsius(temperatureResults, "temperature"),
        celsiusApparentTemp = getCelsius(temperatureResults, "apparentTemp");
    
    return "The temperature is " + celsiusTemp + " Celsius. It feels like " + celsiusApparentTemp + " Celsius.";
    
};


function getCelsius(temperatureResults, tempRequired) {
    
    return ((temperatureResults[tempRequired] -32) / 1.8).toFixed(2);
    
}

app.listen(3000, function() {
});
