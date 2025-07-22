"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { useTranslations } from "next-intl"

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

type FormData = {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [canResetPassword, setCanResetPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('auth.resetPassword')
  const tValidation = useTranslations('auth.validation')
  const tMessages = useTranslations('auth.messages')

  useEffect(() => {
    const supabase = createClient()

    // Check for hash fragments and URL params on initial load
    const checkAuthParams = async () => {
      // Check for hash fragments first (Supabase often uses these)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const access_token = hashParams.get('access_token')
      const refresh_token = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      // Also check URL search params
      const urlParams = searchParams
      const code = urlParams.get('code')

      if ((access_token && refresh_token && type === 'recovery') || code) {
        setCanResetPassword(true)
        setMessage(null)
        return
      }
    }

    checkAuthParams()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setCanResetPassword(true)
        setMessage(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [searchParams])

  useEffect(() => {
    // Give some time for auth state to initialize before showing error
    const timer = setTimeout(() => {
      if (!canResetPassword) {
        setMessage({
          type: 'error',
          text: 'Please access this page through the reset password link sent to your email.'
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [canResetPassword])

  const validationSchema = z.object({
    password: z.string()
      .regex(strongPasswordRegex, { message: tValidation('passwordWeak') }),
    confirmPassword: z.string()
      .min(1, { message: tValidation('confirmPasswordRequired') }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: tValidation('passwordsDoNotMatch'),
    path: ["confirmPassword"],
  })

  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!canResetPassword) return

    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: data.password })

      if (error) {
        setMessage({ type: 'error', text: tMessages('resetPasswordError') })
      } else {
        setMessage({ type: 'success', text: tMessages('resetPasswordSuccess') })
        setTimeout(() => router.push('/creator'), 2000)
      }
    } catch {
      setMessage({ type: 'error', text: tMessages('unexpectedError') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <FormField
                label={t('newPassword')}
                type="password"
                placeholder="********"
                required
                error={form.formState.errors.password?.message}
                {...form.register("password")}
              />
              <FormField
                label={t('confirmNewPassword')}
                type="password"
                placeholder="********"
                required
                error={form.formState.errors.confirmPassword?.message}
                {...form.register("confirmPassword")}
              />

              {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !canResetPassword}
              >
                {isLoading ? t('submitting') : t('submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 