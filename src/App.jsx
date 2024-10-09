
import './App.css'
import LoginPage from "./page/auth/LoginPage.jsx";
import {Route, Routes} from "react-router-dom";
import RegistrationRequestPage from "./page/auth/RegistrationRequestPage.jsx";
import {Provider} from "react-redux";
import {store} from './redux/app/Store.jsx';
import MainLayout from "./page/layout/MainLayout.jsx";
import Home from "./page/Home.jsx";

function App() {
  return (
    <>
        <Provider store={store}>
        <Routes>
            <Route path="" element={<MainLayout/>}>
                <Route index element={<Home />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration-request" element={<RegistrationRequestPage />} />
        </Routes>
        </Provider>
    </>
  )
}

export default App
