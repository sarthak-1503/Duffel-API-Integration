let axios = require('axios');

let createPayment = async(jsonData) => {
    url = "https://api.duffel.com/air/payments"

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
    
    let paymentDetails = await axios(config).catch(err => {
      console.log("err: ", err.response.data);
    })

    return paymentDetails.data.data;
};

module.exports = createPayment;