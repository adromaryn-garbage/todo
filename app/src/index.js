'use strict'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import	App	from	'./containers/App'
require('./style.scss');

const store = configureStore()

render(
  <Provider store = { store } >
    <App />
  </Provider>,
  document.getElementById('root')
)
