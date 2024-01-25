const router = require("express").Router();
const { verifyTokenFromHeader } = require("../../middlewares");
const { getUser } = require("./controller");

router.get("/profile", verifyTokenFromHeader, getUser);

module.exports = router;
