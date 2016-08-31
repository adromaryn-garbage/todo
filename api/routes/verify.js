"use strict";

var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../server.config.json');

exports.getToken = (user) => {
  var username = user.dataValues.username;
  var hash = user.dataValues.hash;
  return jwt.sign({ username: username, hash: hash }, config.secretKey, {
    expiresIn: 3600*24*365
  })
}

exports.verifyOrdinaryUser = (req, res, next) => {
  var token = req.headers['x-access-token']
  if (token) {
    jwt.verify(token, config.secretKey, function (e, decoded) {
      if (e) {
        res.status(403).json({})
      } else {
        req.decoded = decoded
        next()
      }
    });
  } else {
    res.status(401).json({})
  }
};
