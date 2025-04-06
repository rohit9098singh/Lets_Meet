const jwt = require("jsonwebtoken");
const response = require("../utils/responseHandler");

const authMiddleware = (req, res, next) => {
  const authToken = req?.cookies?.auth_token;  
  if (!authToken) {
    return response(res, 401, "Authentication Required. Please Provide a Token");
  }
  try {
    const decode = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = decode;  

    next();
  } catch (error) {
    console.log(error);
    return response(res, 401, "Invalid token or expired, please try again");
  }
};

module.exports = authMiddleware;
