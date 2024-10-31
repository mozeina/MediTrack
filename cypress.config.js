const { defineConfig } = require("cypress");
require('dotenv').config({ path: "./backend/.env.test" });
const { Pool } = require("pg");
//misc functions 
const { getDay, getMonth } = require("./client/src/components/Profile/misc/miscFunctionsCommonJs");

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: "meditrack_test"
});

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async checkUserInDatabase(email) {
          let result = await pool.query("select * from users where email = $1", [email]);
          return result.rowCount > 0;
        },

        async resetDatabase() {
          await pool.query("delete from minutes");
          await pool.query("delete from latest_session");
          await pool.query("delete from weekly_progress");
          await pool.query("delete from monthly_progress");
          await pool.query("delete from monthly_progress");
          await pool.query("delete from users");
          return null;
        },

        async checkUserLevelInDatabase(email) {
          let result = await pool.query("select level_id from users where email = $1", [email]);
          return result.rows[0].level_id;
        },

        async checkDatabaseAfterSessionEnd(email) {
          let day = getDay();
          let month = getMonth();
          let userId = await pool.query("select id from users where email = $1", [email]);
          userId = userId.rows[0].id;
          let latestSession = await pool.query("select session_minutes from latest_session where user_id = $1", [userId]);
          let weeklyProgress = await pool.query(`select ${day} from weekly_progress where user_id = $1`, [userId]);
          let monthlyProgress = await pool.query(`select ${month} from monthly_progress where user_id = $1`, [userId]);
          if (latestSession.rows[0].session_minutes && weeklyProgress.rows[0][day] && monthlyProgress.rows[0][month]) return true;
          return false;
        },
      
        async seedMinutesForUser(email) {
          let userId = await pool.query("select id from users where email = $1", [email]);
          userId = userId.rows[0].id;
          await pool.query("update minutes set minutes = 1499 where user_id = $1", [userId]);
          return null;
        }
      });
      return config;
    },
  },
});
