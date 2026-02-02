import { createAuthClient } from "better-auth/react";
import { API_BASE } from "./api";

export const authClient = createAuthClient({
  baseURL: API_BASE,
});

export const { signIn, signUp, signOut, useSession } = authClient;

export const signUpEmail = signUp.email;
export const signInEmail = signIn.email;