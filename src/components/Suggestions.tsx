'use client'

import { generateFeedback } from "@/actions/ai";

import { useState } from "react";
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
    <div className="absolute bottom-0 top-0 right-0 w-1/4 z-10 bg-gray-100">
      <div className="h-[44px] flex flex-row items-center justify-center border-b">
        <Button onClick={handleGenerate} disabled={isLoading} size="sm">
          {isLoading 
            ? <Loader2 className="w-4 h-4 animate-spin" /> 
            : "Analizar texto"}
        </Button>
      </div>

      <div className="p-4 text-sm text-gray-500 h-full overflow-y-auto">
        {isLoading && "Estamos analizando tu texto, puede que tarde un poco..."}
        {response}
      </div>
    </div>
  )
}