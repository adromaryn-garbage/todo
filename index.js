'use strict'

var api = require('./api/server.js')
var app = require('./app/server.js')
var debug = require('debug')('todo:server')
var http = require('http')
var	fs	=	require('fs')
var	babelrc	=	fs.readFileSync('./.babelrc')
var normalizePort = require('./helpers/normalize-port')
var	config
try	{
		config	=	JSON.parse(babelrc)
}	catch	(err)	{
		console.error('==>					ERROR:	Error	parsing	your	.babelrc.')
		console.error(err)
}
require('babel-core/register')(config)

/**
 * Get port from environment and store in Express.
 */

var port_api = normalizePort(process.env.PORT_API || '3500')
var port_app = normalizePort(process.env.PORT_APP || '8000')
api.set('port', port_api)
app.set('port', port_app)

/**
 * Create HTTP server.
 */

var server_api = http.createServer(api)
var server_app = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server_api.listen(port_api)
server_api.on('error', onError)
server_api.on('listening', onListening)

server_app.listen(port_app)
server_app.on('error', onError)
server_app.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = this.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
