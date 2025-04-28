import axios from "axios";

export const Auth = {
  signup: async (fullName, email, id) => {
    try {
      const response = await axios.post(
        "/api/register",
        { fullName: fullName, email: email, id: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      throw (
        error.response?.data || {
          message: "An error occured while registration",
        }
      );
    }
  },
};
