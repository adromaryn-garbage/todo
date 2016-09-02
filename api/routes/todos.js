'use strict'

var express = require('express')
var router = express.Router()
var passport = require('passport')
var Verify = require('./verify')
var User = require('../models/user')
var Todo = require('../models/todo')

router.route('/')
.get(Verify.verifyOrdinaryUser, (req, res, next) => {
  User.findOne({
    where: {
      username: req.decoded.username
    }
  })
  .then(user => {
    if (user) {
      Todo
      .findAll({
        where: {
          UserId: user.id
        }
      })
      .then(todos => {
        res.json({
          user: user.username,
          todos: todos
        })
      })
    } else {
      res.status(401).json({})
    }
  })
})

.post(Verify.verifyOrdinaryUser, (req, res, next) => {
  User.findOne({
    where: {
      username: req.decoded.username
    }
  })
  .then(user => {
    if (user) {
      Todo
      .create({
        title: req.body.title,
        UserId: user.id
      })
      .then(todo => {
        Todo
        .findAll({
          where: {
            UserId: user.id
          }
        })
        .then(todos => {res.status(200).json({todos: todos})})
      })
      .catch(e => {
        res.status(400).json({message: e.message})
      })
    } else {
      res.status(401).json({})
    }
  })
})

router.route('/:id')
.delete(Verify.verifyOrdinaryUser, (req, res, next) => {
  User.findOne({
    where: {
      username: req.decoded.username
    }
  })
  .then(user => {
    if (user) {
      Todo
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(todo => {
        if (todo.UserId === user.id) {
          todo.destroy()
          .then( result => {
            Todo
            .findAll({
              where: {
                UserId: user.id
              }
            })
            .then(todos => {res.status(200).json({todos: todos})})
          })
        } else {
          res.status(403).json({'message': 'not access to this todo'})
        }
      })
      .catch(e => {
        console.log(e);
        res.status(400).json({message: 'todo not found'})
      })
    } else {
      res.status(401).json({})
    }
  })
})

.put(Verify.verifyOrdinaryUser, (req, res, next) => {
  User.findOne({
    where: {
      username: req.decoded.username
    }
  })
  .then(user => {
    if (user) {
      Todo
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(todo => {
        if (todo.UserId === user.id) {
          todo.update(
            { title: req.body.title }
          )
          .then(r => {
            Todo
            .findAll({
              where: {
                UserId: user.id
              }
            })
            .then(todos => {
              res.status(200).json({todos: todos})
            })
          })
          .catch(e => {
            res.status(400).json({'message': 'todo not updated'})
          })
        } else {
          res.status(403).json({'message': 'not access to this todo'})
        }
      })
      .catch(e => {
        console.log(e);
        res.status(400).json({message: 'todo not found'})
      })
    } else {
      res.status(401).json({})
    }
  })
})

.get(Verify.verifyOrdinaryUser, (req, res, next) => {
  User.findOne({
    where: {
      username: req.decoded.username
    }
  })
  .then(user => {
    if (user) {
      Todo
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(todo => {
        if (todo.UserId === user.id) {
          res.status(200).json({'todo': todo})
        } else {
          res.status(403).json({'message': 'not access to this todo'})
        }
      })
      .catch(e => {
        console.log(e);
        res.status(400).json({message: 'todo not found'})
      })
    } else {
      res.status(401).json({})
    }
  })
})

module.exports = router
