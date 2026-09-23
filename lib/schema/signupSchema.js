import { z } from "zod"


const SignupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.email("Please enter a valid Email."),
    age: z.coerce.number("Age must be a valid number.")
        .positive()
        .max(99, "Age should be below 100"),
    password: z.string()
        .min(8, "Password must be at least 8 Characters.")
        .refine((val) => /[A-Z]/.test(val), { error: "Must include an uppercase letter" })
        .refine((val) => /[a-z]/.test(val), { error: "Must include an lowercase letter" })
        .refine((val) => /[0-9]/.test(val), { error: "Must include a number" }),
    confirmPassword: z.string()
        .min(8, "Confirm Password must be at least 8 Characters.")
        .refine((val) => /[A-Z]/.test(val), { error: "Must include an uppercase letter" })
        .refine((val) => /[a-z]/.test(val), { error: "Must include an lowercase letter" })
        .refine((val) => /[0-9]/.test(val), { error: "Must include a number" })
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
});

export default SignupSchema