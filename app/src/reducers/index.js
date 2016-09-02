'use strict'

import { combineReducers } from 'redux'
import auth from './auth'
import list from './list'

export default combineReducers({
  auth,
  list
})
