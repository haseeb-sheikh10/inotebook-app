const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.POOL_USER,
    host: process.env.POOL_HOST,
    database: process.env.POOL_DB,
    password: process.env.POOL_PASS,
    port: process.env.POOL_PORT
})

module.exports = pool;