const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authQuery = require('../Queries/authQuery');

const JWT_Secret = process.env.JWT_SECRET;


// Route 1: Create a user using: POST api/auth/createUser. No Login Required.
const createUserController = async (req, res) => {

    const { name, email, password } = req.body;

    //if there is error, return bad rquest and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(406).json({ success: false, errors: errors.array() });
    }

    try {

        //check for user with this email
        const existingUser = await authQuery.getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ success: false, error: "A user with this email already exists"});
            return;
        }

        // check the max user id from db and set the next user id
        const maxUserId = await authQuery.getMaxUserID();
        const newUserId = maxUserId !== null ? maxUserId + 1 : 1;

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        //create a new user
        const newUser = await authQuery.createUser(newUserId, name, email, hashedPass);

        // generate a AuthToken
        const data = {
            user: {
                id: newUser.id
            }
        }
        const authToken = jwt.sign(data, JWT_Secret);
        return res.status(201).json({ success: true, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ "error": error.message });
        return;
    }
}


// Route 2: Authenticate a user using: POST api/auth/loginUser. No Login Required.
const loginUserController = async (req, res) => {

    const { email, password } = req.body;

    //if there is error, return bad rquest and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {

        //check for user with this email
        const existingUser = await authQuery.getUserByEmail(email);
        if (!existingUser) {
            return res.status(404).json({ success: false, error: "A user with this email is not found!" })
        }

        //if exist, compare the entered password
        const passCompare = await bcrypt.compare(password, existingUser.password);

        //if do not match, through an error
        if (!passCompare) {
            return res.status(400).json({ success: false, error: "Please try to login with correct password" });
        }

        // generate a AuthToken
        const data = {
            user: {
                id: existingUser.id
            }
        }
        const authToken = jwt.sign(data, JWT_Secret);
        return res.status(200).json({ success: true, authToken });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ "error": error.message });
    }
}

// Route 3: Get loggedIn user details using: POST api/auth/getUser. Login Required
const getUserByIdController = async (req, res) => {

    //Get the user from JWT token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    
    try {
        const data = jwt.verify(token, JWT_Secret);
        const userID = data.user.id;
        const user = await authQuery.getUserById(userID);
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

module.exports = {
    createUserController,
    loginUserController,
    getUserByIdController
}