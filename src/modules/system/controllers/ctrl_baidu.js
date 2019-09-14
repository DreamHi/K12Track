const baidu          = require("../../../core/baidu");

exports.recognize = async (voiceBuffer) => {
  return new Promise((resolve, reject) => {
    const baduClient = baidu.createBaiduClient();
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
