import { generateSummary } from "@/actions/ai";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';

export default function Resume({ content }: { content: string }) {
  const [summary, setSummary] = useState<string>("");
  const [generatingSummary, setGeneratingSummary] = useState<boolean>(false);
  const t = useTranslations('editor.summary');

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    const response = await generateSummary(content);
    setSummary(response);
    setGeneratingSummary(false);
  }

  return (
    <div className="p-4 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium">{t('label')}</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGenerateSummary}
          disabled={!content.trim() || generatingSummary}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {generatingSummary ? t('generating') : t('generate')}
        </Button>
      </div>
      <textarea
        value={summary}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full h-128 resize-none rounded-md border border-gray-300 p-2 text-sm"
      />
    </div>
  )
}