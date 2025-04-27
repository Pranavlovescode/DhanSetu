"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { Auth } from "@/utils/api"; // Use alias path if configured

export default function Page() {
  const { user, isSignedIn } = useUser();
  
  useEffect(() => {
    // Only run this effect when the user is signed in and user data is available
    if (isSignedIn && user) {
      const registerUser = async () => {
        try {
          const response = await Auth.login(
            user.fullName,
            user.primaryEmailAddress.emailAddress
          );
          console.log("Registration response:", response);
        } catch (error) {
          console.error("Error registering user:", error);
        }
      };
      
      registerUser();
    }
  }, [isSignedIn, user]); // Include both dependencies
  
  return <SignUp />;
}
