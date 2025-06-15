import axios from "axios";
export const AIChat = {
  getChat: async (user_id) => {
    try {
      const response = await axios.get("/api/ai-chat", {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          user: user_id,
        },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      throw error.response.data.message;
    }
  },
  sendMessage: async (message) => {
    try {
      const response = await axios.post(
        "/api/ai/chat",
        { prompt: message},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data.message;
    } catch (error) {
      throw error.response.data.message;
    }
  },
};