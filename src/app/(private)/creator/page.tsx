'use client'

import Suggestions from "@/components/suggestions";
import { TextEditor } from "@/components/text-editor/text-editor";
import { useState } from "react";

export default function CreatorPage() {
  const [content, setContent] = useState<string>("");

  return (
    <div className="w-full h-full flex flex-row">
      <div className="hidden lg:block w-1/4 border-b h-[44px] border-gray-100" />
      <div className="w-full w-2/3 lg:w-1/2">
        <TextEditor content={content} onChange={setContent} />
      </div>
      <div className="w-full lg:w-1/4">
        <Suggestions content={content} />
      </div>
    </div>
  )
}