import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/login-form"
import TextLogo from "@/components/ui/text-log"
import { useMemo } from "react"

export default function LoginDialog({ children }: { children?: React.ReactNode }) {
  const LoginButton = useMemo(() => {
    if (children) {
      return children
    }
    return (
      <Button variant="ghost" size="sm" className="text-sm">
        Login
      </Button>
    )
  }, [children])

  return (
    <Dialog>
      <DialogTrigger asChild>
        {LoginButton}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <TextLogo />
        </DialogTitle>
        <DialogHeader>
          <LoginForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}