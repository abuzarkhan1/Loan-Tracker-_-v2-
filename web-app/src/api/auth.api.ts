import { apiClient, unwrap } from "./axios";
import { AuthPayload, User } from "../types";

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    unwrap<AuthPayload>(apiClient.post("/auth/login", payload)),
  
  register: (payload: { name: string; email: string; password: string }) =>
    unwrap<AuthPayload>(apiClient.post("/auth/register", payload)),
  
  me: () => unwrap<User>(apiClient.get("/auth/me")),
  
  updateMe: (payload: Partial<Pick<User, "name" | "email">>) =>
    unwrap<User>(apiClient.patch("/auth/me", payload)),
};
