import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./UserPlacesPage";
import AccountNav from "../components/AccountNav";

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

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div>
      <AccountNav />
      {profilePage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in As {user.name} ({user.email}) <br />
          <button
            onClick={logout}
            className="primary max-w-sm mt-2 transform active:scale-95 transition-transform duration-150"
          >
            Logout
          </button>
        </div>
      )}

      {profilePage === "places" && <PlacesPage />}
    </div>
  );
}
