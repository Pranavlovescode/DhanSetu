import axios from "axios";

export const UserAccountCreation = {
  createAccount: async (pan_number, balance) => {
    try {
      const response = await axios.post(
        "/api/user-accounts",
        { balance: balance, pan_number: pan_number },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response;
    } catch (error) {
      throw error.response.data.message;
    }
  },
};
