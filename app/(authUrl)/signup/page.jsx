"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import SignupSchema from "@/lib/schema/signupSchema"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const router = useRouter();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true)

            const { name, email, age, password, confirmPassword } = formData

            const result = SignupSchema.safeParse({ name, email, age, password, confirmPassword })
            if (!result.success) {
                const fieldErrors = {}
                result.error.issues.forEach((issue) => {
                    const field = issue.path[0]
                    if (!fieldErrors[field]) {
                        fieldErrors[field] = issue.message
                    }
                })
                setErrors(fieldErrors)
                setIsLoading(false)
                return
            }
            setErrors({})

            const signupRequest = async () => {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Sign up failed");
                return data;
            };

            const data = await toast.promise(signupRequest(), {
                loading: "Signing up...",
                success: "Account created! Please log in with the credentials you entered.",
                error: (err) => err.message || "Sign up failed!",
            },
                {
                    duration: 5000
                });

            router.push('/login');
        } catch (error) {
            console.error("Sign Up Error: ", error);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="min-h-screen w-full bg-black flex flex-col lg:flex-row">

            <Link
                href="/"
                className="absolute top-5 left-7 md:top-8 md:left-8 lg:top-10 lg:left-10 xl:top-14 xl:left-14 z-100 flex flex-col items-center w-fit cursor-pointer"
            >
                <span className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">
                    MovieVerse
                </span>
                <span className="text-xs md:text-sm lg:text-base text-gray-300">
                    Movies and TV Series
                </span>
            </Link>

            {/* decorative panel */}
            <div className="relative hidden lg:flex lg:w-[42%] overflow-hidden bg-[#050505]">
                {/* spotlight glow — the one deliberate bold accent */}
                <div className="absolute -top-24 -left-24 h-112 w-md rounded-full bg-yellow-400/10 blur-[100px]" />

                {/* film sprocket strip along the inner edge */}
                <div className="absolute right-0 top-0 h-full w-8 flex flex-col items-center justify-evenly py-10">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i} className="h-3 w-3 rounded-[3px] border border-zinc-700" />
                    ))}
                </div>

                {/* headline — the only in-flow content here, so it's genuinely centered */}
                <div className="relative z-10 flex-1 flex items-center justify-start px-10 xl:px-14">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-xl xl:max-w-md"
                    >
                        <h1 className="text-4xl xl:text-5xl font-semibold text-white leading-tight">
                            Track every story you fall for.
                        </h1>
                        <p className="mt-4 text-gray-400 text-sm xl:text-base">
                            Save favorites, pick up recommendations, and build a watchlist
                            that's actually yours.
                        </p>
                    </motion.div>
                </div>

                {/* attribution — pinned bottom-left */}
                <p className="absolute bottom-10 left-10 xl:bottom-14 xl:left-14 z-10 text-xs md:text-sm text-gray-600">
                    Movie and TV data provided by TMDB.
                </p>
            </div>

            <div className="py-5 pl-7 sm:pl-10 md:pl-15 flex ">
                <Link href="/" className="md:hidden flex flex-col items-center mb-1">
                    <span className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">MovieVerse</span>
                    <span className="text-xs md:text-sm lg:text-base text-gray-300">Movies and TV Series</span>
                </Link>
            </div>

            {/* form panel */}
            <div className="flex-1 flex items-start lg:items-center justify-center px-6 py-4 sm:px-10 sm:py-10 md:py-25 ">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >

                    <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Already watching with us?{" "}
                        <Link href="/login" className="text-yellow-400 hover:text-yellow-300">
                            Sign in
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                        <div className="relative">
                            <label htmlFor="name" className="block text-sm text-gray-300 mb-1.5">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="w-full rounded-xl border border-gray-700 bg-[#111113] px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors mb-1"
                            />
                            {errors.name && (
                                <p className="absolute top-full left-0 mt-1 text-red-400 text-xs ">{errors.name}</p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-gray-700 bg-[#111113] px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors mb-1"
                            />
                            {errors.email && (
                                <p className="absolute top-full left-0 mt-1 text-red-400 text-xs ">{errors.email}</p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="age" className="block text-sm text-gray-300 mb-1.5">
                                Age
                            </label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="18"
                                className="w-full rounded-xl border border-gray-700 bg-[#111113] px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors mb-1"
                            />
                            {errors.age && (
                                <p className="absolute top-full left-0 mt-1 text-red-400 text-xs ">{errors.age}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm text-gray-300 mt-2 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-gray-700 bg-[#111113] px-4 py-2.5 pr-11 text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors mb-1"
                                />
                                {errors.password && (
                                    <p className="absolute top-full left-0 mt-1 text-red-400 text-xs ">{errors.password}</p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mt-2 mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-gray-700 bg-[#111113] px-4 py-2.5 pr-11 text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors"
                                />
                                {errors.confirmPassword && (
                                    <p className="absolute top-full left-0 mt-1 text-red-400 text-xs ">{errors.confirmPassword}</p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-3 w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}