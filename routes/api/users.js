const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');
const { findOneAndDelete } = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    }

    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      })
    })
  }
)

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  const user = await User.findOne({ email })
  // Check for user
  if (!user) {
    errors.email = 'User not found';
    return res.status(404).json(errors);
  }

  // Check Password
  bcrypt.compare(password, user.password).then(isMatch => {
    if (isMatch) {
      // User Matched
      const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

      // Sign Token
      jwt.sign(
        payload,
        keys.secretOrKey,
        { },
        (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          });
        }
      );
    } else {
      errors.password = 'Password incorrect';
      return res.status(400).json(errors);
    }
  })
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    });
  }
)

// @route   GET api/users/list
// @desc    Return user list
// @access  Admin Only
router.get(
  '/list',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }

    const users = await User.find()

    res.json({
      users
    })
  }
)

// @route   PUT api/users/:id
// @desc    Edit Current User
// @access  Admin only
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }

    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.email;

    // Find user by email
    const user = await User.findOne({ email })

    // Check for user
    if (user && user._id != req.params.id) {
      errors.email = 'Email is used on another account';
      return res.status(404).json(errors);
    }

    const updatedUser = await User.findOne(
      { _id: req.params.id }
    )

    updatedUser.email = email
    updatedUser.role = req.body.role

    if (updatedUser.password != req.body.password) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(updatedUser.password, salt, (err, hash) => {
          if (err) throw err;
          updatedUser.password = hash
          updatedUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    } else {
      const resUser = await updatedUser.save()
      res.json(resUser)
    }

  }
)

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Admin Only
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }

    const user = await User.findOneAndDelete(
      { _id: req.params.id }
    )

    res.json(user)
  }
)

module.exports = router;
