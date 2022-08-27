let axios = require('axios');
const confirmOrderCancellation = require('./ConfirmOrderCancellation');

let cancelOrder = async(jsonData) => {
    url = "https://api.duffel.com/air/order_cancellations"

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
    
    let precancellationdetails = await axios(config).catch(err => {
      console.log("err: ", err.response.data);
    })

    return precancellationdetails.data.data;
};

module.exports = cancelOrder;