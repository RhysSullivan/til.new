"use client";
import Editor from "@/components/editor/advanced-editor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { save } from "./actions";
import { signIn, useIsAuthenticated } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const isAuthenticated = useIsAuthenticated();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col p-6 border rounded-xl max-w-xl w-full gap-6 ">
        <Input
          placeholder="Title"
          className="border-none h-12 md:text-lg focus:border-none"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <Separator />
        <Editor initialValue={value} onChange={setValue} />
        {isAuthenticated ? (
          <Button
            disabled={!value}
            variant="outline"
            onClick={() =>
              value && title && save({ title: title, value: value })
            }
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
    </main>
  );
}
