'use strict';

var Sequelize = require('sequelize');
var passportLocalSequelize = require('passport-local-sequelize');
var env       = process.env.NODE_ENV || "development";
var config    = require(__dirname + '/../config.json')[env];

var sequelize = new Sequelize(config.database, config.username, config.password, config);

var User = passportLocalSequelize.defineUser(sequelize, {
    favoriteColor: Sequelize.STRING
});

module.exports = User;
