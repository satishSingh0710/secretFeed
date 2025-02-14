import { auth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import Feedback from "@/models/feedback.models";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = await auth();

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await dbConnect();
    const { urlId } = req.query;
    const feedbackPost = await Feedback.findOneAndDelete({
      urlId,
    });

    if (!feedbackPost) {
      return res
        .status(404)
        .json({ message: "Couldn't delete the feedback url!" });
    }

    return NextResponse.json({ message: "Feedback url deleted!" , status: 200});
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Couldn't delete the feedback url!" });
  }
}
