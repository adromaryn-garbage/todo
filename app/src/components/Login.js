'use strict'

import	React,	{	Component	}	from	'react'
import 'whatwg-fetch'
var NotificationSystem = require('react-notification-system')

export default class Login extends Component {

  _addError(message) {
    this._notificationSystem.addNotification({
      message: message,
      level: 'error'
    })
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem
  }

  toReg(){
    this.props.setStatus('reg')
  }

  onLoginClick(e) {
    e.preventDefault()
    var form = document.querySelector('form')
    fetch('/sessions', {
      method: 'POST',
      credentials: 'include',
      body: new FormData(form)
    })
    .then( result => {
      if (result.status == 401) {
        this._addError('Login or password invalid')
        return null
      } else if (result.status == 200) {
        return result.json()
      } else {
        this._addError('Something wrong ;(')
        return null
      }
    })
    .then( result => {
      if(result) {
        this.props.setTodos(result.todos)
        this.props.setUser(result.user)
        this.props.setStatus(null)
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form method='post' action='/sessions'>
          <input
            placeholder='Login'
            type='text'
            name='login' />
          <br />
          <input
            placeholder='Password'
            type='password'
            name='password' />
          <br />
          <input
            type='submit'
            value='Log In!'
            onClick={::this.onLoginClick} />
        </form>
        <a onClick={::this.toReg}>Not registred yet?</a>
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }
}
