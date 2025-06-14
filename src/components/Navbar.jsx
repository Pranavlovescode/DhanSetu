"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { BellIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignOutButton, useUser } from "@clerk/nextjs";

export default function Navbar({userAccount}) {
  const { user, isSignedIn } = useUser();
  // Get the user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  }; 

  
  return (
    <div className="sticky">
      <header className="border-b border-border/40 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 top-0 z-10">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between py-4">
          <h1 className="text-2xl font-bold">DhanSetu</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="size-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName || "User"}
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {userAccount?.account_id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>
                  {/* <Button onClick={()=>signOut({redirectUrl:"/"})}>
                    Logout
                  </Button> */}
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
}
