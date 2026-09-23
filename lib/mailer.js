import { Resend } from "resend";
import { getOtpEmailHtml,getRegistrationEmailHtml } from "./emailTemplate";
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendResetEmail({ email, otp }) {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Your MovieVerse Reset Password Code`,
        html: getOtpEmailHtml(otp),
    })
}

export async function sendWelcomeEmail({ email,name }) {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Hi Welcome to movieverse`,
        html: getRegistrationEmailHtml(name),
    })
}
