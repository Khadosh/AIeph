export type LoginFormData = {
  email: string
  password: string
}

export type SignupFormData = {
  email: string
  password: string
  confirmPassword: string
}

export type ForgotPasswordFormData = {
  email: string
}

export type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}