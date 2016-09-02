'use strict'

import	React,	{	Component	}	from	'react'
import 'whatwg-fetch'
var NotificationSystem = require('react-notification-system')

export default class TodoItem extends Component {

  _addMessage(message, level) {
    this._notificationSystem.addNotification({
      message: message,
      level: level
    })
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem
  }

  onItemDestroy(e){
    e.preventDefault()
    fetch(`/todos/${this.props.item.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then( result => {
      if (result.status == 401) {
        this._addMessage('Not authentificated', 'error')
        return null
      } else if (result.status == 200) {
        return result.json()
      } else if (result.status == 403) {
        this._addMessage('No access', 'error')
        return null
      } else {
        this._addMessage('Something wrong ;(', 'error')
        return null
      }
    })
    .then( result => {
      if(result) {
        this.props.setTodos(result.todos)
      }
    })
  }

  onItemEdit(e){
    if (this.props.editing === this.props.item.id) {
      this.props.setEditing(null)
    } else {
      this.props.setEditing(this.props.item.id)
      setTimeout(() => {
        if(document.querySelector('#edit-todo-form input[type="text"]')) {
          document.querySelector('#edit-todo-form input[type="text"]').value=this.props.item.title
        }
      }, 200)
    }
  }

  onItemEditConfirm(e){
    e.preventDefault()
    var form = document.getElementById('edit-todo-form')
    var data = new FormData(form)
    this.props.setEditing(null)
    fetch(`/todos/${this.props.item.id}`, {
      method: 'PUT',
      credentials: 'include',
      body: data
    })
    .then( result => {
      if (result.status == 401) {
        this._addMessage('Not authentificated', 'error')
        return null
      } else if (result.status == 200) {
        return result.json()
      } else if (result.status == 403) {
        this._addMessage('No access', 'error')
        return null
      } else {
        this._addMessage('Something wrong ;(', 'error')
        return null
      }
    })
    .then( result => {
      if(result) {
        this.props.setTodos(result.todos)
      }
    })
  }

  render() {
    if (this.props.editing === this.props.item.id) {
      var child = <form id='edit-todo-form' method='put'>
        <br />
        <input
          type='text'
          name='title' />
        <br />
        <input
          type='submit'
          value='Edit todo'
          onClick={::this.onItemEditConfirm} />
        </form>
    } else {
      child = null
    }
    return (
      <div className='todo-item'>
        <span>{this.props.item.title}</span>
        <a onClick={::this.onItemEdit}>Edit</a>
        <a onClick={::this.onItemDestroy} className='completed'>✔</a>
        {child}
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }
}
