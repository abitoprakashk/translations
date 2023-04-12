/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */

/* Krayon style files import */
import '@teachmint/common/lib/styles/devices.css'
import '@teachmint/common/lib/styles/global.css'
import '@teachmint/common/lib/styles/variables.css'
import '@teachmint/krayon/lib/styles/devices.css'
import '@teachmint/krayon/lib/styles/variables.css'
import '@teachmint/krayon/lib/styles/themes/krayon-default-theme/global.css'
import '@teachmint/krayon/lib/styles/themes/krayon-default-theme/variables.css'
import '@teachmint/krayon/lib/styles/themes/krayon-default-theme/light/global.css'
import '@teachmint/krayon/lib/styles/themes/krayon-default-theme/light/variables.css'
import '@teachmint/krayon/lib/index.esm.css'
import './index.scss'
import './assets/css/purgedTailwind.css'

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import './i18n/i18n'
import store from './redux/store'
import reportWebVitals from './reportWebVitals'
import * as Sentry from '@sentry/react'
import {BrowserTracing} from '@sentry/tracing'
import {Workbox} from 'workbox-window'

import App from './App'

/* App's own css variables import */
import './variables.css'
import {Router} from 'react-router-dom'
import history from './history'
import {
  REACT_APP_ENABLE_SENTRY,
  REACT_APP_REGISTER_SERVICEWORKER,
} from './constants'

if (+REACT_APP_REGISTER_SERVICEWORKER && 'serviceWorker' in navigator) {
  const wb = new Workbox('/institute/static/js/sw.js', {scope: '/institute'})
  wb.register()
}

if (+REACT_APP_ENABLE_SENTRY) {
  Sentry.init({
    dsn: 'https://deb625b072794ad58c13600c30b9dc8a@o1160869.ingest.sentry.io/4504003090251776',
    // eslint-disable-next-line no-undef
    environment: process.env.NODE_ENV,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1,
    ignoreErrors: [
      'Non-Error exception captured',
      'Non-Error promise rejection captured',
    ],
    // eslint-disable-next-line no-undef
    // release: RELEASE_VERSION,
  })
}
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals()
