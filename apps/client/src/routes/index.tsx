import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import git from "isomorphic-git";
import { Buffer } from "buffer";

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

function HomeComponent() {
  return (
    <div className="p-2">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={async () => {
          await git.clone({
            fs: window.fs,
            http,
            dir: "/repo",
            corsProxy: "https://cors.isomorphic-git.org",
            url: "https://github.com/RhysSullivan/til",
            singleBranch: true,
            depth: 1, // Set to 1 for a shallow clone if you only need the latest version
          });
          console.log("Cloned");

          // Get list of all files in the git repository
          const files = await git.listFiles({
            fs: window.fs,
            dir: "/repo",
            ref: "HEAD",
          });
          console.log(files);
        }}
      >
        Clone
      </button>
    </div>
  );
}
