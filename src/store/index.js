import { legacy_createStore as createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const create = (reducers) => {
  // return createStore(reducers, composeWithDevTools());
  return createStore(reducers);
}

export default create;