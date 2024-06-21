const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

// API endpoint to retrieve all users from the database
router.get('/', async (req, res, next) => {
  try {
    // Fetch all users from the database
    const findUsers = await User.find();

    // Check if no users were found and handle the error
    if (!findUsers) {
      const err = new Error('No users found')
      err.status = 404;
      console.log(err);
      next(err);
      return;
    }

    // Respond with the retrieved users and a success message
    res.status(200).json({
      message: 'Users successfully retrieved',
      findUsers
    });

  } catch (err) {
    console.log('err:', err);
    next(err);
  }
});

// API endpoint to handle user registration
router.post('/signup', async (req, res, next) => {
  const {email, password } = req.body;

    // Check if email or password is missing and respond with an error
    if(!email || !password) {
      return res.status(400).json({
        message: 'The email and password are both required input fields'
      });
    }

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        message: 'The email you entered already exists. Please enter an original email.'
      });
    }

    // Hash the provided password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Creates a new user instance with the hashed password
    const user = new User({
      email: email,
      password: hashedPassword
    });

    // Save the new user to the database
    const savedUser = await user.save();

    // Respond with success message and the user data
    res.status(201).json({
      message: 'A new user has been created',
      savedUser
    });

  } catch (err) {
    console.log('err:', err);
    next(err);
  }

});

// API endpoint to delete a user
router.delete('/:userId', async (req, res, next) => {
  const id = req.params.userId;

  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error ('The ID you entered is not a valid user ID');
      err.status = 400;
      console.log('err:', err);
      next(err);
      return;
    }

    if (!id) {
      res.status(404).json({
        message: 'User not found'
      });
    }
    const deleteUser = await User.findByIdAndDelete(id);

    res.status(200).json({
      message: 'User successfully removed',
      deleteUser
    })

  } catch (err) {
    console.log('err:', err);
    next(err);
  }
});
module.exports = router;
