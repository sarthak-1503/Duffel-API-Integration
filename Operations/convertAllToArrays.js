
let convertAllToArrays = (details) => {
    let convertedDetails = {
        dob: [details.dob],
        title: [details.title], 
        phone_no: [details.phone_no], 
        gender: [details.gender], 
        email: [details.email], 
        offerids: [details.offerids], 
        country: [details.country],
        paymentType: details.paymentType
    }

    return convertedDetails;
}

module.exports = convertAllToArrays;