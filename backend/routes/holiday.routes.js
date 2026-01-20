const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/holiday.controller");

router.post("/", auth(["OWNER"]), ctrl.createHoliday);
router.get("/", auth(), ctrl.getHolidays);
router.get("/:id", auth(), ctrl.getHolidayById);
router.put("/:id", auth(["OWNER"]), ctrl.updateHoliday);
router.delete("/:id", auth(["OWNER"]), ctrl.deleteHoliday);

module.exports = router;
