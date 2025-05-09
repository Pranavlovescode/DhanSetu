"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { currentUser, useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function TransferMoney() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const [desc,setDesc] = useState("")

  const { user } = useUser();
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setCurrentUserData(user);
        console.log("current user", user);
        const response = await axios.get("/api/user-accounts/all");
        if (response.data.users) {
          console.log(response.data.users);
          // Filter out current user from the list
          const filteredUsers = response.data.users.filter(
            (current_user) =>
              current_user.users.id !== user?.id &&
              current_user.user_bank_accounts?.account_id
          );
          setUsers(filteredUsers);
          setFilteredUsers(filteredUsers);
          // toast("User fetched successfully");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, [currentUserData?.id, toast]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.users.full_name.toLowerCase().includes(query.toLowerCase()) ||
        user.users.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  // Select user for transfer
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsSearchOpen(false);
  };

  // Handle transfer
  const handleTransfer = async () => {
    if (!selectedUser || !amount || amount <= 0) {
      toast("Please select a user and enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `/api/transactions?senderId=${currentUserData.id}&receiverId=${selectedUser.users.id}`,
        { amount: parseInt(amount) ,desc:desc}
      );

      if (response.status==201) {        
        toast("Money transferred successfully!");
      }

      // Reset form
      setSelectedUser(null);
      setAmount("");

      // Redirect to dashboard or stay on page
      // router.push('/dashboard');
    } catch (error) {
      console.error("Transaction error:", error);
      toast(
        error.response?.data?.message ||
          "An error occurred during the transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transfer Money</CardTitle>
          <CardDescription>Send money to another Dhansetu user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User search */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <div className="relative">
              <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    {selectedUser
                      ? selectedUser.users.full_name
                      : "Search for a user"}
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Search Users</DialogTitle>
                    <DialogDescription>
                      Find a user to transfer money to
                    </DialogDescription>
                  </DialogHeader>

                  <Command>
                    <CommandInput
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onValueChange={handleSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No users found</CommandEmpty>
                      <CommandGroup>
                        {filteredUsers.map((user) => (
                          <CommandItem
                            key={user.users.id}
                            onSelect={() => handleSelectUser(user)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback>
                                  {user.users.full_name
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {user.users.full_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {user.users.email}
                                </p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Display selected user */}
          {selectedUser && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedUser.users.full_name
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedUser.users.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedUser.users.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                  >
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
            />
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="amount">Description</Label>
            <Input
              id="desc"
              type="text"
              placeholder="Enter Description for transaction"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!selectedUser || !amount || loading}
          >
            {loading ? "Processing..." : "Transfer Money"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
