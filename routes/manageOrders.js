let express = require("express");
let axios = require("axios");
const createOrder = require("../API Operations/CreateOrder");
const getSingleOfferRequest = require("../API Operations/GetSingleOfferRequest");
const getSingleOffer = require("../API Operations/GetSingleOffer");
const getSingleOrder = require("../API Operations/GetSingleOrder");
let router = express.Router();
const cancelOrder = require("../API Operations/CancelOrder");
const getSingleOrderCancellation = require("../API Operations/GetSingleOrderCancellation");
const confirmOrderCancellation = require("../API Operations/ConfirmOrderCancellation");
const getPaymentAndServiceDetails = require("../Operations/getPaymentAndServiceDetails");
const getPassengerDetails = require("../Operations/getPassengerDetails");
const convertAllToArrays = require("../Operations/convertAllToArrays");

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
  let { dob, title, phone_no, gender, email, offerids, country, paymentType } =
    req.body;

  console.log("req-body: ",req.body)

  let reqBody;

  if(Array.isArray(dob) === false) {
    reqBody = convertAllToArrays(req.body);
  } else {
    reqBody = req.body;
    reqBody.offerids = [offerids];
  }
  // let offerDetails = await getSingleOffer(offerids[0]);

  // if (offerDetails.payment_requirements.requires_instant_payment === true && paymentType != "instant") {
  //   return res.send(
  //     "This flight booking requires instant payment. Either close this page and choose another flight or go back to do instant payment."
  //   );
  // }
  // {passengerId, passengerType, familyName, givenName}
  let { offerPaymentDetails, offerServiceDetails } =
    await getPaymentAndServiceDetails(reqBody);

  // console.log("offerPaymentDetails: ",offerPaymentDetails);
  // console.log("offerServiceDetails: ",offerServiceDetails);

  if (offerPaymentDetails.length === 0) {
    return res.status(400).send("No booking available");
  }

  let passengersDetails = await getPassengerDetails(
    req.params.offer_request_id,
    reqBody
  );

  let jsonData = {
    data: {
      type: paymentType,
      services: offerServiceDetails,
      selected_offers: reqBody.offerids,
      passengers: passengersDetails,
    },
  };

  let redirectUrl;

  if (paymentType === "instant") {
    jsonData.data.payments = JSON.parse(JSON.stringify(offerPaymentDetails));
  }

  let orderDetails = await createOrder(jsonData);

  if (paymentType === "instant") {
    redirectUrl = "/api/orders/orderConfirmation/" + orderDetails.id;
  } else {
    redirectUrl = "/api/payments/create/" + orderDetails.id;
  }

  res.redirect(redirectUrl);
});

router.get("/orderConfirmation/:orderId", async (req, res) => {
  let { orderId } = req.params;
  let orderDetails = await getSingleOrder(req.params.orderId);
  console.log("orderDetails: ", orderDetails);

  res.render("bookingConfirmation", { bookingDetails: orderDetails, orderId });
});

router.post("/initiate-cancel/:orderId", async (req, res) => {
  let { orderId } = req.params;
  let jsonData = {
    data: {
      order_id: orderId,
    },
  };

  let precancellationDetails = await cancelOrder(jsonData);
  let redirectUrl =
    "/api/orders/confirm-cancel/" + orderId + "/" + precancellationDetails.id;

  res.redirect(redirectUrl);
});

router.get("/confirm-cancel/:orderId/:precancellationId", async (req, res) => {
  let { orderId, precancellationId } = req.params;
  let orderDetails = await getSingleOrder(orderId);

  res.render("confirmCancellation", {
    orderDetails,
    orderId,
    precancellationId,
  });
});

router.post("/confirm-cancel/:orderId/:precancellationId", async (req, res) => {
  let { orderId, precancellationId } = req.params;
  let cancellationDetails = await confirmOrderCancellation(precancellationId);
  let redirectUrl =
    "/api/orders/cancellation-successful/" + cancellationDetails.id;
  res.redirect(redirectUrl);
});

router.get("/cancellation-successful/:cancellationId", async (req, res) => {
  let { cancellationId } = req.params;
  let cancellationDetails = await getSingleOrderCancellation(cancellationId);

  res.render("orderCancellationDetails", { cancellationDetails });
});

module.exports = router;
