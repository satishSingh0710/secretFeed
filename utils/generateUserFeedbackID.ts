import { nanoid } from "nanoid";
import axios from "axios";
// Generates a unique ID users. 
export default async function generateUserFeedbackID(userId: string){
    const urlId = nanoid();
    console.log(`User ${userId} generated feedback ID: ${urlId}`);
    await axios.post(`/api/feedback/generateUrl?urlId=${urlId}`, { userId }); 
    return urlId;  
}