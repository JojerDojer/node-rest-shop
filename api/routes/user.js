const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
  const {email, password } = req.body;

    // Returns an error if either email or password is not provided.
    if(!email || !password) {
      return res.status(400).json({
        message: 'The username and password are both required input fields'
      });
    }

  try {

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Creates a new instance of User
    const user = new User({
      email: email,
      password: hashedPassword
    });

    // Saves the new user to the database
    const savedUser = await user.save();

    // Respond with successful status code and data
    res.status(201).json({
      message: 'A new user has been created',
      savedUser
    });

  } catch (err) {
    console.log('err:', err);
    next(err);
  }

});
module.exports = router;
