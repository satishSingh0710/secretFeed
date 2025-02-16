import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/feedback.models";

export async function PUT(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId } =await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect(); // Ensure database connection

    // Extract `urlId` from query parameters
    const urlId = req.nextUrl.searchParams.get("urlId");
    if (!urlId) {
      return NextResponse.json({ message: "Missing URL ID" }, { status: 400 });
    }

    console.log(`Deleting feedback for user: ${userId}, URL ID: ${urlId}`);

    // Find and delete the feedback entry
    const feedbackPost = await Feedback.findOne({ urlId });
    if (!feedbackPost) {
      return NextResponse.json({ message: "Feedback URL not found" }, { status: 404 });
    }
    feedbackPost.urlId = null;
    feedbackPost.feedbacks = [];
    await feedbackPost.save();

    console.log("Feedback deleted successfully:", feedbackPost);

    return NextResponse.json({ message: "Feedback URL deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json({ message: "Failed to delete feedback URL" }, { status: 500 });
  }
}
