const path             = require("path");
const Model            = require("../core/model");
const constant         = require("../core/constant");
const { readCSVData }  = require("../core/helper");
const WordSchema       = require("../modules/english/models/mod_word");

const { DB_NAME_K12TRACK, SCHEMA_WORD } = constant;
const ModelWord = new Model(DB_NAME_K12TRACK, SCHEMA_WORD, WordSchema);

const importWord = async () => {
  const argv = process.argv;
  if (argv.length < 3) {
    console.log("参数不正");
    console.log("例: [node ./src/tool/import_word.js word.csv]");
    process.exit();
  }

  const wordCSVFile = argv[2];

  const startDate = new Date();
  const wordCSVPath = path.join(__dirname, wordCSVFile);

  readCSVData(wordCSVPath, async (err, data) => {
    if (data.length <= 0) {
      process.exit(0);
    } else {
      const wordDBData = data.slice(1);
      const totalCount = wordDBData.length;
      const results = [];
      let index = 1;
      for (let i = 0; i < totalCount; i++) {
        const record = wordDBData[i];
        const newObj = {
          textbook:            record[0],
          grade:               record[1],
          module:              record[2],
          unit:                record[3],
          word:                record[4],
          phoneticSymbol:      record[5],
          meaning:             record[6],
          example:             record[7],
          partsOfSpeech:       record[8],
        };
        console.log(`word progress bar:-->>${index}/${totalCount}--`);
        try {
          results.push(ModelWord.updateByCondition({ grade: newObj.grade, module: newObj.module, word: newObj.word }, newObj, { upsert: true }));
          index++;
        } catch (e) {
          console.log(e);
        }
      }

      await Promise.all(results);
      const endDate = new Date();
      console.log(`插入时间 time(s):${(endDate.getTime() - startDate.getTime()) / 1000}`);
      process.exit(0);
    }
  });

};

importWord();
