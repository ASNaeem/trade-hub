import { React, useState, useRef } from "react";
import {
  ShoppingBag,
  BadgeCheck,
  CircleAlert,
  ChevronLeft,
} from "lucide-react";
import { InputOtp } from "@nextui-org/input-otp";
import axios from "axios";
function LoginPage({ from }) {
  const [CurrentPage, setCurrentPage] = useState("login");

  //#region Login Page

  const handle_login = async (e) => {
    e.preventDefault();
    try {
      // const email = e.target.email.value;
      // const password = e.target.password.value;

      // const response = await axios.post(
      //   "http://localhost:5000/api/users/login",
      //   {
      //     email,
      //     password,
      //   }
      // );

      // // Store the token in localStorage
      // localStorage.setItem("token", response.data.token);
      // localStorage.setItem("user", JSON.stringify(response.data.user));

      localStorage.setItem("loggedin", true);
      // Redirect based on 'from' prop
      from === "chats"
        ? (window.location.href = "/user?loggedin=true")
        : (window.location.href = "/user");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const Login = () => (
    <div className="w-[350px] md:w-[448px] md:h-[428px] flex items-center justify-center rounded-lg bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-[#396d9e] text-white flex items-center justify-center rounded-full">
              <ShoppingBag />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage("register");
              }}
              className="cursor-pointer text-[#69aeee] hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
        <form className="mt-6" onSubmit={handle_login}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-rgb(156 163 175)"
              />
              <span className="ml-2 cursor-pointer text-sm select-none text-gray-600">
                Remember me
              </span>
            </label>
            <a
              className="text-sm cursor-pointer text-[#69aeee] hover:underline"
              onClick={() => setCurrentPage("forgot_pass")}
            >
              Forgot your password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-[#396d9e] text-white py-2 rounded-lg hover:bg-[#2a5a86] flex justify-center items-center gap-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );

  //#endregion

  //#region Register Page

  const [formData, setFormData] = useState({});

  //#region
  const fullNameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  //#endregion

  const [step, setStep] = useState(1); // Step 1: Registration Form, Step 2: OTP Verification

  const handleInputChange = async (e) => {
    // const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneNumberRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // First register the user
      const registerResponse = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name: fullName,
          email,
          phone,
          password,
        }
      );

      // Store token for verification request
      const token = registerResponse.data.token;

      // Store email for OTP verification step
      setFormData({
        email,
        verificationToken: token,
      });
      setStep(1); // Move to OTP verification step
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/verify-email",
        {
          tokenValue: otp,
          email: formData.email,
        }
      );

      alert("Registration successful! Please login.");
      setCurrentPage("login");
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    }
  };

  const Register = () => (
    <div
      className={`${
        step == 1
          ? "w-[350px] md:w-[448px] md:h-[428px] flex justify-center items-center bg-white"
          : ""
      }`}
    >
      <div
        className={`bg-white rounded-lg ${
          step == 2 ? "" : " p-8 w-full max-w-md shadow-md"
        } `}
      >
        {step === 1 ? (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center items-center mb-4">
                <div className="w-10 h-10 bg-[#396d9e] text-white flex justify-center items-center rounded-full">
                  <ShoppingBag />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("login");
                  }}
                  className="cursor-pointer text-[#69aeee] hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  ref={fullNameRef}
                  type="text"
                  name="fullName"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  ref={phoneNumberRef}
                  type="tel"
                  name="phoneNumber"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Phone Number"
                  pattern="^\+?\d{10,15}$"
                  title="Enter a valid phone number with 10-15 digits, optionally starting with '+'"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  ref={confirmPasswordRef}
                  type="password"
                  name="confirmPassword"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#396d9e] text-white py-2 rounded-lg hover:bg-[#2a5a86] flex justify-center items-center gap-2"
              >
                <i className="fas fa-user-plus mr-2"></i> Create Account
              </button>
            </form>
          </>
        ) : (
          <VerifyOtp />
        )}
      </div>
    </div>
  );
  //#endregion

  //#region Verify OTP Page
  const [otp, setOtp] = useState("");

  const VerifyOtp = () => (
    <div className="bg-white w-[350px] md:w-[448px] md:h-[428px] rounded-lg flex flex-col justify-center items-center">
      <div className="text-center mb-6">
        <div className="flex justify-center items-center mb-4">
          <div className="w-10 h-10 bg-[#396d9e] text-white flex justify-center items-center rounded-full">
            <ShoppingBag />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">OTP Verification</h2>
        <p className="text-gray-500">
          An <strong>OTP</strong> has been sent please check your Email
        </p>
      </div>
      <form
        className="w-[350px] md:w-[400px] flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3 pb-5">
          <h1 className="text-center font-semibold">Enter OTP</h1>
          <InputOtp
            length={4}
            value={otp}
            onValueChange={setOtp}
            className="focus:ring-2 focus:ring-black focus:border-black"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="w-full select-none bg-[#396d9e] text-white py-2 rounded-lg hover:bg-[#2a5a86] flex justify-center items-center gap-2"
        >
          <BadgeCheck />
          Verify OTP
        </button>
      </form>
    </div>
  );
  //#endregion

  //#region Forgot Password Page
  const ForgotPassword = () => (
    <div className="w-[300px] md:w-[448px] md:h-[380px] select-none flex items-center justify-center rounded-lg bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-[#396d9e] text-white flex items-center justify-center rounded-full">
              <CircleAlert />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Forgot password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your Email and we'll send you an OTP to reset your password
          </p>
        </div>
        <form className="mt-6" onSubmit={() => setCurrentPage("otp")}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#396d9e] text-white py-2 rounded-lg hover:bg-[#2a5a86] flex justify-center items-center gap-2"
          >
            Submit
          </button>

          <button
            className="w-full flex items-center justify-center gap-[3px] px-4 py-5 text-sm text-gray-500 hover:gap-2 transition-all"
            onClick={() => setCurrentPage("login")}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
  //#endregion

  //#region Reset Password Page
  const ResetPassword = () => (
    <div className="w-[300px] md:w-[448px] md:h-[380px] flex items-center justify-center rounded-lg bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
              <CircleAlert />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Reset password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your new password</p>
        </div>
        <form className="mt-6" onSubmit={() => setCurrentPage("login")}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
  //#endregion

  return (
    <div>
      {CurrentPage === "login" && <Login />}
      {CurrentPage === "register" && <Register />}
      {CurrentPage === "forgot_pass" && <ForgotPassword />}
      {CurrentPage === "otp" && <VerifyOtp />}
      {CurrentPage === "reset_pass" && <ResetPassword />}
    </div>
  );
}

export default LoginPage;
