import	React,	{	Component	}	from	'react'
import	{	bindActionCreators	}	from	'redux'
import	{	connect	}	from	'react-redux'
import Auth from '../components/Auth'
import List from '../components/List'
import	*	as	authActions	from	'../actions/AuthActions'
import	*	as	listActions	from	'../actions/ListActions'

class	App	extends	Component	{
  render()	{
    var child
    if (this.props.list.user) {
      child = <List
        setStatus={this.props.authActions.setStatus}
        user={this.props.list.user}
        setUser={this.props.listActions.setUser}
        todos={this.props.list.todos}
        setTodos={this.props.listActions.setTodos}
        editing={this.props.list.editing}
        setEditing={this.props.listActions.setEditing} />
    } else {
      child = <Auth
        status={this.props.auth.status}
        setStatus={this.props.authActions.setStatus}
        setUser={this.props.listActions.setUser}
        setTodos={this.props.listActions.setTodos} />
    }
    return (
      <div>
        {child}
      </div>
    )
	}
}

function	mapStateToProps	(state)	{
  return {
    "list": state.list,
    "auth": state.auth
  }
}

function mapDispatchToProps(dispath) {
  return {
    authActions: bindActionCreators(authActions, dispath),
    listActions: bindActionCreators(listActions, dispath)
  }
}

export	default	connect(mapStateToProps, mapDispatchToProps)(App)
