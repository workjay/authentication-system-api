const router = require("express").Router();
const { joiValidator, verifyTokenFromBody } = require("../../middlewares");
const { signup, login, verifyAccount } = require("./controller");
const joiSchema = require("./validations");

router.post("/signup", joiValidator(joiSchema.signup), signup);
router.post("/login", joiValidator(joiSchema.login), login);
router.post("/account-verification", verifyTokenFromBody, verifyAccount);

module.exports = router;
