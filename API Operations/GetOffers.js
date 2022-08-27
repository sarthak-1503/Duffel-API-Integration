let axios = require("axios");
let getSingleOffer = require('./GetSingleOffer')

let getOffers = async (offer_request_id) => {
  let url =
    "https://api.duffel.com/air/offers?offer_request_id=" +
    offer_request_id +
    "&limit=10";

  var config = {
    method: "get",
    url,
    headers: {
      Authorization: "Bearer " + process.env.API_KEY,
      Accept: "application/json",
      "Duffel-Version": "beta",
      "Accept-Encoding": "gzip",
      "Content-Type": "application/json",
    },
  };

  let response = await axios(config).catch((err) => {
    console.log("err: ", err.response.data);
  });

  let allOffers = [];
  let temp = response.data.data;

  for (let i = 0; i < temp.length; i++) {
    let offer_id = temp[i].id;
    let offerDetails = await getSingleOffer(offer_id);

    if (offerDetails.available_services.length) {
      allOffers.push(JSON.parse(JSON.stringify(temp[i])));
    }
  }

  return allOffers;
};

module.exports = getOffers;
