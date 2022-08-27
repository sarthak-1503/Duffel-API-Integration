let express = require("express");
let axios = require("axios");
const createOfferRequest = require("../API Operations/CreateOfferRequest");
const getOffers = require("../API Operations/GetOffers");
let router = express.Router();

router.get("/", (req, res) => {
  res.render("flightsQuery");
});

router.post("/", async (req, res) => {
  let {
    cabinClass,
    passengerType,
    familyName,
    givenName,
    departureDate,
    destination,
    origin,
    departureTimeFrom,
    departureTimeTo,
    arrivalTimeFrom,
    arrivalTimeTo,
  } = req.body;
  
  let jsonData = {
    data: {
      slices: [
        {
          origin: origin,
          destination: destination,
          departure_time: {
            to: departureTimeTo,
            from: departureTimeFrom,
          },
          departure_date: departureDate,
          arrival_time: {
            to: arrivalTimeTo,
            from: arrivalTimeFrom,
          },
        },
      ],
      passengers: [],
      max_connections: 0,
      cabin_class: cabinClass,
    },
  };

  jsonData.data.passengers.push(JSON.parse(JSON.stringify({
    family_name: familyName,
    given_name: givenName,
    type: passengerType,
  })))

  let offer_request_id = await createOfferRequest(jsonData);
  let redirectUrl = "/api/flights-queries/results/" + offer_request_id;

  // console.log("flight confirmation id: ", offer_request_id);

  res.redirect(redirectUrl);
});

router.get("/results/:offer_request_id", async (req, res) => {
  let { offer_request_id } = req.params;

  let searchResults = await getOffers(offer_request_id);
  // console.log(searchResults);

  // let flightsSearchResults = searchResults.map((result) => {return {total_currency : result.total_currency, total_amount : result.total_amount, tax_currency : result.tax_currency, tax_amount : result.tax_amount, slices : result.slices,passengers : result.passengers, owner : result.owner.name,owner : result.owner.iata_code,id : result.id,base_currency : result.base_currency,base_amount : result.base_amount}});

  res.render("flightsSearchResults", {
    flightsSearchResults: searchResults,
    offer_request_id,
  });
});

module.exports = router;
