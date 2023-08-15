const Responses = require("./statusMessages");

/* Status Error Constructor */
function statusError(message, status) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

/* API Output Formatter */
function formatResponse(code, additionalMessage = "No details provided.") {
  const response = {
    response: code || 500,
    error: Responses[code] || Responses[500],
    message: additionalMessage,
  };
  return response;
}

module.exports = { statusError, formatResponse };
