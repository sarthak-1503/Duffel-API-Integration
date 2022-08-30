let express = require("express");
const createPayment = require("../API Operations/CreatePayment");
const getSingleOrder = require("../API Operations/GetSingleOrder");
let router = express.Router();

router.get("/create/:orderId", async (req, res) => {
    
  let {orderId} = req.params;
  let orderDetails = await getSingleOrder(orderId);

  console.log("orderDetails: ",orderDetails);
  
  let paymentData = {
    data: {
      order_id: orderId,
      payment: {
        type: "balance",
        currency: orderDetails.total_currency,
        amount: orderDetails.total_amount
      }
    }
  }

  let paymentDetails = await createPayment(paymentData);

  res.render("bookingConfirmation",{bookingDetails: paymentDetails,orderId});
});

module.exports = router;
