import { Link } from "react-router-dom";
import { UserContext } from "../userContext";
import { useContext } from "react";

export default function Header() {
  const { user } = useContext(UserContext);
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-800 rounded-2xl">
      <header className="flex justify-between items-center px-8 py-4 m-0">
        {/* Logo Section */}
        <Link to={"/"} className="flex gap-1 items-center">
          <div className="rounded-lg bg-blue-300">
            <img
              src="/images/WebLogo.jpg"
              className="h-14 w-auto mix-blend-multiply"
              alt="ChillNest Logo"
            />
          </div>
          <span className="font-bold text-xl mt-3 text-white">ChillNest</span>
        </Link>

        {/* Search Bar */}
        <div className="flex gap-2 border border-gray-400 rounded-lg py-3 px-3 shadow-md bg-white">
          <div>Where?</div>
          <div className="border-l border-gray-300"></div>
          <div>Which Week?</div>
          <div className="border-l border-gray-300"></div>
          <div>Number of Guests</div>
          <button className="bg-blue-300 text-white p-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-2 bg-white border border-gray-400 rounded-full py-2 px-4 shadow-md">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <Link
            to={user ? "/account" : "/login"}
            className="bg-blue-500 text-white rounded-full p-2 border border-gray-500 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              strokeWidth={1.8}
              stroke={user ? "red" : "currentColor"}
              className={`size-6 ${
                !user
                  ? "group-hover:fill-red-600 group-hover:stroke-red-600 transition-all"
                  : ""
              }`}
              fill={user ? "red" : "currentColor"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>
          {!!user && <div>{user.name}</div>}
        </div>
      </header>
    </div>
  );
}
