import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  urlId: { type: String, unique: true, required: true },
  userId: { type: String, required: true }, // Storing Clerk user ID
  feedbacks: [
    {
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now, index: { expires: "24h" } }, // TTL index
    }
  ],
  isActive: { type: Boolean, default: true },
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
