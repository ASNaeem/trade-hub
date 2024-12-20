import { React, useState, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import axios from "axios";
function LoginPage({ from }) {
  const [CurrentPage, setCurrentPage] = useState("login");

  //#region Login Page

  const handle_login = async (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

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
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
              <ShoppingBag />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage("register");
              }}
              className="cursor-pointer text-blue-500 hover:underline"
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
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm select-none text-gray-600">
                Remember me
              </span>
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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

  const [otp, setOtp] = useState("");
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
      setStep(2); // Move to OTP verification step
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
    <div className="w-[350px] md:w-[448px] md:h-[428px] flex justify-center items-center bg-gray-50">
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("login");
                  }}
                  className="cursor-pointer text-blue-500 hover:underline"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  //#endregion

  return <div>{CurrentPage === "login" ? <Login /> : <Register />}</div>;
}

export default LoginPage;
