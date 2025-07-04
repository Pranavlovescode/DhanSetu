import axios from "axios";

export const RiskProfile = {
  createRiskProfile: async (body) => {
    try {
      const response = await axios.post(`/api/risk-profile`, body, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials:true
      });
      return response;
    } catch (error) {
      throw error.response.data.message;
    }
  },
  getRiskProfile:async(userId)=>{
    try {
      const response = await axios.get(`/api/risk-profile`,{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true,
        params:{
          userId:userId
        }
      })
      return response
    } catch (error) {
      throw error.response.data.message
    }
  },
  updateRiskProfile:async(profile_id,riskProfile)=>{
    try {
      const response = await axios.patch(`/api/risk-profile`, riskProfile, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        params: {
          profile_id: profile_id
        }
      });
      return response;
    } catch (error) {
      throw error.response.data.message
    }
  },
  getAiRecommendation:async(riskProfile)=>{
    try {
      console.log(riskProfile)
      const response = await axios.post(`/api/ai/recommendation`,riskProfile,{
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      throw error.response.data.message
    }
  }
};
