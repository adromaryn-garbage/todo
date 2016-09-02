'use strict'

import {
  SET_USER,
  SET_TODOS,
  SET_EDITING
} from '../constants/List'

const initialState = {
  user: preloadedState.list.user,
  todos: preloadedState.list.todos,
  editing: null
}

export default function list(state = initialState, action){
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload }
    case SET_TODOS:
      return { ...state, todos: action.payload }
    case SET_EDITING:
      return { ...state, editing: action.payload}
    default:
      return state
  }
}
