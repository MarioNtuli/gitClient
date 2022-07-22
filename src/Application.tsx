import { FunctionComponent } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/login";
import { initializeApp } from "firebase/app";
import { config } from "./config/firebase-config";
import Home from "./components/pages/home";
import AuthRoute from "./service/authRoute";
import UserProvider from "./shared/UserProvider";

initializeApp(config.firebaseConfig);

const Application: FunctionComponent = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const name = urlParams.get("name");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserProvider>
              {name && <Home />} ||
              {!name && (
                <AuthRoute>
                  <Home />
                </AuthRoute>
              )}
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
