"use client"

import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";


export default function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname() //to highling active nav links

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Movies", href: "/movies" },
        { name: "TV Series", href: "/tv-series" },
    ];

    const socialLinks = [
        { name: "GitHub", href: "https://github.com/Hasnain-Sayed", icon: FaGithub },
        { name: "Instagram", href: "https://instagram.com/notblazeatall", icon: FaInstagram },
        { name: "LinkedIn", href: "https://linkedin.com/in/mohammad-hasnain-sayed", icon: FaLinkedin },
    ];

    return (
        <motion.footer className="bg-black text-white border-t border-gray-800 mt-auto "
            initial={{ opacity: 0,translateY:6 }}
            animate={{ opacity: 1,translateY:0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="px-4 md:px-10 xl:px-36 py-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

                    {/* brand */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link href="/" className="flex flex-col items-center md:items-start">
                            <span className="text-2xl md:text-3xl font-bold text-yellow-400">
                                MovieVerse
                            </span>
                            <span className="text-xs sm:text-base text-gray-400">
                                Movies and TV Series
                            </span>
                        </Link>
                        <p className="text-xs sm:text-base text-gray-500 max-w-xs text-center md:text-left mt-2">
                            Discover trending, top-rated movies and TV series, all in one place.
                        </p>
                    </div>

                    {/* nav links */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                            Explore
                        </h3>
                        <nav className="flex flex-col items-center md:items-start gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm md:text-base relative transition-colors ${pathname === link.href ? "text-yellow-400" : "text-gray-400 hover:text-yellow-500  "}`}
                                >
                                    {link.name}
                                    
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* socials */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                            Connect
                        </h3>
                        <div className="flex items-center gap-4">
                            {socialLinks.map(({ name, href, icon: Icon }) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={name}
                                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* attribution */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                            Powered By
                        </h3>
                        <a
                            href="https://www.themoviedb.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                            The Movie Database (TMDB)
                        </a>
                    </div>
                </div>

                {/* bottom bar */}
                <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs md:text-base text-gray-500 text-center sm:text-left">
                        &copy; {currentYear} MovieVerse. All rights reserved.
                    </p>
                    <p className="text-xs md:text:base text-gray-500 text-center sm:text-right">
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}