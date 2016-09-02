'use strict'

var express = require('express')
var router = express.Router()
var redis = require('redis')
var crypto = require('crypto')
var request = require('request-json')
var normalizePort = require('../../helpers/normalize-port')

var port_api = normalizePort(process.env.PORT_API || '3500')
var client = request.createClient(`http://localhost:${port_api}/`)

router.route('/')
.post((req,res,next) => {
  if (req.body.password !== req.body.passwordConfirmation) {
    res.status(400).json({'error': 'Password and password confirmation not equal'})
  } else{
    var data = {
      username: req.body.login,
      password: req.body.password
    }
    client.post(`users/`, data, function(err, response, body) {
      if(response.statusCode === 400) {
        res.status(400).json({'error': 'User already exists with this login'})
      } else if(response.statusCode === 200) {
        client.post('sessions/', data, (err, response, body) => {
          if (response.statusCode === 200) {
            var store = redis.createClient()
            store.on("error", function (err) {
              console.log("Error " + err)
            })
            var key = crypto.randomBytes(256).toString('hex') + body.user
            store.set(key, body.token, e => {
              if (e) {
                res.status(200).json({user: null, todos: []})
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
            res.status(200).json({user: null, todos: []})
          }
        })
      } else {
        res.status(500).json({})
      }
    })
  }
})

module.exports = router
