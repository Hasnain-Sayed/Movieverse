import { z } from "zod"

export const EmailSchema = z.object({
    email: z.email("Please enter a valid Email."),
})

export const OtpSchema = z.object({
    otp: z.string().length(5, "Code must be 5 characters."),
})

export const NewPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 Characters.")
        .refine((val) => /[A-Z]/.test(val), { error: "Must include an uppercase letter" })
        .refine((val) => /[a-z]/.test(val), { error: "Must include an lowercase letter" })
        .refine((val) => /[0-9]/.test(val), { error: "Must include a number" }),
    confirmPassword: z.string()
        .min(8, "Confirm Password must be at least 8 Characters.")
        .refine((val) => /[A-Z]/.test(val), { error: "Must include an uppercase letter" })
        .refine((val) => /[a-z]/.test(val), { error: "Must include an lowercase letter" })
        .refine((val) => /[0-9]/.test(val), { error: "Must include a number" })
}).refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
});