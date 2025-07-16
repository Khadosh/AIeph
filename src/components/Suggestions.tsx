'use client'

import { useState } from "react";
import ReactMarkdown from 'react-markdown';

import { generateFeedback } from "@/actions/ai";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function Suggestions({ content }: { content: string }) {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    const response = await generateFeedback(content, "analisis_profundo");
    setIsLoading(false);
    if (response) {
      setResponse(response);
    }
  }

  return (
    <div className="w-full h-full bg-gray-100">
      <div className="h-[44px] flex flex-row items-center justify-center border-b">
        <Button onClick={handleGenerate} disabled={isLoading} size="sm">
          {isLoading 
            ? <Loader2 className="w-4 h-4 animate-spin" /> 
            : "Analizar texto"}
        </Button>
      </div>

      <div className="p-4 text-sm text-gray-500 h-full overflow-y-auto pb-20">
        {isLoading && "Estamos analizando tu texto, puede que tarde un poco..."}
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    </div>
  )
}