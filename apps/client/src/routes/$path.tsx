import { createFileRoute } from "@tanstack/react-router";
import { getFileContents } from "../lib/git";

export const Route = createFileRoute("/$path")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const fileContents = await getFileContents(params.path);

    return {
      path: params.path,
      contents: fileContents,
    };
  },
});

function RouteComponent() {
  const contents = Route.useLoaderData();

  return <div>{contents.contents}</div>;
}
