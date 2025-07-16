'use client'

import Suggestions from "@/components/Suggestions";
import { TextEditor } from "@/components/text-editor/text-editor";
import { useState } from "react";

export default function CreatorPage() {
  const [content, setContent] = useState<string>("");

  console.log(content)
  return (
    <div className="relative h-full w-full">
      <TextEditor content={content} onChange={setContent} />
      <Suggestions content={content} />
    </div>
  )
}