const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/attendance.controller");

router.post("/punch-in", auth(), ctrl.punchIn);
router.post("/punch-out", auth(), ctrl.punchOut);
router.get("/me", auth(), ctrl.myAttendance);
router.get("/", auth(["OWNER", "LEAD"]), ctrl.getAttendance);
router.get("/stats", auth(), ctrl.getAttendanceStats);

module.exports = router;
