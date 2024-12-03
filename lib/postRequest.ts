import { QueryPlan } from "@/lib";
import axios from "axios";

export async function postRequest(
  url: string,
  payload: { mdx: string },
  username: string,
  password: string,
): Promise<QueryPlan[]> {
  const response = await axios.post<QueryPlan[]>(url, payload, {
    auth: {
      username,
      password,
    },
    headers: {
      "Content-Type": "application/json", // Json type
    },
  });

  return response.data;
}
