import { SignIn } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 bg-white">
        <CardHeader className="text-center">
          <ShieldCheck className="w-10 h-10 mx-auto text-indigo-600" />
          <CardTitle className="text-xl font-semibold text-gray-800 mt-2">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </CardHeader>
        <CardContent>
          <SignIn />
        </CardContent>
      </Card>
    </div>
  );
}
