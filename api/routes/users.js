'use strict';

var express = require('express')
var router = express.Router()
var passport = require('passport')
var Verify = require('./verify')
var User = require('../models/user')

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
      if (err.message.match(/User already exists with/)) {
        res.status(400).json({
          message: err.message,
          error: err
        })
      } else {
        console.log(err.name);
        res.status(500).json({
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
