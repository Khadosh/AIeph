"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { updateUserMetadata } from "@/actions/user";

interface LanguageDropdownProps {
  initialLocale: string;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
];

export function LanguageDropdown({ initialLocale }: LanguageDropdownProps) {
  const [locale, setLocale] = useState(initialLocale);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale) return;
    
    setLocale(newLocale);
    
    startTransition(async () => {
      await updateUserMetadata({ locale: newLocale });
      router.refresh();
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative" disabled={isPending}>
          <Globe className={`h-[1.2rem] w-[1.2rem] ${isPending ? 'animate-spin' : ''}`} />
          <span className="sr-only">Cambiar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={5}>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${language.code === locale ? 'bg-accent' : ''}`}
            disabled={isPending}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
            {language.code === locale && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}