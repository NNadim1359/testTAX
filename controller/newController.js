const path = require('path');
const fs = require('fs');
const readline = require('readline');

const sql = require('mssql');
const axios = require('axios');
const crypto = require('crypto');
const oracledb = require('oracledb');
const otpGenerate = require('otp-generator');

const AccountModel = require('../model/newModel');
const OTPModel = require('../model/otpModel');
const TAXModel = require('../model/taxInfoModel');
const data = require('../data/url.json');

var AccountInfoNumber = '';
var TaxYear = '';
var DecryptedText = '';

//Database configuration for MSSQL server
const config = {
  user: 'Nadim',
  password: 'Nbl@123',
  server: '172.31.100.100',
  database: 'taxreturn',
  options: {
    encrypt: false,
    connectTimeout: 30000,
    requestTimeout: 30000,
    synchronize: true,
    trustServerCertificate: true
 },
 pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
 }
};

//Controller function for account verification and otp sending
const AccountController = async (req, res, cb) => {
  const { accountNumber, taxYear } = req.body;
  const accountModel = new AccountModel(accountNumber, taxYear);//** */
  AccountInfoNumber = accountNumber; //** for global */
  TaxYear = taxYear;

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM taxreturn.dbo.accountInformation WHERE accountNumber=${accountNumber} AND taxYear=${taxYear}`;
    if (result.rowsAffected == 0) {
      async function apiRequest() {
        //Data fetch
        const config = {
            method: 'GET',
            url: data.host + data.port + data.api_url + accountNumber,
            headers: {
                'Content-Type': 'application/json',
                'apiKey': '213424234234',
                'Authorization': 'Basic ZGlsa3VzaGFqaG9uOjEyMzQ1Ng=='
          }
        }
        let res = await axios(config);
        //Data decription
        const key = 'WnZr4u7w!z%C*F-JaNdRgUkXp2s5v8y/';
        const encrypted = res.data;
        const decipher = crypto.createDecipheriv('aes-256-ecb', key, '');
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        logger.log(decrypted);
        DecryptedText = decrypted;
        //insert data
        //const insert = await sql.query`INSERT INTO taxreturn.dbo.accountInformation (accountNumber, taxYear, description) VALUES (${accountNumber},${taxYear},${decrypted})`;
        //parse phone phone
        const readAndParse = () => {
            let counter = 0;
            const readStream = fs.createReadStream('debug.log', 'utf8');
            let rl = readline.createInterface({input: readStream});
            rl.on('line', async line => {
                const sms_split_01 = line.split(',')[11];
                const sms_split_02 = sms_split_01.split(':')[1];
                const sms_1 = sms_split_02.split('\"')[1];
                const sms = `+88${sms_1}`;
                const otp = otpGenerate.generate(6, {
                  digit: true,
                  lowerCaseAlphabets: false,
                  upperCaseAlphabets:false,
                  specialChars: false
                });//** */
                console.log(otp);
                const insertOtp = sql.query`INSERT INTO taxreturn.dbo.accountNumberOTP (accountNumber, sms, otp) VALUES (${accountNumber},${sms},${otp})`;
                // otp send function

                //const otpSendData = await axios.post( '172.31.10.133/smsservice2/service.asmx',);
                
            });
          };
          readAndParse();
    }
    apiRequest();
    } else {
      res.send('Your information already given');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
  console.log(`AccNo: ${accountNumber}`);
  res.status(200).sendFile(path.join(__dirname,'../', 'view', 'otp.html'));
}

const VerifyOTP = async (req,res) => {
  const { otp } = req.body;

  //console.log(acc);
  const otpObject = await sql.query`SELECT otp FROM taxreturn.dbo.accountNumberOTP WHERE accountNumber=${AccountInfoNumber}`;

  const otpData = otpObject.recordset[0];
  const otpFromDb = otpData.otp;

  console.log('OTP FROM Database: '+otpFromDb);
  if (otp == otpFromDb) {
    console.log('It work');
    const insert = await sql.query`INSERT INTO taxreturn.dbo.accountInformation (accountNumber, taxYear, description) VALUES (${AccountInfoNumber},${TaxYear},${DecryptedText})`;
    res.sendFile(path.join(__dirname, '../', 'view', 'taxInfo.html'));
    //res.sendFile(path.join(__dirname, '../', 'view', 'taxInfo.html'));
  } else {
    let count = 0;
    while (count<=3) {
      count++;
      res.status(200).sendFile(path.join(__dirname,'../', 'view', 'otp.html'));
    }
    if (count == 3) {
      return res.status(200).sendFile(path.join(__dirname,'../', 'view', 'index.html'));
    }
  }
  
  const otpModel = new OTPModel(otp);
  // console.log(`OTP FROM Model: ${otp}`);
  // res.status(200).sendFile(path.join(__dirname, '../', 'view', 'taxInfo.html'));
}

const TaxInformationController = async ( req, res ) => {
  const { tin, date, taxRefId, image } = req.body;
  let image2 = await axios.get(image, { responseType: 'arraybuffer' })
  let imageData = JSON.stringify(image2.data)
  const taxInfoInsert = await sql.query`INSERT INTO taxreturn.dbo.accountNumberTaxInfo (accountNumber, tin, date, taxRefId, image) VALUES ( ${AccountInfoNumber}, ${tin}, ${date}, ${taxRefId}, ${imageData} )`;
  console.log(taxInfoInsert);
  const taxModel = new TAXModel(tin, date, taxRefId, image);
}

const logger = require('../log/debugLog');

module.exports = { AccountController, VerifyOTP, TaxInformationController };

//module.exports = { AccountController };
