"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ToggleLeft, ToggleRight, Trash2, Link, Plus, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import generateUserFeedbackID from '@/utils/generateUserFeedbackID'
import { getUserFeedbackId } from '@/utils/feedbackApiHandlers/getUserFeedbackId'
import { toggleActiveState } from '@/utils/feedbackApiHandlers/toggleActiveState'
import { deleteFeedbackURL } from '@/utils/feedbackApiHandlers/deleteFeedbackURL'
import { useUser } from '@clerk/nextjs'
import { useToast } from "@/hooks/use-toast"
import FeedbackCard from '@/components/FeedbackCard/page'
import { Skeleton } from "@/components/ui/skeleton";
import axios from 'axios'
import { useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"


export default function FeedbackDashboard() {
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()
  const [urlId, setUrlId] = useState<string | null>(null)
  const [isActive, toggleActive] = useState<boolean>(true)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isCopying, setIsCopying] = useState<boolean>(false)
  const [isToggling, setIsToggling] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [feedbacks, setFeedbacks] = useState<{ text: string; createdAt: string }[]>([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      router.push("/sign-in")
    }
    const fetchFeedbacks = async () => {
      try {
        setFeedbacksLoading(true)
        const response = await axios.get("/api/feedback");
        setFeedbacks(response.data);
      } catch (error: any) {
        console.error("Error fetching feedbacks:", error);
        setFeedbacks([]);
      } finally {
        setFeedbacksLoading(false);
      }
    };
    fetchFeedbacks();
  }, [urlId]);

  useEffect(() => {
    const fetchUserFeedbackId = async () => {
      if (user?.id) {
        try {
          const data = await getUserFeedbackId()
          if (!data) throw new Error('Generate your feedback ID first...');
          setUrlId(data.urlId);
          toggleActive(data.isActive);
        } catch (error: any) {
          console.error("Error fetching feedback URL:", error)
          toast({
            title: "Error",
            description: "Failed to fetch feedback URL",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUserFeedbackId()
  }, [user?.id, setUrlId, isDeleting])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const handleGenerateURL = async () => {
    try {
      setIsGenerating(true)
      const newId = await generateUserFeedbackID(user!.id) // Update this to save to DB
      setUrlId(newId)
      toast({
        title: "Success!",
        description: "New feedback URL generated!",
        variant: "success",
      })
    } catch (err: any) {
      console.error("Error generating URL:", err)
      toast({
        title: "Error",
        description: "Failed to generate URL",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyURL = async () => {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(
        `https://secret-feed.vercel.app/writeFeedback/${urlId}`
      )
      toast({
        title: "Copied!",
        description: "URL copied to clipboard!",
        variant: "success",
      })
    } catch (err: any) {
      console.error("Error copying URL:", err)
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      })
    } finally {
      setIsCopying(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      setIsToggling(true)
      toggleActive(!isActive)
      await toggleActiveState(urlId!)
      toast({
        title: "Status Updated",
        description: `Feedback URL ${!isActive ? 'activated' : 'deactivated'}`,
        variant: "success",
      })
    } catch (err: any) {
      console.error("Error toggling URL:", err)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteFeedbackURL(urlId!)
      toast({
        title: "Deleted!",
        description: "Feedback URL removed",
        variant: "destructive",
      })
    } catch (err: any) {
      console.error("Error deleting URL:", err)
      toast({
        title: "Error",
        description: "Failed to delete URL",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (

    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {user?.id && (
        <div className="absolute top-4 right-4">
          <UserButton />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Feedback URL Manager
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {!urlId ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Alert className="mb-6">
                  <AlertDescription>
                    Generate a feedback URL to start collecting responses
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleGenerateURL}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Create URL'}
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg border p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2 flex-grow min-w-0">
                    <Link className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 truncate">{urlId}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      onClick={handleCopyURL}
                      variant="outline"
                      disabled={isCopying}
                      className="flex-1 sm:flex-none"
                    >
                      {isCopying ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy
                    </Button>

                    <Button
                      onClick={handleToggleActive}
                      className={`flex-1 sm:flex-none text-white ${isActive
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                        }`}
                      disabled={isToggling}
                    >
                      {isToggling ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : isActive ? (
                        <ToggleRight className="h-4 w-4 mr-2" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 mr-2" />
                      )}
                      {isActive ? 'Active' : 'Inactive'}
                    </Button>

                    <Button
                      onClick={handleDelete}
                      variant="destructive"
                      disabled={isDeleting}
                      className="flex-1 sm:flex-none"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    {isActive
                      ? "This URL is active and accepting feedback"
                      : "This URL is inactive and not accepting feedback"}
                  </AlertDescription>
                </Alert>
              </>
            )}
            <div className="mt-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Feedbacks</h2>

              {urlId && feedbacksLoading ? (
                // Show skeletons while loading
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : feedbacks.length > 0 ? (
                // Show feedbacks
                <div className="space-y-4">
                  {feedbacks.map((feedback, index) => (
                    <FeedbackCard key={index} text={feedback.text} createdAt={feedback.createdAt} />
                  ))}
                </div>
              ) : (
                // Show message if no feedbacks
                <p className="text-gray-500">No feedbacks yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}