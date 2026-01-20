const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/auth.controller");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/profile", auth(), ctrl.getProfile);

module.exports = router;
