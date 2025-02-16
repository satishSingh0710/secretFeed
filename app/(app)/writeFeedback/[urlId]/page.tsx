"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send} from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { userId } = useAuth(); // Get user ID from Clerk authentication

  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [message, setMessage] = useState("");

  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const urlId: string = params.urlId as string;
    const formData = new FormData();
    formData.append("feedback", feedback);
    formData.append("urlId", urlId);

    
    try {
      await axios.post(`/api/feedback`, formData);

      toast({
        title: "Success",
        description: "Feedback submitted successfully!",
        variant: "success",
      });

      setSubmitted(true); // Show thank-you page
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
      console.log("Error submitting feedback:", error); // Log error to console
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect after countdown
  useEffect(() => {
    if (submitted) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        router.push(userId ? "/" : "/sign-in");
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [submitted, userId, router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg text-center">
        {submitted ? (
          // Thank You Page
          <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your feedback has been received. You will be redirected in <strong>{countdown}</strong> seconds.
          </p>
          <p className="text-sm text-gray-500 animate-pulse">Redirecting...</p> {/* Simple animated loader */}
        </div>
        ) : (
          // Feedback Form
          <div>
         <h2 className="text-2xl font-bold text-gray-800 mb-3">Send an Anonymous Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                id="message"
                value={message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting || !message}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />} 
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
