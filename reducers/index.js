import { combineReducers } from 'redux';
import { persistReducer } from "redux-persist";
import storageSession from 'redux-persist/lib/storage/session';

import user from './user'
import room from './room'

const persistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: ["user", "room"]
  // blacklist -> 그것만 제외
};

const rootReducer = combineReducers({
  user,
  room
});

export default persistReducer(persistConfig, rootReducer);
// export default rootReducer;