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
};
