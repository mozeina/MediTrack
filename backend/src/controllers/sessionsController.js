const pool = require("../../db");

const getLatestSession = async (req, res) => {
    const { userId } = req;
    try {
        const latestSession = await pool.query("select session_minutes, date from latest_session where user_id = $1", [userId]);
        return res.status(200).send({
            minutes: latestSession.rows[0].session_minutes,
            date: latestSession.rows[0].date
        });
    } catch (err) {
        console.error("get latest session error: ", err);
        return res.status(500).json({ error: "Internal server error." })
    }
}

// const setLatestSession = async (req, res) => {
//     const { userId } = req;
//     const { newMinutes, newDate } = req.body;
//     try {
//         await pool.query("update latest_session set session_minutes = $1, date = $2 where user_id = $3", [newMinutes, newDate, userId]);
//         return res.status(200).json({ "message": "update latest session successful" });
//     } catch (err) {
//         console.error("set latest session error: ", err);
//         return res.status(500).json({ error: "Internal server error." });
//     }
// }   


const getWeeklyProgress = async (req, res) => {

    let { userId } = req;
    try {
        let weeklyProgress = await pool.query("select monday, tuesday, wednesday, thursday, friday, saturday, sunday from weekly_progress where user_id = $1", [userId]);
        if (weeklyProgress.rows.length === 0) {
            return res.status(200).send("There has been no activity for the week.")
        }
        return res.status(200).send(weeklyProgress.rows[0]);
    } catch (err) {
        console.error("get weekly progress error: ", err);
        return res.status(500).json({ "message": "Internal server error." });
    }

};

// const updateWeeklyProgress = async (req, res) => {
//     let { day, minutes } = req.body;
//     let { userId } = req;
//     day = day.toString();
//     try {
//         let prevProgress = await pool.query(`select ${day} from weekly_progress where user_id = $1`, [userId]);
//         let allMinutes = Number(prevProgress.rows[0][`${day}`]) + Number(minutes);

//         await pool.query(`update weekly_progress set ${day} = $1  where user_id = $2`, [allMinutes.toFixed(1), userId]);
//         return res.status(200).json({ "message": "update successful" });
//     } catch (err) {
//         console.error("here is the error", err);
//         return res.status(500).json({ "error": "Internal server error." });
//     }

// };

const getMonthlyProgress = async (req, res) => {
    let { userId } = req;

    try {
        let monthlyProgress = await pool.query("select jan, feb, mar, apr, jun, jul, aug, sep, oct, nov, dec from monthly_progress where user_id = $1", [userId]);
        //monthlyProgress.rows[0] is an object containing all the months as keys and hours as values
        return res.status(200).send(monthlyProgress.rows[0])
    } catch (err) {
        console.error("monthlyProgress error backend: ", err);
        return res.status(500).json({ "error": "Internal server error." });
    }
};

// const updateMonthlyProgress = async (req, res) => {
//     let { month, minutes } = req.body;
//     let { userId } = req
//     try {
//         let existingMonthlyProgress = await pool.query(`select ${month} from monthly_progress where user_id = $1`, [userId]);
//         let allHours = existingMonthlyProgress.rows[0][`${month}`] != 0 ? (Number(existingMonthlyProgress.rows[0][`${month}`]) + (Number(minutes) / 60)) : (Number(minutes) / 60);
//         await pool.query(`update monthly_progress set ${month} = $1 where user_id = $2`, [allHours, userId]);
//         return res.status(200).send("update monthly progress successful");
//     } catch (err) {
//         console.error("updateMonthlyProgress error backend", err);
//         return res.status(500).json({ "error": "internal server error" });
//     }
// };

const endSession = async (req, res) => {
    let { userId } = req;
    let { newMinutes, newDate, day, month, careerMinutes } = req.body;

    try {
        await pool.query("BEGIN");

        //latest session setter 
        await pool.query("update latest_session set session_minutes = $1, date = $2 where user_id = $3", [newMinutes, newDate, userId]);
        //

        //weekly progress updater
        let prevProgress = await pool.query(`select ${day} from weekly_progress where user_id = $1`, [userId]);
        let allMinutes = Number(prevProgress.rows[0][`${day}`]) + Number(newMinutes);
        await pool.query(`update weekly_progress set ${day} = $1  where user_id = $2`, [allMinutes.toFixed(1), userId]);
        //

        //monthly progress updater
        let existingMonthlyProgress = await pool.query(`select ${month} from monthly_progress where user_id = $1`, [userId]);
        let allHours = existingMonthlyProgress.rows[0][`${month}`] != 0 ? (Number(existingMonthlyProgress.rows[0][`${month}`]) + (Number(newMinutes) / 60)) : (Number(newMinutes) / 60);
        await pool.query(`update monthly_progress set ${month} = $1 where user_id = $2`, [allHours, userId]);
        //

        //career minutes updater
        let row = await pool.query("select minutes from minutes where user_id = $1", [userId]);
        let totalMinutes = Number(careerMinutes) + Number(row.rows[0].minutes);
        await pool.query("update minutes set minutes = $1 where user_id = $2", [totalMinutes, userId]);
        //update level logic
        let levelIdRow = await pool.query("select level_id from users where id = $1", [userId]);
        let level_id = levelIdRow.rows[0].level_id;

        if (totalMinutes >= 1500 && level_id == 2) {
            await pool.query("update users set level_id = 3 where id = $1", [userId]);
            await pool.query("COMMIT");
            return res.status(201).json({ "levelup": "monk" });
        }

        if (totalMinutes >= 300 && totalMinutes < 1500 && level_id == 1) {
            await pool.query("update users set level_id = 2 where id = $1", [userId]);
            await pool.query("COMMIT")
            return res.status(201).json({ "levelup": "experienced" });
        }

        await pool.query("COMMIT");
        return res.status(201).json({ "message": "minutes set successfully" });
        //
    } catch (err) {
        await pool.query("ROLLBACK");
        console.error("end session transaction error:", err);
        return res.status(500).json({ "error": "Internal server error." });
    }
}

module.exports = { getLatestSession, getWeeklyProgress, getMonthlyProgress, endSession };