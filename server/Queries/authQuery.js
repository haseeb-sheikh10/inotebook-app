const pool = require('../db')

const getUserByEmail = async (email) => {
    try {

        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        // console.log(result.rows[0])
        return result.rows[0];

    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getUserById = async (id) => {
    try {

        // get user details except password by id 
        const query = 'SELECT id, name, email FROM users WHERE id = $1';

        const result = await pool.query(query, [id]);
        return result.rows[0];

    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getMaxUserID = async () => {
    try {
        const query = "SELECT MAX(id) AS max_id FROM users";
        const result = await pool.query(query);
        return result.rows[0].max_id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const reArrangeUserID = async (deletedID) => {
    try {
        const query = "UPDATE users SET id = id - 1 WHERE id > $1"
        const result = await pool.query(query, [deletedID]);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const createUser = async (id, name, email, hashedPass) => {
    try {

        const query = "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await pool.query(query, [id, name, email, hashedPass]);
        return result.rows[0];

    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getUserByEmail,
    getUserById,
    createUser,
    getMaxUserID,
    reArrangeUserID
}