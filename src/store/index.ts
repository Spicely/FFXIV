import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import rootReducer from './reducers'

const persistConfig = {
    key: 'ff14_store',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = createStore(persistedReducer)
export const persistor = persistStore(store)