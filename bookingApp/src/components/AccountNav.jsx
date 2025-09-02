import { Link, useLocation } from "react-router-dom";

export default function AccountNav() {
  const { pathname } = useLocation();

  //console.log(pathname);

  let profilePage = pathname.split("/")?.[2];

  //console.log({ profilePage });

  if (profilePage === undefined) {
    profilePage = "profile";
  }

  function accountClasses(type = null) {
    // Smaller padding & font on mobile; original spacing retained on >= md
    let classes =
      "inline-flex gap-1 py-2 px-3 md:px-6 rounded-full text-xs md:text-base whitespace-nowrap";
    if (type === profilePage) {
      classes = classes + " bg-blue-600 text-white rounded-full";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }

  return (
    <nav className="w-full flex justify-center mt-6 gap-2 mb-10">
      <Link
        className={`${accountClasses("profile")}  ${
          pathname === "/account" ? "font-semibold" : "hover:bg-blue-200"
        } transition-colors duration-300 group`}
        to="/account"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-6 ${
            pathname === "/account"
              ? "fill-red-600 stroke-yellow-300"
              : "group-hover:fill-red-300"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
        My Profile
      </Link>
      <Link
        className={`${accountClasses("bookings")} 
        ${
          pathname === "/account/bookings"
            ? "font-semibold"
            : "hover:bg-blue-200"
        } transition-colors duration-300 group`}
        to={"/account/bookings"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-6 ${
            pathname === "/account/bookings"
              ? "fill-red-600 stroke-yellow-300"
              : "group-hover:fill-red-300"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
          />
        </svg>
        My Bookings
      </Link>
      <Link
        className={`${accountClasses("places")} 
        ${
          pathname === "/account/places" ? "font-semibold" : "hover:bg-blue-200"
        } transition-colors duration-300 group `}
        to={"/account/places"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-6 ${
            pathname === "/account/places"
              ? "fill-red-600 stroke-yellow-300"
              : "group-hover:stroke-red-500 group-hover:fill-red-500"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        My Nests
      </Link>
    </nav>
  );
}
