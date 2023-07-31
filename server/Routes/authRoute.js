const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../Controllers/authController')

// Route 1: Create a user using: POST api/auth/createUser. No Login Required.
router.post('/createUser',
    body('name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password').isLength({ min: 8 }),
    authController.createUserController
);

// Route 2: Authenticate a user using: POST api/auth/loginUser. No Login Required.
router.post('/loginUser',
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
   authController.loginUserController
);

// Route 3: Get loggedIn user details using: POST api/auth/getUser. Login Required.
router.get('/getUser', authController.getUserByIdController);

module.exports = router;