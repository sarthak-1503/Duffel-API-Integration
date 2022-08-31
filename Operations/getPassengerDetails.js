const getSingleOfferRequest = require("../API Operations/GetSingleOfferRequest");
let countryCodes = require("../Resources/CountryCodes.json");

let getPassengerDetails = async (offer_request_id,details) => {
  let offerRequestDetails = await getSingleOfferRequest(
    offer_request_id
  );
  
  let temp = offerRequestDetails.data.passengers;

  let adultInfantMapping = new Map();
  if(details.responsibleAdults) {
    details.responsibleAdults.map(mapping => {
      let temp = mapping.split(" ");
      adultInfantMapping.set(temp[0],temp[1]);
    })

    console.log("adultInfantMapping: ",adultInfantMapping);
  }

  let passengersDetails = [];

  for (let i = 0; i < temp.length; i++) {
    let countryinfo = countryCodes.find((countrydetails) => {
      return countrydetails.name === details.country[i];
    });

    console.log("details: ",details)

    let passengerInfo = {
      born_on: details.dob[i],
      email: details.email[i],
      gender: details.gender[i],
      title: details.title[i],
      phone_number: countryinfo.dial_code + details.phone_no[i],
      family_name: temp[i].family_name,
      given_name: temp[i].given_name,
      type: temp[i].type,
      id: temp[i].id,
      infant_passenger_id: (adultInfantMapping.has(temp[i].id) === false) ? "" : adultInfantMapping.get(temp[i].id)
    };

    passengersDetails.push(JSON.parse(JSON.stringify(passengerInfo)));
  }

  return passengersDetails;
};

module.exports = getPassengerDetails;
