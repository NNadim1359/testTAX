const accountModel = require('../model/customerModel');

async function sendOTP(req, res) {
  const { accountNumber } = req.body;
  const phoneNumber = await accountModel.getPhoneNumber(accountNumber);
  console.log(phoneNumber);
  // Assuming here you have a function to generate OTP and send it to the phone number
  const otp = generateOTP();
  sendOTPToPhoneNumber(phoneNumber, otp);
  
  res.send({ message: 'OTP sent successfully' });
}

module.exports = {
  sendOTP
};
