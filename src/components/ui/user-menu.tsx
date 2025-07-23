import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User, LogOut, PenTool } from 'lucide-react';
import { logout } from "@/actions/auth";
import { useTranslations } from 'next-intl';
import Link from "next/link";



export default function UserMenu({ user }: { user: SupabaseUser }) {
  const t = useTranslations('app.dashboard.novels.actions')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="ml-4 border-1 border-gray-400">
          <AvatarImage src={user.user_metadata.avatar_url} />
          <AvatarFallback ><User /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/creator">
            <PenTool className="w-4 h-4" />
            {t('creatorStudio')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="w-4 h-4" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}   