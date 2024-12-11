import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import git from "isomorphic-git";
import { Buffer } from "buffer";
import { useQuery } from "@tanstack/react-query";
import { FileTree } from "../components/file-tree";

declare global {
  interface Window {
    Buffer: typeof Buffer;
    fs: LightningFS;
    pfs: any;
  }
}

window.Buffer = Buffer;
window.fs = new LightningFS("fs");
window.pfs = window.fs.promises;

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

async function checkRepoExists(fs: LightningFS, dir: string): Promise<boolean> {
  try {
    const files = await fs.promises.readdir(dir);
    return files.length > 0;
  } catch (e) {
    return false;
  }
}

async function getDefaultBranch(fs: LightningFS, dir: string): Promise<string> {
  try {
    const refs = await git.listServerRefs({
      fs,
      http,
      url: "https://github.com/AnswerOverflow/AnswerOverflow",
      corsProxy: "https://cors.isomorphic-git.org",
      prefix: "refs/heads/",
    });

    // Look for main or master first
    const mainBranch = refs.find(
      (ref) => ref.ref === "refs/heads/main" || ref.ref === "refs/heads/master"
    );
    if (mainBranch) {
      return mainBranch.ref.replace("refs/heads/", "");
    }

    // If neither main nor master exists, use the first branch
    if (refs.length > 0) {
      return refs[0].ref.replace("refs/heads/", "");
    }

    throw new Error("No branches found");
  } catch (error) {
    console.error("Error getting default branch:", error);
    // Fallback to common branch names
    return "master";
  }
}

async function cloneIfStale(repoUrl: string): Promise<void> {
  const localPath = "/repo-answer";
  const fs = window.fs;

  try {
    const repoExists = await checkRepoExists(fs, localPath);

    if (repoExists) {
      try {
        const defaultBranch = await getDefaultBranch(fs, localPath);
        const [local, remote] = await Promise.all([
          git.resolveRef({ fs, dir: localPath, ref: defaultBranch }),
          git.resolveRef({
            fs,
            dir: localPath,
            ref: `origin/${defaultBranch}`,
          }),
        ]);

        if (local === remote) {
          console.log("Repository is up to date");
          return;
        }
      } catch (e) {
        console.log("Error checking refs, will re-clone:", e);
        await fs.promises.rmdir(localPath, { recursive: true });
      }
    }

    // Ensure the directory is empty before cloning
    try {
      await fs.promises.rmdir(localPath, { recursive: true });
    } catch (e) {
      // Directory might not exist, that's okay
    }

    // Get the default branch before cloning
    const defaultBranch = await getDefaultBranch(fs, localPath);
    console.log(`Using default branch: ${defaultBranch}`);

    // Clone the repository
    await git.clone({
      fs,
      http,
      dir: localPath,
      url: repoUrl,
      singleBranch: true,
      depth: 1,
      corsProxy: "https://cors.isomorphic-git.org",
      ref: defaultBranch,
    });
    console.log("Repository cloned successfully!");
  } catch (error) {
    console.error("Error managing repository:", error);
    throw error;
  }
}

function HomeComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const repoUrl = "https://github.com/AnswerOverflow/AnswerOverflow";
      await cloneIfStale(repoUrl);

      const defaultBranch = await getDefaultBranch(window.fs, "/repo-answer");
      const files = await git.listFiles({
        fs: window.fs,
        dir: "/repo-answer",
        ref: defaultBranch,
      });

      return files;
    },
    retry: 1,
  });

  if (error) {
    return <div>Error loading repository: {(error as Error).message}</div>;
  }

  return (
    <div className="p-2">
      {isLoading && <div>Loading...</div>}
      {data && <FileTree files={data} />}
    </div>
  );
}
