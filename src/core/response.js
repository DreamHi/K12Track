exports.sendSuccess = (res, result) => {
  res.json({ success: true, data: result });
};

exports.sendError = (res, err) => {
  res.status(err.status).json({ success: false, errorCode: err.status, errorMessage: err.message });
};
