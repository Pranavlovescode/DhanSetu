"use client";

import { UserAccountCreation } from "@/utils/apis/accountCreation";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  BellIcon,
  WalletIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
  CreditCardIcon,
  BarChart3Icon,
  UsersIcon,
  PieChartIcon,
  TrendingUpIcon,
  SettingsIcon,
  HelpCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { Transactions } from "@/utils/apis/transactions";
import Navbar from "@/components/Navbar";


function Dashboard() {
  const { user, isSignedIn } = useUser();
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "credit",
      description: "Salary Deposit",
      amount: 25000,
      date: "30 Apr 2025",
    },
    {
      id: 2,
      type: "debit",
      description: "Amazon Purchase",
      amount: 1299,
      date: "29 Apr 2025",
    },
    {
      id: 3,
      type: "debit",
      description: "Netflix Subscription",
      amount: 199,
      date: "28 Apr 2025",
    },
    {
      id: 4,
      type: "credit",
      description: "Refund",
      amount: 500,
      date: "27 Apr 2025",
    },
    {
      id: 5,
      type: "debit",
      description: "Restaurant Payment",
      amount: 799,
      date: "25 Apr 2025",
    },
  ]);

  const fetchUserTransactions = async () => {
    const response = await Transactions.getUserTransactions(user.id);
    console.log("The transaction reponse is,", response);
    setTransactions(response);
    setLoading(false)
  };

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserAccount();
      fetchUserTransactions();
    }
  }, [isSignedIn, user]);

  const fetchUserAccount = async () => {
    try {
      setLoading(true);
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

  // Format currency to Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let interval;

    if (progress < 100) {
      interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 1);
      }, 30); // Adjust the increment speed by changing 50ms
    }

    return () => clearInterval(interval);
  }, [progress]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold text-white">
            Loading your account...
          </h2>
          <Progress value={progress} className="w-60 mx-auto bg-zinc-700 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}      
      <div className="sticky top-0 z-10">
        <Navbar userAccount={userAccount}/>
      </div>
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-[1fr_280px]">
            <div className="space-y-8">
              {/* Balance Summary */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-black text-card-white overflow-hidden border border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle>Account Balance</CardTitle>
                    <CardDescription>
                      Your current available balance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-3xl font-bold">
                      {userAccount ? formatCurrency(userAccount.balance) : "₹0"}
                    </div>
                  </CardContent>
                  {/* <div className="h-2 bg-primary/20">
                    <div className="h-full bg-primary w-2/3"></div>
                  </div> */}
                </Card>
                <Card className={"bg-black text-card-white border-border/40"}>
                  <CardHeader className="pb-2">
                    <CardTitle>Monthly Spending</CardTitle>
                    <CardDescription>Your spending trend</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-3xl font-bold">₹15,245</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                        -12%
                      </Badge>
                      <span className="ml-1">from last month</span>
                    </p>
                  </CardContent>
                </Card>
                <Card className={"bg-black text-card-white border-border/40"}>
                  <CardHeader className="pb-2">
                    <CardTitle>Savings Goal</CardTitle>
                    <CardDescription>Travel fund progress</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-3xl font-bold">
                      65<span className="text-lg font-normal">%</span>
                    </div>
                    <Progress value={65} className="mt-3 bg-zinc-700" />
                    <p className="text-xs text-muted-foreground mt-2">
                      ₹32,500 of ₹50,000
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions */}
              <Card className={"bg-black text-card-white border-border/40"}>
                <CardHeader className="pb-4">
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest account activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="mb-4 grid grid-cols-3 w-full md:w-[360px] mx-auto">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="incoming">Incoming</TabsTrigger>
                        <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <ScrollArea className="h-[320px] px-1">
                          <div className="space-y-2">
                            {transactions.map((transaction) => (
                              <div
                                key={transaction.transaction_id}
                                className="flex items-center justify-between p-3 rounded-md hover:bg-white/20 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-full ${
                                      transaction.receiver === user.id
                                        ? "bg-emerald-500/10"
                                        : "bg-rose-500/10"
                                    }`}
                                  >
                                    {transaction.receiver === user.id ? (
                                      <ArrowRightIcon className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                      <ArrowLeftIcon className="h-4 w-4 text-rose-500" />
                                    )}
                                  </div>
                                  <div key={transaction.transaction_id}>
                                    <p className="text-sm font-medium">
                                      {transaction.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(
                                        transaction.timestamp
                                      ).toDateString()}
                                    </p>
                                  </div>
                                </div>
                                <p
                                  className={`font-medium ${
                                    transaction.receiver === user.id
                                      ? "text-emerald-500"
                                      : "text-rose-500"
                                  }`}
                                >
                                  {transaction.receiver === user.id ? "+" : "-"}
                                  {formatCurrency(transaction.amount)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="incoming">
                        <ScrollArea className="h-[320px] px-1">
                          <div className="space-y-2">
                            {transactions
                              .filter((t) => t.receiver === user.id)
                              .map((transaction) => (
                                <div
                                  key={transaction.transaction_id}
                                  className="flex items-center justify-between p-3 rounded-md hover:bg-white/20 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-emerald-500/10">
                                      <ArrowRightIcon className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        {transaction.description}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(
                                          transaction.timestamp
                                        ).toDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-emerald-500 font-medium">
                                    +{formatCurrency(transaction.amount)}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="outgoing">
                        <ScrollArea className="h-[320px] px-1">
                          <div className="space-y-2">
                            {transactions
                              .filter((t) => t.sender === user.id)
                              .map((transaction) => (
                                <div
                                  key={transaction.transaction_id}
                                  className="flex items-center justify-between p-3 rounded-md hover:bg-white/20 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-rose-500/10">
                                      <ArrowLeftIcon className="h-4 w-4 text-rose-500" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        {transaction.description}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(
                                          transaction.timestamp
                                        ).toDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-rose-500 font-medium">
                                    -{formatCurrency(transaction.amount)}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center">
                      No transaction made till now
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing 5 of 24 transactions
                  </p>
                  <Link href={"/transactions"}>
                    <Button
                      className="hover:bg-white/20 hover:text-white text-black"
                      variant={"secondary"}
                      size="sm"
                    >
                      View All Transactions
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <Card className={"bg-black text-black border-border/40"}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-center text-white">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex flex-col">
                  <Link href={"/transfer-money"} className="space-y-3">
                    <Button
                      className="w-full justify-start hover:bg-white/20 hover:text-white space-y"
                      variant="secondary"
                    >
                      <WalletIcon className="mr-2 h-4 w-4" /> Transfer Money
                    </Button>
                  </Link>
                  <Link href={"/add-fund"}>
                    <Button
                      className="w-full justify-start hover:bg-white/20 hover:text-white"
                      variant="secondary"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" /> Add Funds
                    </Button>
                  </Link>
                  <Link href={"/pay-bills"}>
                    <Button
                      className="w-full justify-start hover:bg-white/20 hover:text-white"
                      variant="secondary"
                    >
                      <CreditCardIcon className="mr-2 h-4 w-4" /> Pay Bills
                    </Button>
                  </Link>
                  <Link href={"/investments"}>
                    <Button
                      className="w-full justify-start hover:bg-white/20 hover:text-white"
                      variant="secondary"
                    >
                      <TrendingUpIcon className="mr-2 h-4 w-4" /> Investments
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className={"bg-black text-card-white border-border/40"}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-center">
                    Spending Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Shopping</p>
                      <p className="text-sm font-medium">₹4,800</p>
                    </div>
                    <Progress value={40} className="h-2 bg-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Food & Dining</p>
                      <p className="text-sm font-medium">₹3,600</p>
                    </div>
                    <Progress value={30} className="h-2 bg-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Entertainment</p>
                      <p className="text-sm font-medium">₹2,400</p>
                    </div>
                    <Progress value={20} className="h-2 bg-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Bills & Utilities</p>
                      <p className="text-sm font-medium">₹1,200</p>
                    </div>
                    <Progress value={10} className="h-2 bg-zinc-700" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                  <Button variant="ghost" size="sm" className="w-full">
                    <PieChartIcon className="mr-2 h-4 w-4" /> View Detailed
                    Report
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
