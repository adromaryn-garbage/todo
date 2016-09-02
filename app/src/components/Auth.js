'use strict'

import	React,	{	Component	}	from	'react'
import Login from '../components/Login'
import Registration from '../components/Registration'

export default class Auth extends Component {
  render() {
    var child
    if (this.props.status === 'login') {
      child = <Login
        setStatus={this.props.setStatus}
        setUser={this.props.setUser}
        setTodos={this.props.setTodos} />
    } else {
      child = <Registration
        setStatus={this.props.setStatus}
        setUser={this.props.setUser}
        setTodos={this.props.setTodos} />
    }
    return (
      <div id='auth'>
        {child}
      </div>
    )
  }
}
