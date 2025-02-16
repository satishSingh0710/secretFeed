import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const FeedbackSchema = new mongoose.Schema({
  urlId: { type: String, unique: true },
  userId: { type: String, required: true , unique: true}, // Storing Clerk user ID
  feedbacks: [
    {
      text: { type: String },
      createdAt: { type: Date, default: Date.now, index: { expires: "24h" } },// TTL index
    }
  ],
  isActive: { type: Boolean, default: true, required: true},
});

export default mongoose.models?.Feedback || mongoose.model("Feedback", FeedbackSchema);
