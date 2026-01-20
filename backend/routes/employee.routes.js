const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/employee.controller");

router.get("/", auth(["OWNER"]), ctrl.getAllEmployees);
router.get("/leads", auth(["OWNER"]), ctrl.getTeamLeads);
router.post("/", auth(["OWNER"]), ctrl.createEmployee);
router.get("/:id", auth(["OWNER", "LEAD"]), ctrl.getEmployeeById);
router.put("/:id", auth(["OWNER"]), ctrl.updateEmployee);
router.delete("/:id", auth(["OWNER"]), ctrl.deleteEmployee);

module.exports = router;
