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

  if(Array.isArray(passengerType) == false) {
    passengerType = [passengerType]
    familyName = [familyName];
    givenName = [givenName];
  }

  // console.log(familyName, givenName, passengerType);
  
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
  
  console.log("passengerType: ",passengerType)

  for(let i=0;i<familyName.length;i++) {
    jsonData.data.passengers.push(JSON.parse(JSON.stringify({
      family_name: familyName[i],
      given_name: givenName[i],
      type: passengerType[i],
    })))
  }

  // console.log(jsonData.data.passengers);

  let offer_request_id = await createOfferRequest(jsonData);
  let redirectUrl = "/api/flights-queries/results/" + offer_request_id;

  // console.log("flight confirmation id: ", offer_request_id);

  res.redirect(redirectUrl);
});

router.get("/results/:offer_request_id", async (req, res) => {
  let { offer_request_id } = req.params;

  let searchResults = await getOffers(offer_request_id);
  
  res.render("flightsSearchResults", {
    flightsSearchResults: searchResults,
    offer_request_id,
    requiresInstantPayment: searchResults
  });
});

module.exports = router;
