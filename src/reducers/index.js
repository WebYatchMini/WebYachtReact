import { combineReducers } from 'redux';
import { persistReducer } from "redux-persist";
import storageSession from 'redux-persist/lib/storage/session';

import user from './user'
import socket from './socket'

const persistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: ["user", "socket"]
  // blacklist -> 그것만 제외
};

const rootReducer = combineReducers({
  user,
  socket
});

export default persistReducer(persistConfig, rootReducer);
// export default rootReducer;