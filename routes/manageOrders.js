let express = require("express");
let axios = require("axios");
const createOrder = require("../API Operations/CreateOrder");
const getSingleOfferRequest = require("../API Operations/GetSingleOfferRequest");
const getSingleOffer = require("../API Operations/GetSingleOffer");
const getSingleOrder = require("../API Operations/GetSingleOrder")
let router = express.Router();
let countryCodes = require("../Resources/CountryCodes.json");
const cancelOrder = require("../API Operations/CancelOrder");
const getSingleOrderCancellation = require("../API Operations/GetSingleOrderCancellation");
const confirmOrderCancellation = require("../API Operations/ConfirmOrderCancellation");

router.get("/createOrder/:offer_request_id", async (req, res) => {
  let offerRequestDetails = await getSingleOfferRequest(
    req.params.offer_request_id
  );
  let passengersData = offerRequestDetails.data.passengers;

  res.render("bookFlights", {
    offer_request_id: req.params.offer_request_id,
    passengersData,
  });
});

router.post("/createOrder/:offer_request_id", async (req, res) => {
  let { dob, title, phone_no, gender, email, offerids, country } = req.body;
  // {passengerId, passengerType, familyName, givenName}
  let offerPaymentDetails = [];
  let offerServiceDetails = [];

  offerids = [offerids];

  for (let i = 0; i < offerids.length; i++) {
    let id = offerids[i];
    let offerDetails = await getSingleOffer(id);

    // if(offerDetails.errors != undefined) {
    //     continue;
    // }
    // console.log("offerdetails: ", offerDetails);

    let totalAmount =
      parseFloat(offerDetails.total_amount) +
      parseFloat(offerDetails.available_services[0].total_amount);

    totalAmount = Math.round(totalAmount * 100)/100;
    // console.log("totalAmount: ",totalAmount);

    let paymentDetails = {
      type: "balance",
      currency: offerDetails.total_currency,
      amount: totalAmount.toString(),
    };
    offerPaymentDetails.push(JSON.parse(JSON.stringify(paymentDetails)));

    let serviceDetails = {
        id: offerDetails.available_services[0].id,
        quantity: 1
    };

    offerServiceDetails.push(JSON.parse(JSON.stringify(serviceDetails)));
  }

//   console.log("offerPaymentDetails: ", offerPaymentDetails);
//   console.log("offerServiceDetails: ", offerServiceDetails);

  if(offerPaymentDetails.length === 0) {
    return res.status(400).send("No booking available");
  }

  let offerRequestDetails = await getSingleOfferRequest(
    req.params.offer_request_id
  );
  
  let temp = offerRequestDetails.data.passengers;
  let details = [];
  details.push(
    JSON.parse(JSON.stringify({ dob, email, gender, title, phone_no }))
  );

  let passengersDetails = [];

  for (let i = 0; i < temp.length; i++) {
    let countryinfo = countryCodes.find((countrydetails) => {
      return countrydetails.name === country;
    });

    let passengerInfo = {
      born_on: details[i].dob,
      email: details[i].email,
      gender: details[i].gender,
      title: details[i].title,
      phone_number: countryinfo.dial_code + details[i].phone_no,
      family_name: temp[i].family_name,
      given_name: temp[i].given_name,
      type: temp[i].type,
      id: temp[i].id,
    };

    passengersDetails.push(JSON.parse(JSON.stringify(passengerInfo)));
  }

  let jsonData = {
    data: {
      type: "instant",
      services: offerServiceDetails,
      selected_offers: offerids,
      payments: offerPaymentDetails,
      passengers: passengersDetails,
    },
  };

  let orderDetails = await createOrder(jsonData);
//   console.log("orderdetails: ",orderDetails);
  
  let redirectUrl = "/api/orders/orderConfirmation/" + orderDetails.id;
  
  res.redirect(redirectUrl);
});

router.get("/orderConfirmation/:orderId",async(req,res)=> {
    
    let {orderId} = req.params;
    let orderDetails = await getSingleOrder(req.params.orderId);
    console.log("orderDetails: ",orderDetails);

    res.render("bookingConfirmation",{bookingDetails: orderDetails, orderId});
})

router.post("/initiate-cancel/:orderId",async(req,res) => {

    let {orderId} = req.params;
    let jsonData = {
        data: {
            order_id: orderId
        }
    }

    let precancellationDetails = await cancelOrder(jsonData);
    let redirectUrl = "/api/orders/confirm-cancel/" + orderId + "/" + precancellationDetails.id;

    res.redirect(redirectUrl);
});

router.get("/confirm-cancel/:orderId/:precancellationId",async(req,res) => {
   
    let {orderId, precancellationId} = req.params;
    let orderDetails = await getSingleOrder(orderId);

    res.render("confirmCancellation",{orderDetails,orderId,precancellationId});
})

router.post("/confirm-cancel/:orderId/:precancellationId",async(req,res) => {

    let {orderId, precancellationId} = req.params;
    let cancellationDetails = await confirmOrderCancellation(precancellationId);
    let redirectUrl = "/api/orders/cancellation-successful/" + cancellationDetails.id;
    res.redirect(redirectUrl);
})

router.get("/cancellation-successful/:cancellationId",async(req,res) => {
    let {cancellationId} = req.params;
    let cancellationDetails = await getSingleOrderCancellation(cancellationId);

    res.render("orderCancellationDetails",{cancellationDetails});
})

module.exports = router;
