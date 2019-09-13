const Model            = require("../core/model");
const constant         = require("../core/constant");
const TextbookSchema   = require("../modules/english/models/mod_textbook");

const { DB_NAME_K12TRACK, SCHEMA_TEXTBOOK } = constant;
const ModelTextBook = new Model(DB_NAME_K12TRACK, SCHEMA_TEXTBOOK, TextbookSchema);

const data = [
  {
    name : "外研版",
    grade : "一年级上",
    year : "2012",
    imgURL : "https://user-images.githubusercontent.com/24720247/64190391-db43ec00-cea8-11e9-9c4d-35e5a3735f10.png",
  },
  {
    name : "外研版",
    grade : "一年级下",
    year : "2012",
    imgURL : "https://user-images.githubusercontent.com/24720247/64190392-db43ec00-cea8-11e9-9b94-5c4f959536c4.png",
  },
  {
    name : "外研版",
    grade : "二年级上",
    year : "2012",
    imgURL : "https://user-images.githubusercontent.com/24720247/64190393-dbdc8280-cea8-11e9-826f-d78c3ef3c5e6.png",
  },
];

const importTextbook = async () => {
  const startDate = new Date();
  const results = [];
  for (let i = 0; i < data.length; i++) {
    const { name, grade } = data[i];
    try {
      console.log(1, data[i]);
      results.push(ModelTextBook.updateByCondition({ name, grade }, data[i], { upsert: true }));
      // await ModelTextBook.updateByCondition({ name, grade }, data[i], { upsert: true });
      // index++;
    } catch (e) {
      console.log(e);
    }
  }

  await Promise.all(results);
  const endDate = new Date();
  console.log(`插入时间 time(s):${(endDate.getTime() - startDate.getTime()) / 1000}`);
  process.exit(0);
};

importTextbook();
