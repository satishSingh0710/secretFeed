import axios from "axios";

export async function deleteFeedbackURL(urlId: string) {
  const response = await axios.put(`/api/feedback/deleteFeedbackURL?urlId=${urlId}`);
  return response.data; // Return response if needed
}
