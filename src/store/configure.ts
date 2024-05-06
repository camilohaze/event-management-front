import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { thunk } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { auth } from "src/reducers/auth";
import {
  events,
  userEvents,
  event,
  storeEvent,
  uploadImage,
  updateEvent,
  deleteEvent,
  uploadEvents,
} from "src/reducers/event";
import {
  categories,
  category,
  storeCategory,
  updateCategory,
  deleteCategory,
} from "src/reducers/category";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers<any>({
  auth,
  events,
  userEvents,
  event,
  storeEvent,
  updateEvent,
  deleteEvent,
  uploadImage,
  uploadEvents,
  categories,
  category,
  storeCategory,
  updateCategory,
  deleteCategory,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
