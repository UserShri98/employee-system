const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/salary.controller");

router.get("/me", auth(), ctrl.getMySalary);
router.get("/all", auth(["OWNER"]), ctrl.getAllSalaries);
router.get("/stats", auth(), ctrl.getSalaryStats);
router.get("/:month/:year", auth(), ctrl.calculateSalary);
router.put("/:id", auth(["OWNER"]), ctrl.updateSalaryStatus);

module.exports = router;
