const axios = require('axios');
const dataURL = require('../data/url.json');

const getPhoneNumber = async ( accountNumber ) => {
  try {
    const config = {
        method: 'GET',
        url: dataURL.host + dataURL.port + dataURL.api_url + accountNumber,
        headers: {
            'Content-Type': 'application/json',
            'apiKey': '213424234234',
            'Authorization': 'Basic ZGlsa3VzaGFqaG9uOjEyMzQ1Ng=='
      }
    }
    let res = await axios(config);
    const response = await axios(config);
    console.log(response);
    console.log(res);
    return response.data.phone;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getPhoneNumber,
};
