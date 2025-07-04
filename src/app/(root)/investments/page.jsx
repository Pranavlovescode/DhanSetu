"use client";
import { Chatbot } from "@/components/Chatbot";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  X,
  TrendingUp,
  DollarSign,
  Target,
  PieChart,
  Edit,
  Save,
  User,
  Briefcase,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { UserAccountCreation } from "@/utils/apis/accountCreation";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { RiskProfile } from "@/utils/apis/riskProfile";

export default function Investments() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const [userAccount, setUserAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [investmentProfile, setInvestmentProfile] = useState({
    riskTolerance: "moderate",
    investmentGoals: "retirement",
    timeHorizon: "10-15",
    monthlyInvestment: "5000",
    experience: "intermediate",
    preferredSectors: ["technology", "healthcare"],
    totalInvested: 125000,
    currentValue: 138750,
    returns: 11,
  });

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

  const fetchRiskProfile = async () => {
    try {
      console.log("Fetching risk profile for user:", user?.id);
      const response = await RiskProfile.getRiskProfile(user?.id);
      if (response.status == 200) {
        console.log("User risk profile found", response.data.riskProfile[0]);
        localStorage.setItem(
          "profile_id",
          response.data.riskProfile[0]?.profile_id
        );
        setInvestmentProfile({
          ...investmentProfile,
          riskTolerance: response.data.riskProfile[0].tolerance_level,
          investmentGoals: response.data.riskProfile[0].goal,
          timeHorizon: response.data.riskProfile[0].timeHorizon,
          monthlyInvestment:
            response.data.riskProfile[0].monthlyInvestmentAmount,
          experience: response.data.riskProfile[0].experience,
          preferredSectors: response.data.riskProfile[0].sector.map((s) =>
            s.toLowerCase()
          ),
          totalInvested:
            response.data.riskProfile[0].total_invested ||
            investmentProfile.totalInvested,
          currentValue:
            response.data.riskProfile[0].current_value ||
            investmentProfile.currentValue,
          returns:
            response.data.riskProfile[0].returns || investmentProfile.returns,
        });
      }
    } catch (error) {
      console.error("Error fetching risk profile:", error);
    }
  };

  useEffect(() => {
    fetchUserAccount();
    fetchRiskProfile();
  }, []);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log("Saving investment profile:", investmentProfile);
    if (localStorage.getItem("profile_id")) {
      const response = RiskProfile.updateRiskProfile(
        localStorage.getItem("profile_id"),
        {
          ...investmentProfile,
        }
      );
      console.log("Risk profile updated successfully", response);
      alert("Investment profile updated successfully!");
    } else {
      const response = RiskProfile.createRiskProfile(investmentProfile);
      console.log("Risk profile created successfully", response);
      alert("Investment profile saved successfully!");
    }
  };

  const riskColors = {
    conservative: "bg-green-600",
    moderate: "bg-yellow-600",
    aggressive: "bg-red-600",
  };

  return (
    <>
      <div className="bg-black text-white min-h-screen">
        <div className="sticky top-0 z-10">
          <Navbar userAccount={userAccount} />
        </div>

        <div className="container md:max-w-6xl mx-auto pt-8 px-4 pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Investment Profile</h1>
            <p className="text-gray-400">
              Manage your investment preferences and track your portfolio
            </p>
          </div>

          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-zinc-900 border-zinc-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-white">
                    Total Invested
                  </h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  ₹{investmentProfile.totalInvested.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Across all investments</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-white">
                    Current Value
                  </h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  ₹{investmentProfile.currentValue.toLocaleString()}
                </p>
                <p className="text-sm text-green-400">
                  +₹
                  {(
                    investmentProfile.currentValue -
                    investmentProfile.totalInvested
                  ).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <PieChart className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-white">Returns</h3>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  +{investmentProfile.returns}%
                </p>
                <p className="text-sm text-gray-400">Overall performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="profile" className="space-y-6 ">
            <TabsList className="bg-zinc-900 border-zinc-700 text-white">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Investment Profile
              </TabsTrigger>
              <TabsTrigger
                value="goals"
                className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-white"
              >
                <Target className="h-4 w-4 mr-2" />
                Goals & Strategy
              </TabsTrigger>
              <TabsTrigger
                value="risk"
                className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-white"
              >
                <Shield className="h-4 w-4 mr-2" />
                Risk Assessment
              </TabsTrigger>
            </TabsList>

            {/* Investment Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-zinc-900 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      Personal Investment Profile
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Update your investment preferences and goals
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() =>
                      isEditing ? handleSaveProfile() : setIsEditing(true)
                    }
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    {isEditing ? (
                      <Save className="h-4 w-4 mr-2" />
                    ) : (
                      <Edit className="h-4 w-4 mr-2" />
                    )}
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white">Risk Tolerance</Label>
                      <Select
                        value={investmentProfile.riskTolerance}
                        onValueChange={(value) =>
                          setInvestmentProfile({
                            ...investmentProfile,
                            riskTolerance: value,
                          })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-600">
                          <SelectItem
                            value="conservative"
                            className="text-white"
                          >
                            Conservative
                          </SelectItem>
                          <SelectItem value="moderate" className="text-white">
                            Moderate
                          </SelectItem>
                          <SelectItem value="aggressive" className="text-white">
                            Aggressive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">
                        Investment Experience
                      </Label>
                      <Select
                        value={investmentProfile.experience}
                        onValueChange={(value) =>
                          setInvestmentProfile({
                            ...investmentProfile,
                            experience: value,
                          })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-600">
                          <SelectItem value="beginner" className="text-white">
                            Beginner
                          </SelectItem>
                          <SelectItem
                            value="intermediate"
                            className="text-white"
                          >
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced" className="text-white">
                            Advanced
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Investment Goals</Label>
                      <Select
                        value={investmentProfile.investmentGoals}
                        onValueChange={(value) =>
                          setInvestmentProfile({
                            ...investmentProfile,
                            investmentGoals: value,
                          })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-600">
                          <SelectItem value="retirement" className="text-white">
                            Retirement Planning
                          </SelectItem>
                          <SelectItem value="wealth" className="text-white">
                            Wealth Building
                          </SelectItem>
                          <SelectItem value="income" className="text-white">
                            Regular Income
                          </SelectItem>
                          <SelectItem value="education" className="text-white">
                            Education Fund
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Time Horizon (Years)</Label>
                      <Select
                        value={investmentProfile.timeHorizon}
                        onValueChange={(value) =>
                          setInvestmentProfile({
                            ...investmentProfile,
                            timeHorizon: value,
                          })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-600">
                          <SelectItem value="1-3" className="text-white">
                            1-3 Years
                          </SelectItem>
                          <SelectItem value="3-5" className="text-white">
                            3-5 Years
                          </SelectItem>
                          <SelectItem value="5-10" className="text-white">
                            5-10 Years
                          </SelectItem>
                          <SelectItem value="10-15" className="text-white">
                            10-15 Years
                          </SelectItem>
                          <SelectItem value="15+" className="text-white">
                            15+ Years
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">
                        Monthly Investment Amount (₹)
                      </Label>
                      <Input
                        value={investmentProfile.monthlyInvestment}
                        onChange={(e) =>
                          setInvestmentProfile({
                            ...investmentProfile,
                            monthlyInvestment: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="bg-zinc-800 border-zinc-600 text-white"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">
                      Preferred Investment Sectors
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "technology",
                        "healthcare",
                        "finance",
                        "energy",
                        "consumer",
                        "real-estate",
                      ].map((sector) => (
                        <Badge
                          key={sector}
                          variant={
                            investmentProfile.preferredSectors.includes(sector)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer capitalize ${
                            investmentProfile.preferredSectors.includes(sector)
                              ? "bg-white text-black"
                              : "border-zinc-600 text-gray-400 hover:bg-zinc-800"
                          } ${
                            !isEditing ? "cursor-not-allowed opacity-50" : ""
                          }`}
                          onClick={() => {
                            if (!isEditing) return;
                            const sectors =
                              investmentProfile.preferredSectors.includes(
                                sector
                              )
                                ? investmentProfile.preferredSectors.filter(
                                    (s) => s !== sector
                                  )
                                : [
                                    ...investmentProfile.preferredSectors,
                                    sector,
                                  ];
                            setInvestmentProfile({
                              ...investmentProfile,
                              preferredSectors: sectors,
                            });
                          }}
                        >
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goals & Strategy Tab */}
            <TabsContent value="goals">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Investment Goals
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Track your progress towards financial goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Retirement Fund</span>
                        <span className="text-gray-400">65%</span>
                      </div>
                      <Progress value={65} className="bg-zinc-800" />
                      <p className="text-sm text-gray-400 mt-1">
                        ₹6,50,000 of ₹10,00,000
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Emergency Fund</span>
                        <span className="text-gray-400">80%</span>
                      </div>
                      <Progress value={80} className="bg-zinc-800" />
                      <p className="text-sm text-gray-400 mt-1">
                        ₹4,00,000 of ₹5,00,000
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Vacation Fund</span>
                        <span className="text-gray-400">40%</span>
                      </div>
                      <Progress value={40} className="bg-zinc-800" />
                      <p className="text-sm text-gray-400 mt-1">
                        ₹80,000 of ₹2,00,000
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Investment Strategy
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Based on your risk profile and goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            riskColors[investmentProfile.riskTolerance]
                          }`}
                        ></div>
                        <span className="text-white capitalize">
                          {investmentProfile.riskTolerance} Risk Portfolio
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Equity</span>
                          <span className="text-white">60%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Debt</span>
                          <span className="text-white">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Gold/Commodities
                          </span>
                          <span className="text-white">10%</span>
                        </div>
                      </div>

                      <Separator className="bg-zinc-700" />

                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                          Recommended Actions:
                        </p>
                        <ul className="text-sm text-white space-y-1">
                          <li>• Increase SIP by ₹2,000/month</li>
                          <li>• Rebalance portfolio quarterly</li>
                          <li>• Consider tax-saving investments</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Risk Assessment Tab */}
            <TabsContent value="risk">
              <Card className="bg-zinc-900 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                    Risk Assessment & Management
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Understand and manage your investment risks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Risk Factors
                      </h3>

                      <div className="space-y-3">
                        <div className="p-3 bg-zinc-800 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white">Market Risk</span>
                            <Badge
                              variant="outline"
                              className="border-yellow-600 text-yellow-400"
                            >
                              Medium
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            Portfolio volatility due to market fluctuations
                          </p>
                        </div>

                        <div className="p-3 bg-zinc-800 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white">
                              Concentration Risk
                            </span>
                            <Badge
                              variant="outline"
                              className="border-green-600 text-green-400"
                            >
                              Low
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            Well-diversified across sectors and asset classes
                          </p>
                        </div>

                        <div className="p-3 bg-zinc-800 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white">Liquidity Risk</span>
                            <Badge
                              variant="outline"
                              className="border-green-600 text-green-400"
                            >
                              Low
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            High liquidity investments with quick exit options
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Risk Mitigation
                      </h3>

                      <div className="space-y-3">
                        <div className="p-3 bg-zinc-800 rounded-lg">
                          <h4 className="text-white font-medium mb-2">
                            Diversification
                          </h4>
                          <p className="text-sm text-gray-400">
                            Spread investments across multiple asset classes and
                            sectors
                          </p>
                        </div>

                        <div className="p-3 bg-zinc-800 rounded-lg">
                          <h4 className="text-white font-medium mb-2">
                            Regular Review
                          </h4>
                          <p className="text-sm text-gray-400">
                            Monthly portfolio review and quarterly rebalancing
                          </p>
                        </div>

                        <div className="p-3 bg-zinc-800 rounded-lg">
                          <h4 className="text-white font-medium mb-2">
                            Stop Loss
                          </h4>
                          <p className="text-sm text-gray-400">
                            Automated stop-loss orders to limit downside risk
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Floating Toggle Button */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="lg"
            className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white hover:bg-gray-100 border border-gray-700 shadow-lg"
          >
            {isOpen ? (
              <X className="h-5 w-5 md:h-6 md:w-6 text-black" />
            ) : (
              <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-black" />
            )}
          </Button>
        </div>
      </div>
      {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
    </>
  );
}
