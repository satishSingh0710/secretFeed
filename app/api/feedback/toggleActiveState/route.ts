import { auth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import Feedback from "@/models/feedback.models";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = await auth();

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await dbConnect(); // Ensure DB connection
    const { urlId } = req.query;
    const feedbacks = await Feedback.find({ urlId });
    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json({
        message: "No feedbacks found for this user",
        status: 200,
      });
    }
    return NextResponse.json({ feedbacks, status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      message: "Couldn't fetch feedbacks",
      status: 500,
    });
  }
}
