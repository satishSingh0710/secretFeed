import axios from "axios";
export async function toggleActiveState(urlId: string){
    const response = await axios.get(`/api/feedback/toggleActiveState?urlId=${urlId}`);
    return response.data;
}