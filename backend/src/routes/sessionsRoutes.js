const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const { getLatestSession, getWeeklyProgress, getMonthlyProgress, endSession } = require("../controllers/sessionsController");

router.get("/get-latest-session", authenticateToken, getLatestSession);

router.get("/get-weekly-progress", authenticateToken, getWeeklyProgress);

router.get("/get-monthly-progress", authenticateToken, getMonthlyProgress);


router.post("/end-session", authenticateToken, endSession);

module.exports = router;            