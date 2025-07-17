'use server';

import Image from "next/image";
import { getUser } from "@/actions/auth";
import LoginDialog from "@/components/ui/login-dialog";
import UserMenu from "@/components/ui/user-menu";
import LanguageToggler from "@/components/language-toggler";

export default async function AppHeader() {
  const user = await getUser();

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
              : <LoginDialog />
          }
        </div>
      </div>
    </header>
  )
}