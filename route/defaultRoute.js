const path = require('path');
const express = require('express');
const { AccountController, VerifyOTP, TaxInformationController } = require('../controller/newController');
// const { AccountController } = require('../controller/newController');
// const { VerifyOTP } = require('../controller/otpController');

const router = express.Router();
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname,'../', 'view', 'index.html'));
});
router.get('/fetch-data', (req, res, next) => {
    res.sendFile(path.join(__dirname,'../', 'view', 'otp.html'))
})
router.get('/verify', (req, res, next) => {
    res.sendFile(path.join(__dirname,'../', 'view', 'taxInfo.html'))
})

router.post('/fetch-data', AccountController);
router.post('/verify', VerifyOTP);
router.post('/taxInfo', TaxInformationController);

module.exports = router;
