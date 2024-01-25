let jwt = require("jsonwebtoken");
/**
 * This function verify request body and return error if occurred otherwise continue
 * @param {Object} schema
 * @returns error if occurred
 */
exports.joiValidator = (schema) => (req, res, next) => {
  try {
    let result = schema.validate(req.body, {
      abortEarly: false,
      errors: {
        wrap: {
          label: "",
        },
      },
    });
    if (result?.error?.details?.length) {
      return res.status(422).json({
        status: "0",
        message: "Invalid data.",
        errors: result?.error?.details?.map((obj) => ({
          key: obj?.context?.key,
          message: obj?.message,
        })),
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * This function verify json web token from body
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns error if occurred
 */
exports.verifyTokenFromBody = async (req, res, next) => {
  try {
    let payload = jwt.verify(req.body?.token, process.env.JWT_SECRET_KEY);
    if (!payload?.id) {
      return res.status(401).json({
        status: "0",
        message: "Unauthorized link.",
      });
    }
    req.user_id = payload?.id;
    next();
  } catch (error) {
    res.status(401).json({
      status: "0",
      message:
        "Your account verification link has been expired. Please try to login for new link.",
    });
  }
};

/**
 * This function verify json web token from header
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns error if occurred
 */
exports.verifyTokenFromHeader = async (req, res, next) => {
  try {
    let token = req.headers["authorization"]?.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({
        status: "2",
        message: "Your login session has been expired. Please login again.",
      });
    }
    let payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!payload?.id) {
      return res.status(401).json({
        status: "2",
        message: "Your login session has been expired. Please login again.",
      });
    }
    req.user_id = payload?.id;
    next();
  } catch (error) {
    res.status(401).json({
      status: "2",
      message: "Your login session has been expired. Please login again.",
    });
  }
};
