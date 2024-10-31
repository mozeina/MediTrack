const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//routes
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const levelRoutes = require("./src/routes/levelRoutes");
const sessionRoutes = require("./src/routes/sessionsRoutes");
//middleware

//schedulers
const { resetWeeklyProgress, resetYearlyProgress, setNewMonthZero } = require("./src/schedulers");

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'https://meditrack1.onrender.com' }));


const port = process.env.PORT || 7777; 

app.use("/users", userRoutes);
app.use("/checkAuth", authRoutes);
app.use("/level", levelRoutes);
app.use("/session", sessionRoutes);

app.get("/", (req, res) => {
    res.send("hello world!!");
})

//weekly progress reset schedule call
resetWeeklyProgress();
//yearly progress reset schedule call
resetYearlyProgress();
//set new month's progress to 0
setNewMonthZero();


console.log("BACKED NODE ENV", process.env.NODE_ENV);
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
