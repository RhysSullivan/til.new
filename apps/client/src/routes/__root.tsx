import * as React from "react";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { FileTree } from "../components/file-tree";
import { cloneIfStale, listFiles, repoUrl } from "../lib/git";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/about"
          activeProps={{
            className: "font-bold",
          }}
        >
          About
        </Link>
      </div>
      <hr />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
      <ReactQueryDevtools buttonPosition="top-right" />

      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

function Sidebar() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      await cloneIfStale(repoUrl);
      return await listFiles();
    },
    retry: 1,
  });
  if (error) {
    return <div>Error loading repository: {(error as Error).message}</div>;
  }

  return (
    <div className="p-2 w-64">
      {isLoading && <div>Loading...</div>}
      {data && <FileTree filters={[".md", ".mdx"]} files={data} />}
    </div>
  );
}
