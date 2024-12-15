import React from "react";
import { MessageSquareText, User } from "lucide-react";
import "../styles/Header.css";

const Header = ({ user_state, login_clicked }) => {
  return (
    <nav className="nav_bar pr-4 md:pr-[80px]">
      <a href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="72"
          viewBox="0 0 24 24"
          className="absolute top-1 left-[16px] md:left-[120px] md:top-2"
        >
          <path
            fill="#E0FFFF"
            d="M15.865 8.279a2.452 2.452 0 1 1-4.904 0a2.452 2.452 0 0 1 4.904 0M9.75 6H0v4.904h4.846v7.269H9.75Zm8.596 0H24l-5.106 12.173H13.24z"
          />
        </svg>
      </a>

      <ul>
        <li>
          <a href="/browse">Browse</a>
        </li>

        <li>
          <div
            onClick={() => {
              user_state
                ? (window.location.href = "/user?loggedin=true")
                : login_clicked("chats");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <MessageSquareText style={{ width: "16px", height: "16px" }} />
            Chats
          </div>
        </li>

        <li>
          <div
            onClick={() => {
              user_state
                ? (window.location.href = "/user")
                : login_clicked("login");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <User style={{ width: "16px", height: "16px" }} />
            Login
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
