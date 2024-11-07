import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { app } from "@/Firebase";
import { getAuth } from "firebase/auth";
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
