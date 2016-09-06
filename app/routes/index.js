'use strict'

var express = require('express')
var router = express.Router()
var redis = require('redis')
var request = require('request-json')
var normalizePort = require('../../helpers/normalize-port')
var config = require('../server.config.json');
var redisOptions = {
  host: config.redisHost,
  port: config.redisPort,
  prefix: config.redisPrefix,
  db: config.redisDB,
  password: config.redisDBPassword
}

var port_api = normalizePort(process.env.PORT_API || '3500')
var client = request.createClient(`http://localhost:${port_api}/`)

router.route('/')
.get((req, res, next) => {
  var sess = req.session.key
  if (sess) {
    var store = redis.createClient(redisOptions)
    store.on("error", err => {
      console.log("Error " + err)
    })
    store.get(sess, (err, token) => {
      if (token) {
        client.headers['x-access-token'] = token
        client.get('todos/', (err, response, body) => {
          if (response.statusCode === 200) {
            var todos = body.todos
          } else {
            var todos = []
          }
          let preloadedState = {
            list: {
              user: body.user,
              todos: todos
            },
            auth: {
              status: null
            }
          }
          res.render('index', {preloadedState: preloadedState})
          store.quit()
        })
      } else {
        let preloadedState = {
          list: {
            user: null,
            todos: []
          },
          auth: {
            status: 'login'
          }
        }
        res.render('index', {preloadedState: preloadedState})
        store.quit()
      }
    })
  } else {
    let preloadedState = {
      list: {
        user: null,
        todos: []
      },
      auth: {
        status: 'login'
      }
    }
    res.render('index', {preloadedState: preloadedState})
  }
})

module.exports = router
