import { createFileRoute } from "@tanstack/react-router";
import { getFileContents as getFile } from "../lib/git";
import Editor from "../components/editor/advanced-editor";

export const Route = createFileRoute("/$path")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const file = await getFile(params.path);

    return {
      path: params.path,
      file,
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <div className="flex flex-col mx-auto p-6 w-full rounded-xl gap-4 max-h-[calc(100vh-100px)] overflow-y-auto ">
      <a
        href={data.file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600"
      >
        View on GitHub
      </a>

      <Editor
        key={data.path}
        initialValue={data.file.content}
        onChange={() => {}}
      />
    </div>
  );
}
