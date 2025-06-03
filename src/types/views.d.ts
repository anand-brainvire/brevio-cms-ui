export type LoginInput = {
    email: string
    password: string
}

export type ForgotPasswordInput = {
    email: string
}

export type ResetPasswordInput = {
    password: string
    confirmPassword: string
}