const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const { setLevel, checkLevel, getCareerMinutes} = require("../controllers/levelController"); 


router.post("/set-level", authenticateToken, setLevel);
router.get("/check-level", authenticateToken, checkLevel);
router.get("/get-career-minutes", authenticateToken, getCareerMinutes);

module.exports = router;
