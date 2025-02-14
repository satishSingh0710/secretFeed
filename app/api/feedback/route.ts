import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/models/feedback.models";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
export async function GET(request: NextRequest) {
  try {
    await dbConnect(); // Ensure database connection

    const {userId} = await auth();

    // Find feedback by `urlId`
    if(!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const feedback = await Feedback.findOne({ userId });

    if (!feedback) {
      return NextResponse.json({ message: "No feedback found", urlId: null }, { status: 404 });
    }

    console.log("Feedback found:", feedback);

    return NextResponse.json(
      {
        message: "Feedback retrieved successfully",
        urlId: feedback.urlId,
        isActive: feedback.isActive,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json({ message: "Error fetching feedback" }, { status: 500 });
  }
}
