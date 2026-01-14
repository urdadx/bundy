import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  plugins: [anonymousClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;


export const isGuestUser = (user: { isAnonymous?: boolean | null } | null) => {
  return user?.isAnonymous === true;
};
