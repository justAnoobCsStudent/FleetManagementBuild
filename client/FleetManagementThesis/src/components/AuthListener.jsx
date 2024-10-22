import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase"; // Import Firebase auth

const AuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Check token expiration
          const tokenResult = await user.getIdTokenResult();
          const isExpired = Date.now() >= tokenResult.expirationTime;

          if (isExpired) {
            // Token is expired, log out user
            auth.signOut();
            navigate("/"); // Redirect to login page
          }
        } catch (error) {
          console.error("Error checking token expiration:", error);
        }
      } else {
        // No user is signed in, redirect to login
        navigate("/");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  return null; // No UI is rendered by this component
};

export default AuthListener;
