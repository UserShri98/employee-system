const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "https://employee-system-kappa.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/leaves", require("./routes/leave.routes"));
app.use("/api/salary", require("./routes/salary.routes"));
app.use("/api/holidays", require("./routes/holiday.routes"));

module.exports = app;
