'use strict'

'use strict'

import {
  SET_USER,
  SET_TODOS,
  SET_EDITING
} from '../constants/List'

export function setUser(user){
  return {
    type: SET_USER,
    payload: user
  }
}

export function setTodos(todos){
  return {
    type: SET_TODOS,
    payload: todos
  }
}

export function setEditing(editing){
  return {
    type: SET_EDITING,
    payload: editing
  }
}
