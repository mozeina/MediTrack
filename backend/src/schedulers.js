const cron = require("node-cron");
const pool = require("../db");


const resetWeeklyProgress = () => {
    cron.schedule("0 0 * * 1", async () => {
        try {
            console.log("resetting weekly progress");
            await pool.query("update weekly_progress set monday = 0, tuesday = 0, wednesday = 0, thursday = 0, friday = 0, saturday = 0, sunday = 0");
        } catch (err) {
            console.error("An error occured with our scheduled task", err);
        }

    });
}

const resetYearlyProgress = () => {
    cron.schedule("0 0 1 1 *", async () => {
        try {
            console.log("resetting yearly progress")
            await pool.query("update monthly_progress set jan = 0, feb = null, mar = null, apr = null, may = null, jun = null, jul = null, aug = null, sep = null, oct = null, nov = null, dec = null")
        } catch (err) {
            console.error("An error occured with our yearly progress reset", err);
        }
    })
}


const setNewMonthZero = () => {
    cron.schedule("0 0 1 * *", async () => {
        let month;
        const date = new Date().getMonth();
        switch (date) {
            case 0:
                month = "jan";
                break;
            case 1:
                month = "feb";
                break;
            case 2:
                month = "mar";
                break;
            case 3:
                month = "apr";
                break;
            case 4:
                month = "may"
                break;
            case 5:
                month = "jun";
                break;
            case 6:
                month = "jul";
                break;
            case 7:
                month = "aug";
                break;
            case 8:
                month = "sep";
                break;
            case 9:
                month = "oct";
                break;
            case 10:
                month = "nov";
                break;
            case 11:
                month = "dec";
                break;
        }

        try {
            console.log("setting new month progress to 0");
            await pool.query(`update monthly_progress set ${month} = 0`);
        } catch (err) {
            console.error("An error has occured with setting first of the month progress to zero");
        }
    })
}


module.exports = { resetWeeklyProgress, resetYearlyProgress, setNewMonthZero }; 
