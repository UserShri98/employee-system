const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/leave.controller");

router.post("/", auth(), ctrl.applyLeave);
router.get("/me", auth(), ctrl.myLeaves);
router.get("/team", auth(["LEAD"]), ctrl.getTeamLeaves);
router.get("/all", auth(["OWNER"]), ctrl.getAllLeaves);
router.get("/stats", auth(), ctrl.leaveStats);
router.patch("/:id", auth(["OWNER", "LEAD"]), ctrl.updateStatus);

module.exports = router;
