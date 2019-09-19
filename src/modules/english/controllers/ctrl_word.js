const fs                = require("fs");
const _                 = require("lodash");
const Model             = require("../../../core/model");
const log               = require("../../../core/logger");
const helper            = require("../../../core/helper");
const constant          = require("../../../core/constant");
const WordSchema        = require("../models/mod_word");
const PaperSchema       = require("../models/mod_paper");
const TextbookSchema    = require("../models/mod_textbook");
const ExamResultSchema  = require("../models/mod_exam_result");
const Baidu             = require("../../system/controllers/ctrl_baidu");

const { DB_NAME_K12TRACK, SCHEMA_WORD, SCHEMA_PAPER, SCHEMA_TEXTBOOK, SCHEMA_EXAM_RESULT,
  MOD_FIND_ALL, RANDOM_WORD_LENGTH, QUESTION_TYPES_RANDOM, QUESTION_TYPES_RECOGNIZE } = constant;
const WordModel = new Model(DB_NAME_K12TRACK, SCHEMA_WORD, WordSchema);
const PaperModel = new Model(DB_NAME_K12TRACK, SCHEMA_PAPER, PaperSchema);
const TextbookModel = new Model(DB_NAME_K12TRACK, SCHEMA_TEXTBOOK, TextbookSchema);
const ExamResultModel = new Model(DB_NAME_K12TRACK, SCHEMA_EXAM_RESULT, ExamResultSchema);

const { today, generateRandomQuestionType } = helper;

exports.getTextBook = async (req) => {
  log.info("word.getTextBook() start.", req.user);
  try {
    const result = await TextbookModel.getList({ }, "", 0, MOD_FIND_ALL, "grade");
    log.info("word.getTextBook() end.", req.user);
    log.operation("getTextBook", "getTextBook success!", req.user);
    return result;
  } catch (err) {
    throw err;
  }
};

exports.getPaper = async (req) => {
  log.info("word.getPaper() start.", req.user);
  try {
    const { grade } = req.body;
    const condition = { grade };
    const result = await PaperModel.getList(condition, "", 0, MOD_FIND_ALL, "-updatedAt");
    const match = { "paper.grade" : grade };
    const project = {
      "paper.grade": 1,
      "paper.name": 1,
      qLen: { $size: "$questions" },
    };

    const group = {
      _id: { name: "$paper.name", grade: "$paper.grade", len: "$qLen" },
      count: { $sum : 1 },
    };
    const aggr = await ExamResultModel.aggregate(match, project, group);
    log.info("word.getPaper() end.", req.user);
    log.operation("getPaper", "getPaper success!", req.user);
    return { items: result, groups: aggr };
  } catch (err) {
    throw err;
  }
};

exports.getPaperAndQuestions = async (req) => {
  log.info("word.getPaperAndQuestions() start.", req.user);
  try {
    const { id } = req.params;
    const paper = await PaperModel.get(id);
    const condition = { grade: paper.grade, module: paper.type };
    const questions = await WordModel.getList(condition, "meaning word", 0, MOD_FIND_ALL, "");

    const qLen = questions.length;
    const randomIndex = helper.random(qLen);
    const qArray = [];

    _.each(randomIndex, (i) => {
      const q = questions[i];
      const qType = generateRandomQuestionType();
      const qObj = {
        id: q._id.toString(),
        type: qType,
      };
      const word = _.trim(q.word);
      if (qType === QUESTION_TYPES_RANDOM) {
        qObj.meaning = q.meaning;
        qObj.randomWord = helper.randomWord(word, RANDOM_WORD_LENGTH);
        qObj.length = word.length;
      }

      if (qType === QUESTION_TYPES_RECOGNIZE) {
        qObj.word = word;
      }
      qArray.push(qObj);
    });
    log.info("word.getPaperAndQuestions() end.", req.user);
    log.operation("getPaperAndQuestions", "getPaperAndQuestions success!", req.user);
    return { paper, questions: qArray };
  } catch (err) {
    throw err;
  }
};

