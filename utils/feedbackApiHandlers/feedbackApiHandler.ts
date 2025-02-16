export const getUserFeedbackId = async (userId: string) => {
    try {
      const response = await fetch(`/api/feedback?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch feedback ID')
      return await response.json()
    } catch (error: any) {
      throw new Error('Error fetching feedback ID')
    }
  }