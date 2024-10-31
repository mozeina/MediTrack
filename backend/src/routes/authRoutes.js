const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/authMiddleware");

router.get("/", checkAuth);

module.exports = router;