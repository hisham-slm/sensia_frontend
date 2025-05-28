import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddUser() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [cookies] = useCookies()
  const accessToken = cookies.access_token;
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const requestData = { email, username };


    console.log(accessToken)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/superadmin/create_user/`,
        requestData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`, // 👈 Required for token auth
          },
        }
      );
      console.log(response)

      if (response.status === 201) {
        setMessage(`User created with useranme ${response.data.username}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label htmlFor="username" className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            id="username"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="username"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add User
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-600 font-semibold">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-semibold">{error}</p>
      )}
    </div>
  );
}
