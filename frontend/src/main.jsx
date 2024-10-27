import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { store } from './app/store';
import { Provider } from 'react-redux';
import ReactGA from "react-ga4";
import "react-datepicker/dist/react-datepicker.css";
import './utilities/Common.css'
import './utilities/Layout.css'
import './utilities/Sizes.css'
import './utilities/Text.css'
import './utilities/ReactDatepicker.css'
import './index.css'

if (import.meta.env.VITE_ENV === 'production' ) {
  ReactGA.initialize([
    {
        trackingId: "G-91S8JM9CTP",
    },
  ])
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>,
)

