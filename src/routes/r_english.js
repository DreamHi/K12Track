const express    = require("express");
const multer     = require("multer");
const response   = require("../core/response");
const ctrlWord   = require("../modules/english/controllers/ctrl_word");

const router     = express.Router();
const upload            = multer({ dest: '/tmp' });

router.get("/textbook", async (req, res) => {
  try {
    const result = await ctrlWord.getTextBook(req);
    response.sendSuccess(res, result);
  } catch (err) {
    response.sendError(res, err);
  }
});

router.post("/paper", async (req, res) => {
  try {
    const result = await ctrlWord.getPaper(req);
    response.sendSuccess(res, result);
  } catch (err) {
    response.sendError(res, err);
  }
});

router.get("/paper/:id", async (req, res) => {
  try {
    const result = await ctrlWord.getPaperAndQuestions(req);
    response.sendSuccess(res, result);
  } catch (err) {
    response.sendError(res, err);
  }
});

router.post("/exam", async (req, res) => {
  try {
    const result = await ctrlWord.answerPaper(req);
    response.sendSuccess(res, result);
  } catch (err) {
    response.sendError(res, err);
  }
});

router.get("/exams", async (req, res) => {
  try {
    const result = await ctrlWord.getTestResult(req);
    response.sendSuccess(res, result);
  } catch (err) {
    response.sendError(res, err);
  }
});

router.get("/exams/count", async (req, res) => {
  try {
    const result = await ctrlWord.getTestResultCount(req);
    response.sendSuccess(res, result);
  } catch (err) {
    response.sendError(res, err);
  }
});

router.get("/exam/:id", async (req, res) => {
  try {
    const result = await ctrlWord.getTestResultDetail(req);
    response.sendSuccess(res, result);
  } catch (err) {
    response.sendError(res, err);
  }
});

router.post("/word/recognize", upload.single('files'), async (req, res) => {
  try {
    const result = await ctrlWord.wordRecognize(req);
    response.sendSuccess(res, result);
  } catch (err) {
    response.sendError(res, err);
  }
});

module.exports = router;
