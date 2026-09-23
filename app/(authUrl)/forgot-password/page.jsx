"use client"

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EmailSchema, OtpSchema, NewPasswordSchema } from "@/lib/schema/forgotPasswordSchema";
import toast from "react-hot-toast";
import { maskEmail } from "@/lib/utils";

export default function ForgotPasswordForm() {
    const [phase, setPhase] = useState("email"); // "email" | "otp" | "password"

    const [email, setEmail] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [cooldown, setCooldown] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const otpRefs = useRef([]);
    const router = useRouter();

    const otp = otpDigits.join("");

    // collects zod issues into a { field: message } object
    const collectErrors = (result) => {
        const fieldErrors = {};
        result.error.issues.forEach((issue) => {
            const field = issue.path[0];
            if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        });
        return fieldErrors;
    };

    const handleOtpChange = (index, value) => {
        const char = value.slice(-1); // one character per box
        const next = [...otpDigits];
        next[index] = char;
        setOtpDigits(next);

        if (char && index < otpDigits.length - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };


    // ---------- Phase 1: email ----------
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = EmailSchema.safeParse({ email });
        if (!result.success) {
            setErrors(collectErrors(result));
            setIsLoading(false);
            return;
        }
        setErrors({});

        const sendOtpRequest = async () => {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            return data;
        };

        try {
            await toast.promise(sendOtpRequest(), {
                loading: "Sending reset code...",
                success: "Code sent! Check your email.",
                error: (err) => err.message || "Couldn't send the code, try again.",
            });
            setPhase("otp");
        } catch (error) {
            console.error("Forgot password error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ---------- Phase 2: verify otp ----------
    useEffect(() => {
        if (phase === "otp") setCooldown(45);
    }, [phase]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = OtpSchema.safeParse({ otp });
        if (!result.success) {
            setErrors(collectErrors(result));
            setIsLoading(false);
            return;
        }
        setErrors({});

        const verifyRequest = async () => {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Verification failed");
            return data;
        };

        try {
            await toast.promise(verifyRequest(), {
                loading: "Verifying code...",
                success: "Code verified!",
                error: (err) => err.message || "Incorrect or expired code.",
            });
            setPhase("password");
        } catch (error) {
            console.error("OTP verify error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        try {
            await toast.promise(
                fetch("/api/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }).then(async (res) => {
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    return data;
                }),
                {
                    loading: "Resending code...",
                    success: "New code sent!",
                    error: (err) => err.message,
                }
            );
            setCooldown(40); // wapas cooldown start
        } catch (error) {
            console.error("Resend error:", error);
        }
    };

    // ---------- Phase 3: new password ----------
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = NewPasswordSchema.safeParse({ newPassword, confirmPassword });
        if (!result.success) {
            setErrors(collectErrors(result));
            setIsLoading(false);
            return;
        }
        setErrors({});

        const resetRequest = async () => {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Reset failed");
            return data;
        };

        try {
            await toast.promise(resetRequest(), {
                loading: "Resetting your password...",
                success: "Password updated! Please log in.",
                error: (err) => err.message || "Couldn't reset the password.",
            });
            router.push("/login");
        } catch (error) {
            console.error("Reset password error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const backToEmail = () => {
        setPhase("email");
        setOtpDigits(["", "", "", "", ""]);
        setErrors({});
    };

    const backToOtp = () => {
        setPhase("otp");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
    };

    // shared motion props so each phase slides in the same way
    const phaseMotion = {
        initial: { opacity: 0, x: 12 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -12 },
        transition: { duration: 0.25 },
    };

    return (
        <>
            <div className="py-5 pl-7 sm:pl-10 md:pt-8 md:pl-8 lg:pt-10 lg:pl-10 xl:pl-14 xl:pt-14 flex ">
                <Link href="/" className=" flex flex-col items-center mb-1">
                    <span className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">MovieVerse</span>
                    <span className="text-xs md:text-sm lg:text-base text-gray-300">Movies and TV Series</span>
                </Link>
            </div>
            <div className="min-h-full w-full bg-black flex items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >


                    {/* step indicator */}
                    <div className="flex items-center gap-2 mb-6">
                        {["email", "otp", "password"].map((step) => (
                            <span
                                key={step}
                                className={`h-1 flex-1 rounded-full transition-colors ${step === phase ? "bg-yellow-400" : "bg-zinc-800"
                                    }`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ---------- Phase 1 ---------- */}
                        {phase === "email" && (
                            <motion.div key="email-phase" {...phaseMotion}>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                                    Forgot your password?
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Enter the email on your account and we'll send you a reset code.
                                </p>

                                <form onSubmit={handleEmailSubmit} className="mt-8 space-y-5">
                                    <div className="relative mb-4">
                                        <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full rounded-xl border border-gray-700 bg-[#111113] px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors"
                                        />
                                        {errors.email && (
                                            <p className="absolute top-full left-0 mt-1 text-red-400 text-xs">{errors.email}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="mt-3 w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Sending code..." : "Send reset code"}
                                    </button>

                                    <Link
                                        href="/login"
                                        className="block text-center text-sm text-gray-500 hover:text-yellow-400"
                                    >
                                        Back to login
                                    </Link>
                                </form>
                            </motion.div>
                        )}

                        {/* ---------- Phase 2 ---------- */}
                        {phase === "otp" && (
                            <motion.div key="otp-phase" {...phaseMotion}>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                                    Enter the code
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    We sent a 5-character code to <span className="text-gray-300">{maskEmail(email)}</span>.
                                </p>

                                <form onSubmit={handleOtpSubmit} className="mt-8 space-y-5">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1.5">
                                            Reset code
                                        </label>
                                        <div className="flex gap-2 sm:gap-3">
                                            {otpDigits.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={(el) => (otpRefs.current[i] = el)}
                                                    type="text"
                                                    inputMode="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                    className="w-full aspect-square rounded-xl border border-gray-700 bg-[#111113] text-center text-lg text-white outline-none focus:border-yellow-400 transition-colors"
                                                />
                                            ))}
                                        </div>
                                        {errors.otp && (
                                            <p className="mt-1.5 text-red-400 text-xs">{errors.otp}</p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={cooldown > 0}
                                            className={`mt-1 text-xs transition-colors ${cooldown > 0
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-200 hover:text-yellow-400 cursor-pointer"
                                                }`}
                                        >
                                            {cooldown > 0
                                                ? `Resend available in ${cooldown}s`
                                                : "Didn't get a code? Resend"}
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Verifying..." : "Verify code"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={backToEmail}
                                        className="block w-full text-center text-sm text-gray-500 hover:text-yellow-400"
                                    >
                                        Wrong email? Go back
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ---------- Phase 3 ---------- */}
                        {phase === "password" && (
                            <motion.div key="password-phase" {...phaseMotion}>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                                    Set a new password
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Almost there — choose a new password for your account.
                                </p>

                                <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-5">
                                    <div className="relative mb-1">
                                        <label htmlFor="newPassword" className="block text-sm text-gray-300 mb-1.5">
                                            New password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="newPassword"
                                                name="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-gray-700 bg-[#111113] px-4 py-2.5 pr-11 text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.newPassword ? (
                                            <p className=" mt-1.5 text-red-400 text-xs">{errors.newPassword}</p>
                                        ) : (
                                            <p className="text-xs text-gray-500 mt-1.5 ">
                                                Must be 8+ characters with an uppercase, lowercase, and a number.
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative mb-3 ">
                                        <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1.5">
                                            Confirm new password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirm ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-gray-700 bg-[#111113] px-4 py-2.5 pr-11 text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm((v) => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                                aria-label={showConfirm ? "Hide password" : "Show password"}
                                            >
                                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1.5 text-red-400 text-xs">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className=" w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Resetting..." : "Reset password"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={backToOtp}
                                        className="block w-full text-center text-sm text-gray-500 hover:text-yellow-400"
                                    >
                                        Back
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    );
}



