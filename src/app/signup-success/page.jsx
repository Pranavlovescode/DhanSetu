"use client";
import { Auth } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function AfterSignup() {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const saveUser = async () => {
      if (isSignedIn && user) {
        setIsLoading(true);
        const response = await Auth.signup(
          user.fullName,
          user.primaryEmailAddress.emailAddress,
          user.id
        );
        if (response) {
          setIsLoading(false);
          console.log("api response", response);
          // router.push("/");
        }
      }
    };
    saveUser();
  }, [isSignedIn, user]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Wait Registration in Progress</h1>
      <Loader2 className="animate-spin h-10 w-10 mt-2" />
    </div>
  );
}

export default AfterSignup;
