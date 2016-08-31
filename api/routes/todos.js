'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport')
const Verify = require('./verify')
const User = require('../models/user')
const Todo = require('../models/todo')

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
        res.json({ todos: todos })
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
      .then(todos => {
        res.status(200).json({})
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
          res.status(200).json({'message': 'todo deleted'})
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
            res.status(200).json({'message': 'todo updated'})
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
