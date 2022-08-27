let axios = require('axios');

let getSingleOffer = async(id) => {
    let url = "https://api.duffel.com/air/offers/" + id + "?return_available_services=true";

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
        // return err.response.data;
    })

    return response.data.data;
};

module.exports = getSingleOffer;