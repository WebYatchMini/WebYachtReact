import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './components/App';
import {Provider} from 'react-redux';
import createStore from './store';
import reducers from './reducers';
// (나중에 redux-toolkit으로 바꿔서 configureStore로 바꾸기)

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(reducers);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
