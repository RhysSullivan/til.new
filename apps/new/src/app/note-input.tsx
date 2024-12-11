import Editor from "@/components/editor/advanced-editor";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { save } from "./actions";
import { signIn, useIsAuthenticated } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function NoteInput() {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const isAuthenticated = useIsAuthenticated();
  const editor = useMemo(
    () => <Editor initialValue={value} onChange={setValue} />,
    [value]
  );
  return (
    <div className="flex flex-col p-6 border rounded-xl max-w-xl w-full gap-4 ">
      <Input
        placeholder="Title"
        className="border-none h-12 md:text-lg focus:border-none"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      {editor}
      <Separator />
      {isAuthenticated ? (
        <Button
          disabled={!value}
          variant="outline"
          onClick={() => value && title && save({ title: title, value: value })}
        >
          Save
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() =>
            signIn.social({
              provider: "github",
              callbackURL: "/",
            })
          }
        >
          Sign In to Save
        </Button>
      )}
    </div>
  );
}
