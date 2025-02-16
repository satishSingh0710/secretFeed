import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/models/feedback.models";
import dbConnect from "@/lib/dbConnect";
// import { useSearchParams } from 'next/navigation'

// In Next.js 15, we need to define the route parameters in the function signature
export async function PUT(
  req: NextRequest
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect(); // Ensure DB connection
    console.log(req);
    const urlId = new URL(req.url).searchParams.get("urlId")
    console.log(urlId); // Log urlId if needed
    const feedbackPost = await Feedback.findOne({urlId}); // Find feedback by urlId

    if (!feedbackPost) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      );
    }

    // Check if the feedback belongs to the authenticated user
    if (feedbackPost.userId !== userId) {
      return NextResponse.json(
        { message: "Not authorized to modify this feedback" },
        { status: 403 }
      );
    }

    feedbackPost.isActive = !feedbackPost.isActive;
    const feedbackUpdated = await feedbackPost.save();

    if (!feedbackUpdated) {
      return NextResponse.json(
        { message: "Failed to update feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Feedback updated successfully",
        isActive: feedbackPost.isActive
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { message: "Failed to toggle feedback state"},
      { status: 500 }
    );
  }
}
