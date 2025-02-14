import axios from "axios";
export async function toggleActiveState(urlId: string){
    const response = await axios.put(`/api/feedback/toggleActiveState?urlId=${urlId}`);
    console.log(response); // Log response if needed
    return response.data;
}