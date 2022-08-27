let axios = require('axios');

let getSingleOrder = async(id) => {
    let url = "https://api.duffel.com/air/orders/" + id;

    var config = {
        method: 'get',
        url,
        headers: {
            "Authorization": "Bearer " + process.env.API_KEY,
            "Accept": "application/json",
            "Duffel-Version": "beta",
            "Accept-Encoding": "gzip",
            "Content-Type": "application/json"
        }
    };
    
    let response = await axios(config).catch(err => {
        console.log("err: ", err.response.data);
    })

    return response.data.data;
};

module.exports = getSingleOrder;