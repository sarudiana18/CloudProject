var axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

const directionAPIKey = process.env.DIRECTION_API_KEY;

function createConfig(from, to) {
    return config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${directionAPIKey}`,
        headers: { }
      };

}

async function getDirection(from, to) {
    var config = createConfig(from, to);
    var directions = {};
    await axios(config).then(function (response) {
        directions.distance = JSON.stringify(response.data.routes[0].legs[0].distance.text);
        directions.duration = JSON.stringify(response.data.routes[0].legs[0].duration.text);

        return directions;
    })
    .catch(function (error) {
      console.log(error);
    });
    return directions;
}

module.exports = {
    getDirection
}