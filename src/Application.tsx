import { FunctionComponent } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/login";
import { initializeApp } from "firebase/app";
import { config } from "./config/firebase-config";
import Home from "./components/pages/home/Home";
import AuthRoute from "./service/authRoute";
import { IUser, LoginContext } from "./shared/Context";
import UserProvider from "./shared/UserProvider";

initializeApp(config.firebaseConfig);

const Application: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserProvider>
              <AuthRoute>
                <Home />
              </AuthRoute>
            </UserProvider>
          }
        />
        <Route
          path="/Login"
          element={
            <UserProvider>
              <Login />
            </UserProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default Application;
