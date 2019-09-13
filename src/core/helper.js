const os          = require("os");
const fs          = require("fs");
const _           = require("lodash");
const crypto      = require("crypto");
const parse       = require("csv-parse");
const iconv       = require("iconv-lite");
const config      = require("../../config/app");

exports.ip = () => {
  if (global.addresses) {
    return global.addresses;
  }

  const interfaces = os.networkInterfaces();
  const addresses = [];

  _.each(interfaces, (item) => {
    _.each(item, (address) => {
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    });
  });

  global.addresses = addresses[0];
  return global.addresses;
};

exports.sha256 = (str) => {
  if (str) {
    return crypto.createHmac("sha256", config.tokenSecret).update(str).digest("hex");
  } else {
    return "";
  }
};

exports.randomWord = (word, len) => {
  const result = [];
  for (let i = 0; i < len; i++) {
    const aToZ = _.random(97, 122);
    const c = String.fromCharCode(aToZ);
    result.push(c);
  }
  let size = word.length;
  const a = [];
  while (size) {
    const index = _.random(0, len - 1);
    if (_.indexOf(a, index) === -1) {
      a.push(index);
      result[index] = word[size - 1];
      size -= 1;
    }
  }
  return result.join('');
};

// 生成不重复的0-len的随机数
exports.random = (len) => {
  const result = [];
  let size = len;
  while (size) {
    const n = _.random(0, len - 1);
    if (n < len && _.indexOf(result, n) === -1) {
      result.push(n);
      size -= 1;
    }
  }
  return result;
};
exports.readCSVData = (filePath, callback) => {
  if (!filePath) {
    return callback(undefined, []);
  }

  const data = fs.createReadStream(filePath);
  const parser = parse({ delimiter: ",", escape: "\"", from: 1 });
  data.pipe(iconv.decodeStream('gbk'))
    .pipe(iconv.encodeStream('UTF-8'))
    .pipe(parser);

  const output = [];
  parser.on('readable', (record) => {
    // eslint-disable-next-line no-cond-assign
    while (record = parser.read()) {
      output.push(record);
    }
  });
  parser.on('error', (err) => {
    callback(err, []);
  });

  parser.on('end', () => {
    callback(undefined, output);
  });
};

exports.currentDate = () => {
  return new Date().getTime();
};

exports.today = () => {
  return new Date();
};
