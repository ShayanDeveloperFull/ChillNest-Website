import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  // User state
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Search state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
        setReady(true);
      });
    }
  }, []);

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
