//@desc  this class is responsible about operational errors
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "err";
    this.isOperatonal=true
  }
}

module.exports = ApiError
