"use client";
import { Chatbot } from "@/components/Chatbot";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { UserAccountCreation } from "@/utils/apis/accountCreation";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

export default function Investments() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const [userAccount, setUserAccount] = useState(null);
  const fetchUserAccount = async () => {
    try {
      const response = await UserAccountCreation.getCurrentUserAccount(
        user?.id
      );
      if (response.status == 200) {
        console.log("user account found", response.data.user_account[0]);
        setUserAccount(response.data.user_account[0]);
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };
  useEffect(() => {
    fetchUserAccount();
  }, []);
  return (
    <>
      <div className="bg-black text-white min-h-screen">
        <div className="sticky top-0 z-10">
          <Navbar userAccount={userAccount} />
        </div>
        <div className="container md:max-w-6xl mx-auto pt-8">
          <div>This is Investment page</div>
        </div>
        {/* Floating Toggle Button */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="lg"
            className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-black hover:bg-gray-800 border border-gray-700 shadow-lg"
          >
            {isOpen ? (
              <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
            ) : (
              <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
            )}
          </Button>
        </div>
      </div>
      {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
      {/* <div className="bg-black">This is Investment</div> */}
    </>
  );
}
