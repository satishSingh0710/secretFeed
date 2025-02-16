import axios from "axios";

export const getUserFeedbacks = async () => {
  try {
    const response = await axios.get("/api/feedback");
    if (response.status != 200) throw new Error("Failed to fetch feedbacks");
    return response;
  } catch (error: any) {
    console.log("Error fetching feedbacks");
    throw new Error("Error fetching feedbacks");
  }
};
