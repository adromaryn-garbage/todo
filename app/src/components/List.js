'use strict'

import	React,	{	Component	}	from	'react'
import 'whatwg-fetch'
import TodoItem from './TodoItem'
var NotificationSystem = require('react-notification-system')

export default class List extends Component {

  _addMessage(message, level) {
    this._notificationSystem.addNotification({
      message: message,
      level: level
    })
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem
  }

  logOut() {
    fetch ('/sessions', {
      method: 'DELETE',
      credentials: 'include'
    })
    .then ( result => {
      this.props.setStatus('login')
      this.props.setUser(null)
      this.props.setTodos(null)
    })
  }

  onAddTodoClick(e){
    e.preventDefault()
    var form = document.getElementById('add-todo-form')
    fetch('/todos', {
      method: 'POST',
      credentials: 'include',
      body: new FormData(form)
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
        this._addMessage('Todo created', 'success')
      }
    })
  }

  render() {
    var todosTemplate = this.props.todos.map((item, index) => {
      return (
        <div key = { index }
          className = {index%2 == 1 ? 'even' :''} >
          <TodoItem
            item={item}
            setTodos={this.props.setTodos}
            editing={this.props.editing}
            setEditing={this.props.setEditing} />
        </div>
      )
    })
    return (
      <div id='list'>
        <a onClick={::this.logOut}>Logout</a>
        <br />
        <h1>{this.props.user}</h1>
        <h2>Your ToDo list</h2>
        {todosTemplate}
        <form id='add-todo-form' method='post'>
          <input
            placeholder='New todo'
            type='text'
            name='title' />
          <br />
          <input
            type='submit'
            value='Add new todo'
            onClick={::this.onAddTodoClick} />
        </form>
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }
}
