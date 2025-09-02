import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const [failLogin, setFailLogin] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setRedirect(true);
    } catch (err) {
      if (err.response?.data) {
        setFailLogin(err.response.data);
      } else {
        setFailLogin("Login failed");
      }
    }
  }

  if (redirect) return <Navigate to={"/"} />;

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-[35rem]">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary transform active:scale-95 transition-transform duration-150">
            Login
          </button>
          <div className="text-center py-2 text-gray-500">
            Need An Account?{" "}
            <Link className="underline text-black" to="/register">
              Register Now
            </Link>
          </div>
        </form>
        {failLogin && (
          <div className="mt-2 font-bold text-center text-red-500">
            {failLogin === "This Email Address Has Not Been Registered" ? (
              <>
                {failLogin}{" "}
                <Link
                  className="underline text-blue-500 hover:text-gray-500"
                  to="/register"
                >
                  Click here
                </Link>
              </>
            ) : (
              failLogin
            )}
          </div>
        )}
      </div>
    </div>
  );
}
