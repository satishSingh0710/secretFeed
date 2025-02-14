"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ToggleLeft, ToggleRight, Trash2, Link } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import generateUserFeedbackID from '@/utils/generateUserFeedbackID';
import { toggleActiveState, deleteFeedbackURL } from '@/utils/feedbackApiHandlers/index';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const [feedbackURL, setFeedbackURL] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const {user}= useUser();

  useEffect(() => {
    // Generate the feedback URL when component mounts
    const generatedID = generateUserFeedbackID();
    setFeedbackURL(`feedback.yourdomain.com/${generatedID}`);
  }, []);

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(feedbackURL);
      setStatusMessage('URL copied to clipboard!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      setStatusMessage('Failed to copy URL. Please try copying manually.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleToggleActive = async () => {
    try {
      // await toggleActiveState(feedbackURL);
      setIsActive(!isActive);
      setStatusMessage(`Feedback URL ${isActive ? 'deactivated' : 'activated'} successfully`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      setStatusMessage('Failed to toggle active state');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      // await deleteFeedbackURL(feedbackURL);
      setStatusMessage('Feedback URL deleted successfully');
      // Generate new feedback URL after deletion
      const newID = generateUserFeedbackID();
      setFeedbackURL(`feedback.yourdomain.com/${newID}`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      setStatusMessage('Failed to delete feedback URL');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Feedback URL Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Message */}
            {statusMessage && (
              <Alert>
                <AlertDescription>{statusMessage}</AlertDescription>
              </Alert>
            )}

            {/* URL Display Card */}
            <div className="bg-white rounded-lg border p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 flex-grow min-w-0">
                <Link className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 truncate">
                  {feedbackURL}
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleCopyURL}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleToggleActive}
                  variant={isActive ? "default" : "secondary"}
                  className="flex-1 sm:flex-none"
                >
                  {isActive ? (
                    <ToggleRight className="h-4 w-4 mr-2" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 mr-2" />
                  )}
                  {isActive ? 'Active' : 'Inactive'}
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Status Information */}
            <Alert>
              <AlertDescription>
                {isActive
                  ? "Your feedback URL is currently active and accepting responses."
                  : "Your feedback URL is currently inactive and not accepting responses."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
