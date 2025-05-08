"use client";

import { Loader2 } from "lucide-react";
import React, { useState ,useEffect} from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAccountCreation } from "@/utils/apis/accountCreation";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

function UserAccountRegistration() {
  const [panNumber, setPanNumber] = useState("");
  const [balance, setBalance] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { user, isSignedIn } = useUser();
  console.log(user);
  useEffect(() => {
    const saveUser = async () => {
      if (isSignedIn && user) {
        // setIsLoading(true);
        const response = await Auth.signup(
          user.fullName,
          user.primaryEmailAddress.emailAddress,
          user.id
        );
        if (response) {
          // setIsLoading(false);
          console.log("api response", response);
          // router.push("/");
        }
      }
    };
    saveUser();
  }, [isSignedIn, user]);

  const handleAccountCreation = async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const formdata = {
        panNumber,
        balance,
      };
      console.log("formdata", formdata);

      const response = await UserAccountCreation.createAccount(
        panNumber,
        balance
      );

      if (response.status == 201) {
        setIsLoading(false);
        alert(response.data.message);
        router.push("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Card className="w-[350px] border bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className={"text-white"}>Create Bank Account</CardTitle>
          <CardDescription>
            Create your new account in one-click.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAccountCreation}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label className={"text-white"} htmlFor="name">
                  PAN number
                </Label>
                <Input
                  className={"border border-zinc-800 text-white"}
                  id="name"
                  placeholder="PAN Number"
                  type={"text"}
                  onChange={(e) => {
                    setPanNumber(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5 w-full">
                <Label className={"text-white"} htmlFor="framework">
                  Amount to deposit
                </Label>
                <Input
                  className={"border border-zinc-800 text-white"}
                  placeholder="eg. 1000"
                  type={"number"}
                  onChange={(e) => {
                    setBalance(e.target.value);
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className={"bg-black border border-zinc-800 text-white"}
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button type="submit" disabled className={"bg-white text-black"}>
                <Loader2 className="animate-spin" />
                Create
              </Button>
            ) : (
              <Button type="submit" className={"bg-white text-black"}>
                Create
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default UserAccountRegistration;
