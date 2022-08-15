const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

// Validating logic for incoming requests for it's token.
module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  // Encoding token in headers of incoming request.
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    // Verify our token.
    const decodedToken = jwt.verify(token, process.env.JWT_KEY); // If token is valid.
    req.userData = { userId: decodedToken.userId }; // Extracting data and attaching it to request.
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
