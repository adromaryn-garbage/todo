'use strict'

import {
  SET_STATUS
} from '../constants/Auth'

const initialState = {
  status: preloadedState.auth.status
}

export default function auth(state = initialState, action){
  switch (action.type) {
    case SET_STATUS:
      return { ...state, status: action.payload }
    default:
      return state
  }
}
