import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2024 Trade-Hub. All Rights Reserved.</p>
      <ul>
        <li>
          <a href="/terms">Terms of Service</a>
        </li>
        <li>
          <a href="/privacy">Privacy Policy</a>
        </li>
        <li>
          <a href="mailto:urbana.jaman.cse@ulab.edu.bd">Contact Us</a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
