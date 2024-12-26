import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[var(--footerColor)] to-[var(--footerSecondaryColor)] text-white">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Trade Hub</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted platform for trading and exchanging items.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://facebook.com"
                className="p-2 rounded-full bg-blue-600 text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                className="p-2 rounded-full bg-sky-500 text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                className="p-2 rounded-full bg-pink-600 text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-white transition-colors duration-200"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-white transition-colors duration-200"></span>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>Email: support@tradehub.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Hours: Mon-Fri 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-700 py-6">
          <p className="text-sm text-center text-gray-400">
            © 2025 Trade Hub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
