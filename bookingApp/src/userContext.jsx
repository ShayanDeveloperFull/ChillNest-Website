import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      axios
        .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => setUser(data))
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        ready,
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
