import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface FeedbackCardProps {
  text: string;
  createdAt: string;
}

export default function FeedbackCard({ text, createdAt }: FeedbackCardProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <MessageCircle className="text-indigo-600" size={20} />
        <CardTitle className="text-sm text-gray-700">{new Date(createdAt).toLocaleString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800">{text}</p>
      </CardContent>
    </Card>
  );
}
