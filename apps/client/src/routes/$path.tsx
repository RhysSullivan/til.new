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
    <div className="flex flex-col mx-auto p-6 w-full rounded-xl w-full gap-4 max-h-[calc(100vh-100px)] overflow-y-auto ">
      <Editor
        key={contents.path}
        initialValue={contents.contents}
        onChange={() => {}}
      />
    </div>
  );
}
