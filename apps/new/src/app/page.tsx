"use client";
import Editor from "@/components/editor/advanced-editor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { save } from "./actions";

export default function Home() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col p-6 border max-w-xl w-full gap-6 rounded-md bg-card">
        <Editor initialValue={value} onChange={setValue} />
        <Button
          disabled={!value}
          variant="outline"
          onClick={() => value && save(value)}
        >
          Save
        </Button>
      </div>
    </main>
  );
}
