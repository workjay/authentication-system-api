const router = require("express").Router();

router.use("/auth", require("../modules/users/auth_routes"));
router.use("/users", require("../modules/users/user_routes"));

module.exports = router;
