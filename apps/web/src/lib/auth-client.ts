import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  plugins: [anonymousClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

/**
 * Link a guest account to a Google account.
 * This allows guest users to upgrade to a full account while
 * preserving their game progress and data.
 */
export const linkGuestToGoogle = async () => {
  return authClient.linkSocial({
    provider: "google",
    callbackURL: window.location.href,
  });
};

/**
 * Check if the current user is a guest (anonymous) user.
 */
export const isGuestUser = (user: { isAnonymous?: boolean } | null) => {
  return user?.isAnonymous === true;
};
