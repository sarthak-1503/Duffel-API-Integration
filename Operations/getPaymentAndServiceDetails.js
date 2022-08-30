const getSingleOffer = require("../API Operations/GetSingleOffer");

let getPaymentAndServiceDetails = async (details) => {
  let offerPaymentDetails = [];
  let offerServiceDetails = [];

  for (let i = 0; i < details.offerids.length; i++) {
    let id = details.offerids[i];
    let offerDetails = await getSingleOffer(id);

    // console.log("offerDetails: ",offerDetails);

    let totalAmount =
      parseFloat(offerDetails.total_amount) +
      parseFloat(offerDetails.available_services[0].total_amount);

    totalAmount = Math.round(totalAmount * 100) / 100;

    let paymentDetails = {
      type: "balance",
      currency: offerDetails.total_currency,
      amount: totalAmount.toString(),
      err: false,
    };
    offerPaymentDetails.push(JSON.parse(JSON.stringify(paymentDetails)));

    let serviceDetails = {
      id: offerDetails.available_services[0].id,
      quantity: 1,
      err: false,
    };

    offerServiceDetails.push(JSON.parse(JSON.stringify(serviceDetails)));
  }

  return { offerPaymentDetails, offerServiceDetails };
};

module.exports = getPaymentAndServiceDetails;
