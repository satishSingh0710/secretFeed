export const getUserFeedbackId = async (userId: string) => {
    try {
      const response = await fetch(`/api/feedback`)
      if (!response.ok) throw new Error('Failed to fetch feedback ID')
      return await response.json()
    } catch (error) {
      throw new Error('Error fetching feedback ID')
    }
  }