import { httpAction, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

export const registerInstallation = httpAction(async (ctx, request) => {
  console.log("registerInstallation", request);
  return new Response(null, {
    status: 200,
  });
});

export const getReposForUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    const APP_ID = "1074737";
    
    // Decode and format the private key properly
    const privateKey = ``
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: APP_ID,
        privateKey: privateKey,
        type: "app",
      },
    });
    // First get the user's installation
    const installationResponse = await octokit.apps.getUserInstallation({
      username: "rhyssullivan",
    });

    // Create a new authenticated client for the installation
    const installationOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: parseInt(APP_ID, 10),
        privateKey: privateKey,
        installationId: installationResponse.data.id,
      },
    });

    // Now get the repositories using the installation-authenticated client
    const reposResponse =
      await installationOctokit.apps.listReposAccessibleToInstallation({
        per_page: 100,
      });

    return reposResponse.data.repositories;
  },
});
