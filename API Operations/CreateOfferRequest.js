let axios = require('axios');

let createOfferRequest = async(jsonData) => {
    let url = "https://api.duffel.com/air/offer_requests"

    var config = {
      method: 'post',
      url,
      headers: {
        "Authorization": "Bearer " + process.env.API_KEY,
        "Accept": "application/json",
        "Duffel-Version": "beta",
        "Accept-Encoding": "gzip",
        "Content-Type": "application/json"
      },
      data : jsonData
    };
    
    let flightQueryConfirmation = await axios(config).catch(err => {
      console.log("err: ", err.response.data);
    })

    // returns offer_request_id
    return flightQueryConfirmation.data.data.id;
}

module.exports = createOfferRequest;