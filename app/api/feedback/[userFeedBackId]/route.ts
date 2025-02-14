import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@clerk/nextjs/server";
import Feedback from "@/models/feedback.models";

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
//   const userId = await auth();
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
   
  try {
    await dbConnect();
    const { userFeedBackId } = req.query;
    const { feedback } = req.body;
    const feedbackData = {
      text: feedback,
    };
    const feedbackPost = await Feedback.findOne({
      urlId: userFeedBackId,
      isActive: true,
    });

    // users can't give feedback to themselves. 

    if (!feedbackPost) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedbackPost.feedbacks.push(feedbackData);
    const feedbackAddedToDb = await feedbackPost.save();
    if (!feedbackAddedToDb) {
      return res
        .status(500)
        .json({ message: "Can't post feedback right now. " });
    }
    return res.status(200).json({ message: "Feedback posted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Can't post feedback right now. " });
  }
}

export async function GET(
    req: NextApiRequest, 
    res: NextApiResponse){
  const { userId } = await auth(); 

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await dbConnect(); // Ensure DB connection
    const feedbacks = await Feedback.find({ userId });
    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedbacks found for this user" });
    }
    const allFeedbacks = feedbacks.flatMap(doc => doc.feedbacks);
    return res.status(200).json({ success: true, allFeedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return res.status(500).json({ message: "There was an error fetching feedbacks" });
  }
}
