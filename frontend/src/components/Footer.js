import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left mb-4 md:mb-0">
            © 2024 Trade-Hub. All Rights Reserved.
          </p>
          <ul className="flex space-x-4">
            <li>
              <a href="/terms" className="hover:text-gray-400">
                Terms of Service
              </a>
            </li>

            <li>
              <a
                href="mailto:urbana.jaman.cse@ulab.edu.bd"
                className="hover:text-gray-400"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                className="hover:text-gray-400 transform hover:scale-110 active:bg-green-500"
              >
                <Facebook size={24} />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                className="hover:text-gray-400 transform hover:scale-110 active:bg-green-500"
              >
                <Twitter size={24} />
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                className="hover:text-gray-400 transform hover:scale-110 active:bg-green-500"
              >
                <Instagram size={24} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
