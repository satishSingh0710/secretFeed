import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/models/feedback.models";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await dbConnect(); // Ensure database connection

    const { userId } = await auth();

    // Find feedback by `urlId`
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const feedback = await Feedback.findOne({ userId: userId });

    if (!feedback) {
      return NextResponse.json(
        { message: "No feedback found", urlId: null },
        { status: 404 }
      );
    }

    console.log("Feedback found:", feedback);

    return NextResponse.json(feedback, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { message: "Error fetching feedback" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  console.log("User ID:", userId);
  try {
    console.log("You are trying to submit a feedback!!!")
    await dbConnect();
    const formData = await request?.formData();
    const feedback = formData.get("feedback") as string;
    const urlId = formData.get("urlId") as string;

    console.log("Feedback:", feedback);
    console.log("URL ID:", urlId);

    const userFeedback = await Feedback.findOne({ urlId, isActive: true });

    if (!userFeedback) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      );
    }

    if (userFeedback.userId === userId) {
      return NextResponse.json(
        { message: "You can't give feedback to yourself" },
        { status: 403 }
      );
    }

    userFeedback.feedbacks.push({ text: feedback });
    const feedbackAdded = await userFeedback.save();
    if (!feedbackAdded) {
      return NextResponse.json(
        { message: "Can't post feedback right now" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Feedback posted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error posting feedback:", error);
    return NextResponse.json(
      { message: "Couldn't post feedback" },
      { status: 500 }
    );
  }
}
