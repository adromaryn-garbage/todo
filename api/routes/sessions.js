'use strict'

var express = require('express')
var router = express.Router()
var passport = require('passport')
var Verify = require('./verify')

router.route('/')
.post((req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    } else if (!user) {
      res.status(401).json({
        err: 'User not found!'
      })
    } else {
      req.logIn(user, function(err) {
        if (err) {
          res.status(500).json({
            err: 'Could not log in user!'
          })
        } else {
          var token = Verify.getToken(user);
          res.status(200).json({
            status: 'Login successful!',
            success: true,
            token: token,
            user: user.username
          })
        }
      })
    }
  })(req,res,next)
})

.delete((req, res) => {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
})

module.exports = router
