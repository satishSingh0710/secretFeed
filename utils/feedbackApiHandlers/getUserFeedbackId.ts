import axios from "axios"
export const getUserFeedbackId = async () => {
    try {
      const response = await axios.get(`/api/feedback/getId`)
      if (response.status != 200) throw new Error('Failed to fetch feedback ID')
      return response.data; 
    } catch (error: any) {
      throw new Error('Error fetching feedback ID')
    }
  }