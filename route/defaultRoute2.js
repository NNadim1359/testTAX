const express = require('express');
const router = express.Router();
const controller = require('../controller/customerControl');

router.post('/otp', controller.sendOTP);

module.exports = router;
