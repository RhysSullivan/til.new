import { createFileRoute } from "@tanstack/react-router";
import { getFileContents } from "../lib/git";
import Editor from "../components/editor/advanced-editor";

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

  return (
    <div className="flex flex-col p-6 border rounded-xl max-w-xl w-full gap-4 ">
      <Editor
        key={contents.path}
        initialValue={contents.contents}
        onChange={() => {}}
      />
    </div>
  );
}
