"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { requestPasswordReset } from "@/actions/auth"
import { useTranslations } from "next-intl"

type FormData = {
  email: string
}

export function ForgotPasswordForm({
  className,
  onBack,
  ...props
}: React.ComponentProps<"div"> & { onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const t = useTranslations('auth.forgotPassword')
  const tValidation = useTranslations('auth.validation')
  const tMessages = useTranslations('auth.messages')

  const validationSchema = z.object({
    email: z.string().min(1, { message: tValidation('emailRequired') }).email({ message: tValidation('emailInvalid') }),
  })

  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await requestPasswordReset(data.email)
      
      if (result?.error) {
        const errorMessage = result.error.message.startsWith('auth.messages.') 
          ? tMessages(result.error.message.replace('auth.messages.', ''))
          : result.error.message
        setMessage({ type: 'error', text: errorMessage })
      } else {
        const successMessage = result.message.startsWith('auth.messages.') 
          ? tMessages(result.message.replace('auth.messages.', ''))
          : result.message
        setMessage({ type: 'success', text: successMessage })
      }
    } catch {
      setMessage({ type: 'error', text: tMessages('unexpectedError') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
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
                label={t('email')}
                type="email"
                placeholder="your@email.com"
                required
                error={form.formState.errors.email?.message}
                {...form.register("email")}
              />
              
              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t('submitting') : t('submit')}
              </Button>
              
              <div className="text-center text-sm">
                <Button variant="link" className="underline underline-offset-4" onClick={onBack}>
                  {t('backToLogin')}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 