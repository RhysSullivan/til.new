import GitHub from "@auth/core/providers/github";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import {
  query,
} from './_generated/server'
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub],
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});