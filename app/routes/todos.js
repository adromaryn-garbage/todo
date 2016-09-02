'use strict'

var express = require('express')
var router = express.Router()
var redis = require('redis')
var request = require('request-json')
var normalizePort = require('../../helpers/normalize-port')

var port_api = normalizePort(process.env.PORT_API || '3500')
var client = request.createClient(`http://localhost:${port_api}/`)

router.route('/')
.post((req, res, next) => {
  var data = {
    title: req.body.title
  }
  var sess = req.session.key
  if (sess) {
    var store = redis.createClient()
    store.on("error", err => {
      console.log("Error " + err)
    })
    store.get(sess, (err, token) => {
      if (token) {
        client.headers['x-access-token'] = token
        client.post(`/todos`, data, (err, response, body) => {
          if (response.statusCode === 200) {
            res.status(200).json({todos: body.todos})
          } else {
            res.status(response.statusCode).json({})
          }
          store.quit()
        })
      } else {
        res.status(401).json({})
        store.quit()
      }
    })
  } else {
    res.status(401).json({})
  }
})

router.route('/:id')
.put((req, res, next) => {
  var data = {
    title: req.body.title
  }
  var sess = req.session.key
  if (sess) {
    var store = redis.createClient()
    store.on("error", err => {
      console.log("Error " + err)
    })
    store.get(sess, (err, token) => {
      if (token) {
        client.headers['x-access-token'] = token
        client.put(`todos/${req.params.id}`, data, (err, response, body) => {
          if (response.statusCode === 200) {
            res.status(200).json({todos: body.todos})
          } else {
            res.status(response.statusCode).json({})
          }
          store.quit()
        })
      } else {
        res.status(401).json({})
        store.quit()
      }
    })
  } else {
    res.status(401).json({})
  }
})

.delete((req, res, next) => {
  var sess = req.session.key
  if (sess) {
    var store = redis.createClient()
    store.on("error", err => {
      console.log("Error " + err)
    })
    store.get(sess, (err, token) => {
      if (token) {
        client.headers['x-access-token'] = token
        client.delete(`todos/${req.params.id}`, (err, response, body) => {
          if (response.statusCode === 200) {
            res.status(200).json({todos: body.todos})
          } else {
            res.status(response.statusCode).json({})
          }
          store.quit()
        })
      } else {
        res.status(401).json({})
        store.quit()
      }
    })
  } else {
    res.status(401).json({})
  }
})

module.exports = router
