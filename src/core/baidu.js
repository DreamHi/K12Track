const AipSpeechClient = require("baidu-aip-sdk").speech;

const APP_ID = process.env.BAIDU_APP_ID;
const API_KEY = process.env.BAIDU_APP_KEY;
const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

let baiClient = null;

exports.createBaiduClient = () => {
  if (!baiClient) {
    baiClient = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);
  }
  return baiClient;
};
