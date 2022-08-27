let axios = require('axios');

let createOrder = async(jsonData) => {
    url = "https://api.duffel.com/air/orders"

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
    
    let orderDetails = await axios(config).catch(err => {
      console.log("err: ", err.response.data);
    })

    console.log("orderdetails: ",orderDetails);

    return orderDetails.data.data;
};

module.exports = createOrder;