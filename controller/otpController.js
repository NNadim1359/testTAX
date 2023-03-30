const OTPModel = require('../model/otpModel');
const { AccountController } = require('../controller/newController');
const AccountModel = require('../model/newModel');

const VerifyOTP = async (req,res) => {
    const { otp } = req.body;
    console.log(accInfo);

    const otpModel = new OTPModel(otp);
    console.log(`OTP FROM Model: ${otp}`);
}

module.exports = {
    VerifyOTP
}