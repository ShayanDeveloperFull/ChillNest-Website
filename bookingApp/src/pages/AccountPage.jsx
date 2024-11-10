import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Link, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";

export default function AccountPage() {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  let { profilePage } = useParams();
  if (profilePage === undefined) {
    profilePage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect(true);
  }

  if (!ready) {
    return "LOADING........"; //To make up for the delay
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />; //To make up for the delay
  }

  function accountClasses(type = null) {
    let classes = "inline-flex gap-1 py-2 px-6 rounded-full ";
    if (type === profilePage) {
      classes = classes + " bg-blue-600 text-white rounded-full";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-6 gap-2 mb-10 ">
        <Link className={accountClasses("profile")} to={"/account"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={profilePage === "profile" ? "#FFFF00" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={profilePage === "profile" ? "#FFFF00" : "#4A5568"}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          My Profile
        </Link>
        <Link className={accountClasses("bookings")} to={"/account/bookings"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={profilePage === "bookings" ? "#FF6F61" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
            />
          </svg>
          My Bookings
        </Link>
        <Link className={accountClasses("places")} to={"/account/places"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={profilePage === "places" ? "yellow" : "currentColor"}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
            />
          </svg>
          My Nests
        </Link>
      </nav>
      {profilePage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in As {user.name} ({user.email}) <br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {profilePage === "places" && <PlacesPage />}
    </div>
  );
}
