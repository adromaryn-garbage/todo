'use strict'

import	React,	{	Component	}	from	'react'
import 'whatwg-fetch'
var NotificationSystem = require('react-notification-system')

export default class Registration extends Component {

  _addMessage(message, level) {
    this._notificationSystem.addNotification({
      message: message,
      level: level
    })
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem
  }

  toLogin() {
    this.props.setStatus('login')
  }

  onRegClick(e) {
    e.preventDefault()
    var form = document.querySelector('form')
    fetch('/users', {
      method: 'POST',
      credentials: 'include',
      body: new FormData(form)
    })
    .then( result => {
      if (result.status == 400 || result.status == 200) {
        return result.json()
      } else {
        this._addMessage('Something wrong ;(', 'error')
        return null
      }
    })
    .then( result => {
      if(result) {
        if (result.error) {
          this._addMessage(result.error, 'error')
        } else if(result.user) {
          this.props.setTodos(result.todos)
          this.props.setUser(result.user)
          this.props.setStatus(null)
        } else {
          this._addMessage('Your are registred!', 'success')
        }
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Registration</h1>
        <form method='post' action='/users'>
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
            placeholder='Password confirmation'
            type='password'
            name='passwordConfirmation' />
          <br />
          <input
            type='submit'
            value='Sign Up'
            onClick={::this.onRegClick} />
        </form>
        <a onClick={::this.toLogin}>Log in</a>
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }
}
