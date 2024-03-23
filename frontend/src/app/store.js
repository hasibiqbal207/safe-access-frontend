import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

//save only user data filter
const saveUserOnlyfilter = createFilter("user", ["user"]);

// Persist Config
const persistConfig = {
    key: "user",
    storage,
    whitelist: ["user"],
    transforms: [saveUserOnlyfilter],
}

const rootReducer = combineReducers({
    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer); 

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: true,
})

export const persistor = persistStore(store)