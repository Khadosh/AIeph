'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { LoginFormData, SignupFormData } from '@/types/auth'

export async function login(formData: LoginFormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(formData)

  if (error) {
    console.error('Login error:', error.message)
    
    // Handle specific error messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: { message: 'auth.messages.loginError' } }
    }
    
    return { error: { message: 'auth.messages.loginGenericError' } }
  }

  revalidatePath('/', 'layout')
  redirect('/creator/novel')
}

export async function signup(formData: SignupFormData) {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin')

  const { error } = await supabase.auth.signUp({
    ...formData,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Signup error:', error.message)
    
    // Handle specific error messages - avoid revealing if user exists
    if (error.message.includes('User already registered')) {
      return { error: { message: 'auth.messages.signupError' } }
    }
    
    return { error: { message: 'auth.messages.signupGenericError' } }
  }

  return { success: true, message: 'auth.messages.signupSuccess' }
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error.message)
    return { error: { message: 'auth.messages.forgotPasswordError' } }
  }

  return { success: true, message: 'auth.messages.forgotPasswordSuccess' }
}

export async function updatePassword(password: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      console.error('Update password error:', error.message)
      return { error: { message: 'auth.messages.resetPasswordError' } }
    }

    redirect('/creator')
  } catch (error: any) {
    console.error('Update password error:', error.message)
    return { error: { message: 'auth.messages.resetPasswordError' } }
  }
}


export async function getUser() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return null
    }

    return data.user
  } catch (error) {
    // Handle AuthSessionMissingError and other auth errors gracefully
    // This is normal when user is not logged in, so we don't log as error
    return null
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}