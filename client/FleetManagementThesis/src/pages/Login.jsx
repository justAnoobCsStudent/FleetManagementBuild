import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the server
      const response = await axios.post(`http://localhost:7000/api/v1/login`, {
        email,
        password,
      });

      const { token, role } = response.data.data;

      // Save token and role to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Login successful!", { position: "top-right" });

      // Redirect user based on their role
      if (role === "superadmin") {
        navigate("/dashboard"); // Superadmin has access to the same dashboard
      } else {
        navigate("/dashboard"); // Admin is redirected to the same dashboard
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Display server-provided error message
        toast.error(
          error.response.data.message ||
            "Login failed! Please check your credentials.",
          { position: "top-right" }
        );
      } else {
        console.error("Login error:", error);
        toast.error("An unexpected error occurred.", { position: "top-right" });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-8">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold mb-4">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
