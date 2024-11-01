const pool = require("../../db");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {

    const result = validationResult(req);

    //here are the errors for invalid username, email, password
    
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    const { username, email, password } = req.body;

    try {

        //for register on the server side we have to check if user already exists 
        const userExists = await pool.query("select * from users where email = $1", [email]);
        if (userExists.rowCount > 0) {
            return res.status(409).json({ "error": "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query("INSERT INTO users (username, email, password) values ($1, $2, $3) returning *;", [username, email, hashedPassword]);
        //latest session creation
        await pool.query("insert into latest_session (user_id, session_minutes, date) values ($1, 0, 0)", [newUser.rows[0].id]);
        //weekly progress creation
        await pool.query("insert into weekly_progress (user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday) values ($1, 0, 0, 0, 0, 0, 0, 0)", [newUser.rows[0].id]);
        //monthly progress creation
        let date = new Date();
        let months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        let month = months[date.getMonth()];
        await pool.query(`insert into monthly_progress (user_id, ${month}) values ($1, 0)`, [newUser.rows[0].id]);
        const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        return res.status(201).cookie("auth-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 60 * 60 * 1000 * 12
        }).json({ "message": "User created successfully." });

    } catch (err) {     
        console.log("register error!: ", err);   
        return res.status(500).json({ "error": "Internal server error." });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const userExists = await pool.query("select * from users where email = $1", [email]);

        if (userExists.rowCount === 0) {
            return res.status(404).json({ "error": "User doesn't exist." })
        }

        const realPassword = userExists.rows[0].password;

        const result = await bcrypt.compare(password, realPassword);

        if (!result) {
            return res.status(401).json({ "error": "Incorrect password" })
        }

        const token = jwt.sign({ userId: userExists.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "12h" });

        return res.status(200).cookie("auth-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 60 * 60 * 1000 * 12
        }).json({ "message": "Logged In Successfully" });

    } catch (err) {
        console.error("login backend error", err);
        return res.status(500).json({ "error": "Internal server error" });
    };
};

const logout = async (req, res) => {
    try {
        res.clearCookie("auth-token", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        return res.status(200).json({ "message": "logged out successfully!" });
    } catch (err) {
        return res.status(500).json({ "message": "unable to log out / server error." });
    }

};

const getUsername = async (req, res) => {
    try {
        let user = await pool.query("select username from users where id = $1", [req.userId]);
        return res.status(200).send(user.rows[0].username); 
    } catch(err) {
        return res.status(500).json({"error": "Internal server error"});
    }
};


module.exports = { register, login, logout, getUsername };  