import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
const Headerr = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/browse">Browse Items</Link>
          </li>
          <li>
            <Link to="/sell">Start Selling</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>{" "}
          {/* Link to registration page */}
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Headerr;
