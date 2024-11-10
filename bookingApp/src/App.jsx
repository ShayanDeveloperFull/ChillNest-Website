import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import "./index.css";
import UserContextProvider from "./userContext";
import AccountPage from "./pages/AccountPage";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/:profilePage?" element={<AccountPage />} />
          <Route
            path="/account/:profilePage/:action"
            element={<AccountPage />}
          />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
