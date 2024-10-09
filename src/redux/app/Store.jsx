import {configureStore} from "@reduxjs/toolkit";
import RegistrationRequestReducer from "../fearture/RegistrationRequestSlice.jsx";
export const store = configureStore({
    reducer: {
        registrationRequest : RegistrationRequestReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});