const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { register, login, logout, getUsername } = require("../controllers/usersController");
const { authenticateToken } = require("../middleware/authMiddleware");


router.post("/register", [
    check("username")
        .isLength({min: 3}).withMessage("Username must be at least 3 characters long.")
        .isLength({max: 50}).withMessage("Username must not exceed 50 characters.")
        .matches(/^\S+$/).withMessage("Username must not contain spaces."),
    check("email")
        .isEmail().withMessage("Invalid email.")
        .isLength({max: 50}).withMessage("Email must be fewer than 255 characters."),
    check("password")
        .isLength({min : 6}).withMessage("Password must be atleast 6 characters long.")
        .isLength({max: 255}).withMessage("Password must be fewer than 255 characters.")
        .matches(/^\S+$/).withMessage("Password must not contain any spaces.")
], register);


router.post("/login", login);

router.get("/logout", authenticateToken, logout);

router.get("/get-username", authenticateToken, getUsername);

module.exports = router;        