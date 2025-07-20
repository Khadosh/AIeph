'use server';

import Image from "next/image";
import { getUser } from "@/actions/auth";
import AuthDialog from "@/components/ui/auth-dialog";
import UserMenu from "@/components/ui/user-menu";
import LanguageToggler from "@/components/language-toggler";
import { getTranslations } from 'next-intl/server';

export default async function AppHeader() {
  const user = await getUser();
  const t = await getTranslations('auth.login');

  return (
    <header className="py-2 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-6xl">
        <div className="flex items-center gap-2">
          <Image src="/favicon.svg" alt="AIeph" width={32} height={32} />
          <h2 className="text-2xl font-bold">AIeph</h2>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggler />
          {
            user
              ? <UserMenu user={user} />
              : <AuthDialog mode="login" text={t('buttonText') || 'Login'} />
          }
        </div>
      </div>
    </header>
  )
}