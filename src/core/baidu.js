const AipSpeechClient = require("baidu-aip-sdk").speech;
const AipNlpClient = require("baidu-aip-sdk").nlp;

const APP_ID = process.env.BAIDU_APP_ID;
const API_KEY = process.env.BAIDU_APP_KEY;
const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

let baibuSpeechClient = null;
let baibuNLPClient = null;

exports.createBaiduSpeechClient = () => {
  if (!baibuSpeechClient) {
    baibuSpeechClient = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);
  }
  return baibuSpeechClient;
};


exports.createBaiduNlpClient = () => {
  if (!baibuNLPClient) {
    baibuNLPClient = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);
  }
  return baibuNLPClient;
};
