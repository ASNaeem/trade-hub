import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import Header from "../components/Header";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-white to-gray-50">
      <Header
        shadow={true}
        className="text-black !fixed bg-[var(--foreGroundColor)] overflow-hidden fill-[var(--primaryColor)]"
      />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--primaryColor)] to-purple-600 inline-block text-transparent bg-clip-text">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg">We'd love to hear from you!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-sm border border-gray-100 flex flex-col h-full">
            <h2 className="text-2xl font-semibold mb-8 pb-4 border-b border-gray-100 flex items-center gap-2">
              Contact Information
              <div className="h-1 w-8 bg-[var(--primaryColor)] rounded-full ml-2"></div>
            </h2>
            <div className="space-y-8 flex-grow">
              <div className="group cursor-pointer">
                <div className="flex items-start transition-all duration-300 hover:translate-x-2 relative">
                  <Mail className="text-[var(--primaryColor)] w-5 h-5 mt-1 shrink-0" />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[var(--primaryColor)] transition-colors">
                      Email Us
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      For general inquiries
                    </p>
                    <a
                      href="mailto:contact@tradehub.com"
                      className="text-lg text-[var(--primaryColor)] hover:underline inline-flex items-center gap-2 group"
                    >
                      contact@tradehub.com
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="flex items-start transition-all duration-300 hover:translate-x-2">
                  <Phone className="text-[var(--primaryColor)] w-5 h-5 mt-1 shrink-0" />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[var(--primaryColor)] transition-colors">
                      Call Us
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Mon - Fri from 8am to 5pm
                    </p>
                    <a
                      href="tel:+1(123)456-7890"
                      className="text-lg text-[var(--primaryColor)] hover:underline inline-flex items-center gap-2 group"
                    >
                      +1 (123) 456-7890
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="flex items-start transition-all duration-300 hover:translate-x-2">
                  <MapPin className="text-[var(--primaryColor)] w-5 h-5 mt-1 shrink-0" />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[var(--primaryColor)] transition-colors">
                      Visit Us
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Our office location
                    </p>
                    <address className="text-lg not-italic">
                      123 Trade Hub St,
                      <br />
                      Business City, BC 12345
                    </address>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-6 flex items-center">
                Business Hours
                <div className="h-1 w-4 bg-[var(--primaryColor)] rounded-full ml-2"></div>
              </h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Monday - Friday</p>
                  <p className="font-medium text-[var(--primaryColor)]">
                    8:00 AM - 5:00 PM
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Saturday - Sunday</p>
                  <p className="font-medium text-[var(--primaryColor)]">
                    Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-sm border border-gray-100 flex flex-col h-full">
            <h2 className="text-2xl font-semibold mb-8 flex items-center">
              Send us a Message
              <div className="h-1 w-8 bg-[var(--primaryColor)] rounded-full ml-2"></div>
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 flex-grow flex flex-col"
            >
              <div className="group">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[var(--primaryColor)] transition-colors"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primaryColor)] focus:border-transparent outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[var(--primaryColor)] transition-colors"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primaryColor)] focus:border-transparent outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="group">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[var(--primaryColor)] transition-colors"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primaryColor)] focus:border-transparent outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[var(--primaryColor)] transition-colors"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primaryColor)] focus:border-transparent outline-none resize-none transition-all duration-300"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--primaryColor)] text-white py-4 px-6 rounded-lg hover:shadow-md hover:shadow-[var(--primaryColor)]/10 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group mt-auto"
              >
                Send Message
                <Send
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
