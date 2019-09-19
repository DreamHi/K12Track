const baidu          = require("../../../core/baidu");

exports.recognize = async (voiceBuffer) => {
  return new Promise((resolve, reject) => {
    const baduClient = baidu.createBaiduSpeechClient();
    if (baduClient) {
      baduClient.recognize(voiceBuffer, 'pcm', 16000)
        .then((result) => {
          resolve(result.result);
        }, (err) => {
          reject(err);
        });
    } else {
      reject(new Error("baidu error"));
    }
  });
};

exports.simnet = async (word1, word2) => {
  return new Promise((resolve, reject) => {
    const baduClient = baidu.createBaiduNlpClient();
    if (baduClient) {
      baduClient.simnet(word1, word2)
        .then((result) => {
          resolve(result.score);
        }, (err) => {
          reject(err);
        });
    } else {
      reject(new Error("baidu error"));
    }
  });
};
