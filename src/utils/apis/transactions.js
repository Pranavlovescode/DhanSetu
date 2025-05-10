import axios from "axios";

export const Transactions = {
  getUserTransactions: async (senderId) => {
    try {
      const response = await axios.get("/api/transactions", {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          senderId: senderId,
        },
        withCredentials: true,
      });
      if (response.status == 200) {
        return response.data;
      } else {
        throw (
          error.response?.data || "Something went wrong while fetching the data"
        );
      }
    } catch (error) {
      console.log(error);
      throw (
        error.response?.data || "Something went wrong while fetching the data"
      );
    }
  },
};
