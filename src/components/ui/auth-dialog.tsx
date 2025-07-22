'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/login-form"
import TextLogo from "@/components/ui/text-log"
import { useMemo, useState } from "react"
import { CreateAccountForm } from "../create-account-form"

type AuthMode = 'login' | 'signup'
type AuthDialogProps = {
  children?: React.ReactNode
  text?: string
  mode: AuthMode
}

export default function AuthDialog({ children, mode, text }: AuthDialogProps) {
  const [currentMode, setCurrentMode] = useState<AuthMode>(mode)
  const AuthButton = useMemo(() => {
    if (children) {
      return children
    }

    return (
      <Button variant="ghost" size="sm" className="text-sm">
        {text || (currentMode === 'login' ? 'Login' : 'Create Account')}
      </Button>
    )
  }, [children, currentMode, text]);

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => setCurrentMode(mode)}>
        {AuthButton}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <TextLogo />
        </DialogTitle>
        <DialogHeader>
          {currentMode === 'login'
            ? <LoginForm setCurrentMode={setCurrentMode} />
            : <CreateAccountForm setCurrentMode={setCurrentMode} />
          }
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}