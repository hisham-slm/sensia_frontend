import axios from "axios";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export default function BasicExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [cookies, setCookies] = useCookies(['access_token'])
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup
    }
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    const requestData = {
      email,
      password,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}superadmin/login/`, requestData);
      if (response.status === 200) {
        const data = response.data;
        console.log(data)
        const accessToken = data.access
        if (data.access) {
          setCookies("access_token", accessToken, {
            path: "/",
            secure: false,
            sameSite: "lax",
          });
        }
        window.location.href = "/admin/home";
      }

    } catch (error) {
      console.log({ error })
      if (error.response) {
        console.error("Server error:", error.response.data);
        setErrorMessage("Server Error")
      } else if (error.request) {
        console.error("No response received:", error.request);
        setErrorMessage("No response received from the server")
      } else {
        console.error("Error:", error.message);
        setErrorMessage("Something Went Wrong")
      }
    }
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="max-w-full h-auto"
            alt="Sample image"
          />
        </div>

        {/* Right column with form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                  Admin Log In
                </h2>
              </div>

              {/* Email input */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-black 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-black 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Log In
                  </button>
                </div>
              </form>
              {errorMessage && (
                <div className="border-2 text-center bg-white border-black-50 rounded-md p-2 text-red-800">
                  {errorMessage}
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="#!"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Register here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
