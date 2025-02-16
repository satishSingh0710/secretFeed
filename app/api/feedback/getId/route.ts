import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/feedback.models";

export async function GET(){
    const { userId } = await auth();    
    if(!userId){
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    try{
        await dbConnect(); // Ensure database connection

        const feedback = await Feedback.findOne({userId: userId});

        if(!feedback){
            return NextResponse.json({message: "No feedback ID found", urlId: null}, {status: 404});
        }

        console.log("Feedback found:", feedback);

        return NextResponse.json(feedback, {status: 200});
    }catch(error: any){
        console.error("Error fetching feedback:", error);
        return NextResponse.json({message: "Error fetching feedback"}, {status: 500});
    }
}