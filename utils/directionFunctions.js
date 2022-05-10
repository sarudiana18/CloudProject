var axios = require('axios');

// var config = {
//   method: 'get',
//   url: 'https://maps.googleapis.com/maps/api/directions/json?origin=Bucuresti&destination=Sibiu&key=AIzaSyAd-BWZMuhkpFLFhvQ-gKpq6qesmiRtsaI',
//   headers: { }
// };


function createConfig(from, to) {
    return config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=AIzaSyAd-BWZMuhkpFLFhvQ-gKpq6qesmiRtsaI`,
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