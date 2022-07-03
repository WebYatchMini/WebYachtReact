import { legacy_createStore as createStore } from 'redux';

const create = (reducers) => {
  return createStore(reducers);
}

export default create;