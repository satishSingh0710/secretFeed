import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Feedback from "@/models/feedback.models";

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect(); // Ensure database connection

    // Extract `urlId` from query parameters
    const urlId = req.nextUrl.searchParams.get("urlId");
    if (!urlId) {
      return NextResponse.json({ message: "Missing URL ID" }, { status: 400 });
    }

    console.log(`Creating feedback for user: ${userId}, URL ID: ${urlId}`);

    const checkUserFeedbackUrl = await Feedback.findOne({ userId });
    if (checkUserFeedbackUrl) {
      if (checkUserFeedbackUrl.urlId != null) {
        return NextResponse.json(
          { message: "Feedback URL already exists" },
          { status: 400 }
        );
      }
      checkUserFeedbackUrl.urlId = urlId;
      await checkUserFeedbackUrl.save();
    } else {
      const feedbackPost = await Feedback.create({
        urlId,
        userId,
        feedbacks: [],
        isActive: true,
      });

      console.log("Feedback created successfully:", feedbackPost);
    }

    // Create a new feedback entry in the database

    return NextResponse.json(
      { message: "Feedback URL generated successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { message: error.message || "Couldn't create feedback url" },
      { status: 500 }
    );
  }
}
