
import './App.css'
import LoginPage from "./page/auth/LoginPage.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import RegistrationRequestPage from "./page/auth/RegistrationRequestPage.jsx";
import {Provider} from "react-redux";
import {store} from './redux/app/Store.jsx';
import MainLayout from "./page/layout/MainLayout.jsx";
import HomePage from "./page/HomePage.jsx";
import PassengerPage from "./page/PassengerPage.jsx";
import TourPackagePage from "./page/TourPackagePage.jsx";
import TourInstancePage from "./page/TourInstancePage.jsx";
import ItemPage from "./page/ItemPage.jsx";
import UserManagementPage from "./page/UserManagementPage.jsx";
import RegistrationRequestManagementPage from "./page/RegistrationRequestManagementPage.jsx";
import MapPage from "./page/ MapPage.jsx";

function App() {
  return (
    <>
        <Provider store={store}>
        <Routes>
            <Route path="" element={<MainLayout/>}>
                <Route index element={<HomePage />} />
                <Route path="passenger" element={<PassengerPage/>} />
                <Route path="tour-package" element={<TourPackagePage/>} />
                <Route path="tour-instance" element={<TourInstancePage/>} />
                <Route path="item" element={<ItemPage/>} />
                <Route path="user-management" element={<UserManagementPage/>} />
                <Route path="account-management" element={<UserManagementPage/>} />
                <Route path="registration-request-management" element={<RegistrationRequestManagementPage/>} />
                <Route path="map" element={<MapPage/>} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration-request" element={<RegistrationRequestPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Provider>
    </>
  )
}

export default App
