import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Feedback from "@/models/feedback.models";

export async function POST(req: NextRequest, res: NextResponse) {
  const userId = await auth();

  try {
    await dbConnect();
    const urlId = new URL(req.url).searchParams.get("urlId");
    const body = await req.json();
    const { feedback } = body;
    const feedbackData = {
      text: feedback,
    };

    const feedbackPost = await Feedback.findOne({
      urlId,
      isActive: true,
    });


    if (!feedbackPost) {
      return NextResponse.json({ message: "Feedback not found", status: 404 });
    }

    if (feedbackPost.userId === userId) {
      return NextResponse.json({
        message: "You can't give feedback to yourself",
        status: 403,
      });
    }

    feedbackPost.feedbacks.push(feedbackData);
    const feedbackAddedToDb = await feedbackPost.save();
    if (!feedbackAddedToDb) {
      return NextResponse.json({
        message: "Can't post feedback right now. ",
        status: 500,
      });
    }
    return NextResponse.json({
      message: "Feedback posted successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Couldn't post feedback",
      status: 500,
    });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }

  try {
    await dbConnect(); // Ensure DB connection
    const feedbacks = await Feedback.find({ userId });
    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json({
        message: "No feedbacks found for this user",
        status: 404,
      });
    }
    const allFeedbacks = feedbacks.flatMap((doc) => doc.feedbacks);
    return NextResponse.json({ feedbacks: allFeedbacks, status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "Couldn't fetch feedbacks",
      status: 500,
    });
  }
}
