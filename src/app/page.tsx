'use client'

import { Combine, Users, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import NextLink from "next/link"
import LoginDialog from "@/components/ui/login-dialog";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('homepage');

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-10 md:pt-24 md:pb-16 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-gradient-radial from-violet-600/20 to-transparent blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight tracking-tighter">
              {t('title')} <br />
              {t('subtitlePrefix')} <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">{t('copilot')}</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <LoginDialog>
                  <Button size="lg">{t('cta.primary')}</Button>
                </LoginDialog>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <NextLink href="#features">{t('cta.secondary')}</NextLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t('features.title')}</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              {t('features.subtitle')}
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-violet-900/50 text-violet-400 size-14 rounded-full flex items-center justify-center mb-4">
                <Combine className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t('features.contradictions.title')}</h3>
              <p className="text-muted-foreground">{t('features.contradictions.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-violet-900/50 text-violet-400 size-14 rounded-full flex items-center justify-center mb-4">
                <Users className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t('features.characters.title')}</h3>
              <p className="text-muted-foreground">{t('features.characters.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-violet-900/50 text-violet-400 size-14 rounded-full flex items-center justify-center mb-4">
                <History className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t('features.timeline.title')}</h3>
              <p className="text-muted-foreground">{t('features.timeline.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              &ldquo;{t('testimonial.quote')}&rdquo;
            </p>
            <div className="flex flex-col items-center justify-center">
              <div className="font-semibold text-foreground">{t('testimonial.author')}</div>
              <div className="text-sm text-muted-foreground">{t('testimonial.role')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter text-foreground md:text-4xl/tight">
              {t('finalCta.title')}
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('finalCta.description')}
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <LoginDialog>
              <Button size="lg" className="w-full">{t('finalCta.button')}</Button>
            </LoginDialog>
          </div>
        </div>
      </section>
    </main>
  );
}
