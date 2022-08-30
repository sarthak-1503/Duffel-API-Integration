const getSingleOfferRequest = require("../API Operations/GetSingleOfferRequest");
let countryCodes = require("../Resources/CountryCodes.json");

let getPassengerDetails = async (offer_request_id,details) => {
  let offerRequestDetails = await getSingleOfferRequest(
    offer_request_id
  );
  let temp = offerRequestDetails.data.passengers;
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
    };

    passengersDetails.push(JSON.parse(JSON.stringify(passengerInfo)));
  }

  return passengersDetails;
};

module.exports = getPassengerDetails;
