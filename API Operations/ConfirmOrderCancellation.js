let axios = require('axios');

let confirmOrderCancellation = async(id) => {
    url = "https://api.duffel.com/air/order_cancellations/" + id + "/actions/confirm"

    var config = {
      method: 'post',
      url,
      headers: {
        "Authorization": "Bearer " + process.env.API_KEY,
        "Accept": "application/json",
        "Duffel-Version": "beta",
        "Accept-Encoding": "gzip",
        "Content-Type": "application/json"
      }
    };
    
    let cancellationDetails = await axios(config).catch(err => {
      console.log("err: ", err.response.data);
    }) 

    return cancellationDetails.data.data;
};

module.exports = confirmOrderCancellation;