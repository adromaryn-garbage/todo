'use strict'

var express = require('express')
var router = express.Router()
var redis = require('redis')
var request = require('request-json')
var crypto = require('crypto')
var normalizePort = require('../../helpers/normalize-port')

var port_api = normalizePort(process.env.PORT_API || '3500')
var client = request.createClient(`http://localhost:${port_api}/`)

router.route('/')
.post((req, res, next) => {
  var data = {
    username: req.body.login,
    password: req.body.password
  }
  client.post('sessions/', data, (err, response, body) => {
    if (response.statusCode === 401) {
      res.status(401).json({message: 'User not found!'})
    } else if (response.statusCode === 200) {
      var store = redis.createClient()
      store.on("error", function (err) {
        console.log("Error " + err)
      })
      var key = crypto.randomBytes(256).toString('hex') + body.user
      store.set(key, body.token, e => {
        if (e) {
          res.status(500).json({})
        } else {
          req.session.key = key
          client.headers['x-access-token'] = body.token
          client.get('todos/', (err, response, body) => {
            res.header('Access-Control-Allow-Credentials', 'true')
            if (response.statusCode === 200) {
              res.status(200).json({user: body.user, todos: body.todos})
            } else {
              res.status(200).json({user: body.user, todos: []})
            }
            store.quit()
          })
        }
      })
    } else {
      res.status(500).json({})
    }
  })
})

.delete((req, res, next) => {
  var sess = req.session.key
  res.header('Access-Control-Allow-Credentials', 'true')
  if (sess) {
    req.session.destroy
    var store = redis.createClient()
    store.on("error", err => {
      console.log("Error " + err)
    })
    store.get(sess, (err, token) => {
      if (token) {
        store.del(sess)
        client.headers['x-access-token'] = token
        client.delete('sessions/', (err, response, body) => {
          res.status(200).json({})
          store.quit()
        })
      } else {
        res.status(200).json({})
        store.quit()
      }
    })
  } else {
    res.status(200).json({})
  }
})

module.exports = router