exports.getTestResult = async (req) => {
  log.info("word.getTestResult() start.", req.user);
  try {
    const totalCount =  await ExamResultModel.count({ valid: 1 });
    const rs = await ExamResultModel.getList({ valid: 1 }, "", 0, MOD_FIND_ALL, "-updatedAt");
    log.info("word.getTestResult() end.", req.user);
    log.operation("getTestResult", "getTestResult success!", req.user);

    return { items: rs, total: totalCount };
  } catch (err) {
    throw err;
  }
};

exports.getTestResultCount = async (req) => {
  log.info("word.getTestResultCount() start.", req.user);
  try {
    const { grade } = req.query;
    const count =  await ExamResultModel.count({ valid: 1, 'paper.grade': grade });
    log.info("word.getTestResultCount() end.", req.user);
    log.operation("getTestResultCount", "getTestResultCount success!", req.user);

    return count;
  } catch (err) {
    throw err;
  }
};

exports.getTestResultDetail = async (req) => {
  log.info("word.getTestResultDetail() start.", req.user);
  try {
    const { id } = req.params;
    const rs = await ExamResultModel.get(id);

    log.info("word.getTestResultDetail() end.", req.user);
    log.operation("getTestResultDetail", "getTestResultDetail success!", req.user);

    return rs;
  } catch (err) {
    throw err;
  }
};

exports.answerPaper = async (req) => {
  log.info("word.answerPaper() start.", req.user);
  const { _id, name } = req.user;
  const { paper, answers } = req.body;
  try {
    const date = today();
    const newObj = {
      paper: paper.paper,
      questions: [],
      valid: 1,
      createdAt: date,
      updatedAt: date,
      createdBy: { _id, name },
      updatedBy: { _id, name },
    };
    const qIds = [];
    _.each(paper.questions, (q) => {
      qIds.push(q.id);
    });

    const qList = await WordModel.getList({ _id: { $in: qIds } }, "", 0, MOD_FIND_ALL, "");
    const qListObj = {};
    _.each(qList, (q) => {
      qListObj[q._id.toString()] = q;
    });

    let correctCount = 0;
    _.each(paper.questions, async (q, i) => {
      let a = '';
      let isRight = false;
      if (q.type === QUESTION_TYPES_RECOGNIZE) {
        a = answers[i].toString();
        if (qListObj[q.id] && a) {
          const score = await Baidu.simnet(qListObj[q.id].meaning, a);
          if (score > 0.6) {
            correctCount += 1;
            isRight = true;
          }
        }
      }

      if (q.type === QUESTION_TYPES_RANDOM) {
        a = answers[i].join('').toLowerCase();
        if (qListObj[q.id] && qListObj[q.id].word.toLowerCase() === a) {
          correctCount += 1;
          isRight = true;
        }
      }

      const tempObj = {
        question: qListObj[q.id],
        answer: a,
        type: q.type,
        isRight,
      };
      newObj.questions.push(tempObj);
    });

    newObj.score = 0;
    if (paper.questions && paper.questions.length > 0) {
      newObj.score = correctCount / paper.questions.length;
    }

    const a = await ExamResultModel.create(newObj);

    log.info("word.answerPaper() end.", req.user);
    log.operation("answerPaper", "answerPaper success!", req.user);
    return { _id: a._id };
  } catch (err) {
    throw err;
  }
};

exports.wordRecognize = async (req) => {
  log.info("word.wordRecognize() start.", req.user);
  const file = req.file || {};
  const filePath = file.path;
  try {
    if (filePath) {
      const data = fs.readFileSync(filePath);
      const voiceBase64 = Buffer.from(data);
      log.info("word.wordRecognize() end.", req.user);
      log.operation("wordRecognize", "wordRecognize success!", req.user);
      const rs = await Baidu.recognize(voiceBase64);
      return rs;
    } else {
      return {};
    }
  } catch (err) {
    throw err;
  }
};
