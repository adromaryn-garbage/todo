'use strict'

var Sequelize = require('sequelize')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config.json')[env]
var User = require('./user')

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config)
}

module.exports = sequelize.define('Todo', {
    title: { type: Sequelize.STRING, allowNull: false },
    UserId: { type: Sequelize.INTEGER, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
        Todo.belongsTo(User)
      }
    }
})
