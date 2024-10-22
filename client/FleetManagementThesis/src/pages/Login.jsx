import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { app } from "@/Firebase";
import { getAuth } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:7000/api/v1/login`, {
        email,
        password,
      });

      const user = getAuth(app).currentUser;
      const tokenId = user.accessToken;
      localStorage.setItem("token", tokenId);
      toast.success("Login successful!", { position: "top-right" });
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (error) {
      if (error.response && error.response.data) {
        // Display error message returned from the API
        console.log(error.response.data.message);
        toast.error(
          error.response.data.message ||
            "Login failed! Please check your credentials.",
          { position: "top-right" }
        );
      } else {
        console.log(error);
        toast.error("An unexpected error occurred.", { position: "top-right" });
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="email">
                E-mail
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
