import axios from 'axios';
import { QueryPlan } from "@/lib";

export async function postData<QueryPlan>(url: string, payload: any, username: string, password: string): Promise<QueryPlan> {
  try {
    const response = await axios.post<QueryPlan>(url, payload, {
      auth: {
        username,
        password,
      },
      headers: {
        "Content-Type": "application/json", // Json type
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}