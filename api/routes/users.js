'use strict';

const express = require('express')
const router = express.Router()
const passport = require('passport')
const Verify = require('./verify')
const User = require('../models/user')

router.route('/')
.get((req, res, next) => {
  User
  .findAll()
  .then(function(users) {
    res.json({ users: users })
  })
})
.post((req, res, next) => {
  User.register(req.body.username,
    req.body.password, (err, user)  => {
    if (err) {
      if (err.name == 'UserExistsError') {
        res.status = 400
        res.json({
          message: err.message,
          error: err
        })
      } else {
        res.status = 500;
        return res.json({
          message: err.message,
          error: err
        })
      }
    } else {
      passport.authenticate('local')(req, res, function () {
        res.status(200).json({status: 'Registration Successful!'});
      })
    }
  })
})

module.exports = router
