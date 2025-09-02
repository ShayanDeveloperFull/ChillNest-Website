import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../userContext";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function Header() {
  const { user, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } =
    useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogoClick = () => {
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    if (location.pathname === "/") {
      flatpickr("#checkInDate", {
        dateFormat: "Y-m-d",
        onChange: function (selectedDates) {
          setCheckInDate(
            selectedDates[0] ? selectedDates[0].toISOString().split("T")[0] : ""
          );
        },
      });

      flatpickr("#checkOutDate", {
        dateFormat: "Y-m-d",
        onChange: function (selectedDates) {
          setCheckOutDate(
            selectedDates[0] ? selectedDates[0].toISOString().split("T")[0] : ""
          );
        },
      });
    }
  }, [setCheckInDate, setCheckOutDate, location.pathname]); // Add location.pathname to reinitialize when the path changes

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-800 rounded-2xl">
      {/* MOBILE HEADER (< md) */}
      <header className="md:hidden grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex gap-2 items-center border-2 border-transparent hover:border-white p-1"
          onClick={handleLogoClick}
        >
          <div className="rounded-lg bg-blue-300 h-12 w-12 flex items-center justify-center overflow-hidden">
            <img
              src="/WebLogo.jpg"
              className="h-full w-auto mix-blend-multiply"
              alt="ChillNest Logo"
            />
          </div>
          <span className="font-bold text-lg text-white leading-5">
            ChillNest
          </span>
        </Link>
        {/* User top-right */}
        <div className="flex items-center gap-2 bg-white border border-gray-400 rounded-full py-1.5 px-3 shadow-md ml-auto">
          <Link
            to={user ? "/account" : "/login"}
            className={`bg-blue-500 text-white rounded-full p-2 border-4 border-blue-500 group ${
              user
                ? "hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(255,_255,_0,_0.8)]"
                : ""
            }`}
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
          {!!user && (
            <div className="text-xs max-w-[90px] truncate">{user.name}</div>
          )}
        </div>
        {/* Search full width */}
        {location.pathname === "/" && (
          <div className="col-span-2 w-full">
            <div className="grid grid-cols-2 gap-2 w-full">
              <div>
                <input
                  id="checkInDate"
                  type="text"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  placeholder="Select Availability From"
                  className="text-xs placeholder:text-xs"
                  aria-label="Check in date"
                />
              </div>
              <div>
                <input
                  id="checkOutDate"
                  type="text"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  placeholder="Select Availability Until"
                  className="text-xs placeholder:text-xs"
                  aria-label="Check out date"
                />
              </div>
            </div>
          </div>
        )}
        {location.pathname !== "/" && (
          <div className="col-span-2 text-center text-white font-semibold text-base">
            <p>Discover Your Next Stay with ChillNest</p>
          </div>
        )}
      </header>

      {/* DESKTOP HEADER (>= md) EXACT ORIGINAL LAYOUT */}
      <header className="hidden md:flex justify-between items-center px-8 py-4">
        <Link
          to="/"
          className="flex gap-1 items-center border-2 border-transparent hover:border-white p-1"
          onClick={handleLogoClick}
        >
          <div className="rounded-lg bg-blue-300">
            <img
              src="/WebLogo.jpg"
              className="h-14 w-auto mix-blend-multiply"
              alt="ChillNest Logo"
            />
          </div>
          <span className="font-bold text-xl mt-3 text-white">ChillNest</span>
        </Link>
        {location.pathname === "/" && (
          <div className="flex gap-4">
            <div>
              <input
                id="checkInDate"
                type="text"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                placeholder="Select Availability From"
              />
            </div>
            <div>
              <input
                id="checkOutDate"
                type="text"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                placeholder="Select Availability Until"
              />
            </div>
          </div>
        )}
        {location.pathname !== "/" && (
          <div className="text-white font-semibold text-xl ">
            <p>Discover Your Next Stay with ChillNest</p>
          </div>
        )}
        <div className="flex items-center gap-2 bg-white border border-gray-400 rounded-full py-2 px-4 shadow-md">
          <Link
            to={user ? "/account" : "/login"}
            className={`bg-blue-500 text-white rounded-full p-2 border-4 border-blue-500 group ${
              user
                ? "hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(255,_255,_0,_0.8)]"
                : ""
            }`}
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
