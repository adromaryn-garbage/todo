'use strict'

var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var fs = require('fs')
var multer = require('multer')
var upload = multer()
var config = require('./server.config.json')

var app = express()
var index = require('./routes/index')
var users = require('./routes/users')
var sessions = require('./routes/sessions')
var todos = require('./routes/todos')

var session = require('express-session')
var RedisStore = require('connect-redis')(session)

app.use(session({
    store: new RedisStore({ttl: 3600*2}),
    secret: config.secretKey,
    resave: true,
    saveUninitialized: true
}))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(upload.array())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use('/', index)
app.use('/users', users)
app.use('/sessions', sessions)
app.use('/todos', todos)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
});

// error handlers

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}


app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
