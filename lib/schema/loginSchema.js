import { z } from "zod"

const LoginSchema = z.object({
    email: z.email("Please enter a valid Email."),
    password: z.string().min(8, "Password must be at least 8 Characters.").regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must include an uppercase letter, a lowercase letter, and a number."
        ),
    
})

export default LoginSchema