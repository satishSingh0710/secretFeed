import { nanoid } from "nanoid";

// Generates a unique ID users. 
export default function generateUserFeedbackID(){
    const id = nanoid();
    return id; 
}