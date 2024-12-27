import React, { useEffect, useState } from "react";
import {
  MessageSquareText,
  User,
  LucideHammer,
  Globe,
  LogOutIcon,
  Settings,
} from "lucide-react";
import "../styles/Header.css";

const Header = ({
  user_state,
  shadow = false,
  className = "text-[var(--foreGroundColor)] fill-[var(--accentColor)]",
  login_clicked = () => {
    window.location.href = "/user";
  },
}) => {
  const [LoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedin") != null);
  }, []);

  return (
    <nav
      className={`nav_bar select-none pr-4 md:pr-[80px] ${
        shadow ? "shadow-sm" : ""
      } ${className} flex items-center`}
    >
      <a href="/" className="mb-2 md:mb-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="70"
          viewBox="0 0 24 24"
          className={`absolute top-1 left-[16px] !bg-transparent md:left-[120px] ${
            shadow ? "!top-[1px]" : ""
          }  ${className}`}
        >
          <path d="M15.865 8.279a2.452 2.452 0 1 1-4.904 0a2.452 2.452 0 0 1 4.904 0M9.75 6H0v4.904h4.846v7.269H9.75Zm8.596 0H24l-5.106 12.173H13.24z" />
        </svg>
      </a>

      <ul className="flex">
        <li>
          <button
            className="flex items-center gap-2"
            onClick={() => (window.location.href = "/admin")}
          >
            <LucideHammer style={{ width: "16px", height: "16px" }} />
            <h1 className="hidden md:block"> Admin </h1>
          </button>
        </li>
        <li>
          <button
            className="flex items-center gap-2"
            onClick={() => (window.location.href = "/browse")}
          >
            <Globe style={{ width: "16px", height: "16px" }} />
            <h1 className="hidden md:block"> Browse </h1>
          </button>
        </li>
        <li className="relative group">
          <div
            onClick={() => {
              user_state
                ? (window.location.href = "/user")
                : login_clicked("login");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <User style={{ width: "16px", height: "16px" }} />
            <h1 className="hidden md:block">
              {" "}
              {LoggedIn ? "Profile" : "Login"}{" "}
            </h1>
          </div>
          {LoggedIn && (
            <div className="absolute left-[-30px] p-3 mt-2 w-40 flex flex-col gap-1 bg-[#16292F] overflow-hidden shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-250">
              <a
                onClick={() => {
                  LoggedIn
                    ? (window.location.href = "/user?loggedin=true")
                    : login_clicked("chats");
                }}
                className="block px-4 py-1 text-sm text-white hover:bg-gray-200 hover:text-black cursor-pointer"
              >
                <MessageSquareText size={12} />
                Chats
              </a>
              <a
                onClick={() => {
                  LoggedIn
                    ? (window.location.href = "/user?settings=true")
                    : login_clicked("chats");
                }}
                className="block px-4 py-1 text-sm text-white hover:bg-gray-200 hover:text-black cursor-pointer"
              >
                <Settings size={12} />
                Settings
              </a>
              {LoggedIn && (
                <a
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("loggedin");
                    window.location.href = "/";
                  }}
                  className="block px-4 py-1 text-sm text-red-600 hover:bg-gray-200 hover:text-black cursor-pointer"
                >
                  <LogOutIcon size={12} />
                  Logout
                </a>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;
