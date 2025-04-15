const ERROR_CODE = require("../../../constants/errorCode");

const errorHandler = (err, req, res, next) => {
  switch (res.statusCode) {
    case ERROR_CODE.UNAUTHORIZED:
      res.status(401).json({
        title: "Unauthorized",
        message: err.message,
        stack: err.stack,
      });
      break;
    case ERROR_CODE.FORBIDDEN:
      res.status(403).json({
        title: "Forbidden",
        message: err.message,
        stack: err.stack,
      });
      break;
    case ERROR_CODE.NOT_FOUND:
      res.status(404).json({
        title: "Not Found",
        message: err.message,
        stack: err.stack,
      });
      break;
    default:
      res.status(500).json({
        title: "Internal Server Error",
        message: err.message,
        stack: err.stack,
      });
      break;
  }

  next();
};
module.exports = errorHandler;
