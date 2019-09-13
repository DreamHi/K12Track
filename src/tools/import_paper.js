const Model            = require("../core/model");
const constant         = require("../core/constant");
const PaperSchema   = require("../modules/english/models/mod_paper");

const { DB_NAME_K12TRACK, SCHEMA_PAPER } = constant;
const ModelPaper = new Model(DB_NAME_K12TRACK, SCHEMA_PAPER, PaperSchema);

const importTextbook = async () => {
  const startDate = new Date();
  const results = [];
  ['一年级上', '一年级下', '二年级上'].forEach((t) => {
    for (let i = 1; i < 11; i++) {
      const data = {
        grade: t,
        type: `module${i}`,
        name: `模块${i}测验`,
      };
      const { type, grade } = data;
      try {
        results.push(ModelPaper.updateByCondition({ type, grade }, data, { upsert: true }));
      } catch (e) {
        console.log(e);
      }
    }
  });

  await Promise.all(results);
  const endDate = new Date();
  console.log(`插入时间 time(s):${(endDate.getTime() - startDate.getTime()) / 1000}`);
  process.exit(0);
};

importTextbook();
