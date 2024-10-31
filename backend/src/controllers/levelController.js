const pool = require("../../db");

const initialMinutes = (level) => {
    let minutes = 0;
    switch (level) {
        case 1:
            minutes = 0;
            break;
        case 2:
            minutes = 300;
            break;
        case 3:
            minutes = 120;
            break;
    }
    return minutes;
}

const setLevel = async (req, res) => {
    let { userId } = req;
    let { level } = req.body;
    try {
        await pool.query("UPDATE users set level_id = $1 where id = $2", [level, userId]);
        //career minutes setter
        const minutes = initialMinutes(level);
        await pool.query("insert into minutes (user_id, minutes) values ($1, $2)", [userId, minutes]);
        return res.status(200).json({ "message": "Level set successfully." });
    } catch (err) {
        console.log("initial level set error: ", err);
        return res.status(500).json({ "error": "internal server error" });
    }
};

const checkLevel = async (req, res) => {
    let { userId } = req;
    try {
        let usersLevelData = await pool.query("Select level_id from users where id = $1", [userId]);
        let usersLevel = usersLevelData.rows[0].level_id ? (usersLevelData.rows[0].level_id).toString() : "";
        return res.status(200).send(usersLevel);
    } catch (err) {
        return res.status(500).json({ "error": "Internal server error for level check" });
    }
}

const getCareerMinutes = async (req, res) => {
    let { userId } = req;
    try {
        let row = await pool.query("select minutes from minutes where user_id = $1", [userId]);
        let minutes = row.rows[0].minutes || 0;
        return res.status(200).send(minutes.toString());
    } catch (err) {
        console.error("error with getting career minutes", err);
        return res.status(500).json({ "error": "Internal server error." });
    }
}

module.exports = { setLevel, checkLevel, getCareerMinutes };
