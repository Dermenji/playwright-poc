export function generateAuthToken(apikey, apiSecret, path, method, body = '', contentType = 'application/json') {
  let CryptoJS = require("crypto-js");

  let moment = require('moment');
  let date = moment().format();

  let signingString = CryptoJS.MD5(body).toString() + "#" + method + "#" + "/" + path + "#" + contentType + "#" + date;
  let dateKey = CryptoJS.HmacSHA256(date, "TEST" + apiSecret).toString(CryptoJS.enc.Hex);

  let signinKey = CryptoJS.HmacSHA256("TEST-api-request", dateKey).toString(CryptoJS.enc.Hex);
  let signature = CryptoJS.HmacSHA512(signingString, signinKey).toString(CryptoJS.enc.Base64);

  return {
    'Authorization': 'TEST ' + apikey + ':' + signature,
    'Date': date,
    'Content-Type': 'application/json'
  }
}
