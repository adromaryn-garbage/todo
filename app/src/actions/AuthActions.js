'use strict'

import {
  SET_STATUS
} from '../constants/Auth'

export function setStatus(status){
  return {
    type: SET_STATUS,
    payload: status
  }
}
