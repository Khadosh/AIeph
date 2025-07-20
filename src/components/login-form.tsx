"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/actions/auth"
import { ForgotPasswordForm } from "./forgot-password-form"
import { useTranslations } from "next-intl"

type FormData = {
  email: string
  password: string
}

export function LoginForm({
  className,
  setCurrentMode,
  ...props
}: React.ComponentProps<"div"> & { setCurrentMode: (mode: 'login' | 'signup') => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const t = useTranslations('auth.login')
  const tValidation = useTranslations('auth.validation')
  const tMessages = useTranslations('auth.messages')

  const validationSchema = z.object({
    email: z.email({ message: tValidation('emailInvalid') }).min(1, { message: tValidation('emailRequired') }),
    password: z.string().min(1, { message: tValidation('passwordRequired') })
  })

  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setMessage(null)

    const result = await login(data)
    
    if (result?.error) {
      setMessage({ type: 'error', text: result.error.message })
    }
    setIsLoading(false)
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm 
        className={className} 
        onBack={() => setShowForgotPassword(false)}
        {...props}
      />
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            label={t('email')}
            type="email"
            placeholder="your@email.com"
            required
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">{t('password')}</Label>
              <Button
                type="button"
                variant="link"
                className="ml-auto text-sm underline-offset-4 hover:underline p-0 h-auto"
                onClick={() => setShowForgotPassword(true)}
              >
                {t('forgotPassword')}
              </Button>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              className={form.formState.errors.password && "border-red-500"}
              {...form.register("password")} 
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('submitting') : t('submit')}
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          {t('noAccount')}{" "}
          <Button variant="link" className="underline underline-offset-4" onClick={() => setCurrentMode('signup')}>
            {t('signUp')}
          </Button>
        </div>
      </form>
    </div>
  )
}
