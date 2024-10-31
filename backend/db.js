const { Pool } = require("pg");
const dotenv = require("dotenv");   

if (process.env.NODE_ENV === "test") {
    dotenv.config({path: '.env.test'})
} else {
    dotenv.config({path: '.env'});
}

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

module.exports = pool;


