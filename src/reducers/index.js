import { combineReducers } from 'redux';
import { persistReducer } from "redux-persist";
import storageSession from 'redux-persist/lib/storage/session';

import user from './user'

const persistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: ["user"]
  // blacklist -> 그것만 제외
};

const rootReducer = combineReducers({
  user
});

export default persistReducer(persistConfig, rootReducer);
// export default rootReducer;