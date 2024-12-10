import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";

import axios from "axios";

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Registration Form, Step 2: OTP Verification

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      // Call backend to register and send OTP
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );
      alert(response.data.message);
      setStep(2); // Move to OTP verification step
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-otp",
        {
          email: formData.email,
          otp,
        }
      );
      alert(response.data.message); // Registration successful message
      // Redirect to login or dashboard
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {step === 1 ? (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 text-white flex justify-center items-center rounded-full">
                  <ShoppingBag />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Create your account
              </h2>
              <p className="text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Sign in
                </a>
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone Number"
                  pattern="^\+?\d{10,15}$"
                  title="Enter a valid phone number with 10-15 digits, optionally starting with '+'"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex justify-center items-center"
              >
                <i className="fas fa-user-plus mr-2"></i> Create Account
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
              <p className="text-gray-500">
                An OTP has been sent to <strong>{formData.email}</strong>.
                Please enter it below to verify your account.
              </p>
            </div>
            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Registration;
