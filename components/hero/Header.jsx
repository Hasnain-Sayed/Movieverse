"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { LoaderFive } from "../ui/loader.jsx";


export default function Header() {
    const pathname = usePathname() //to highling active nav links
    const [isMenuOpen, setIsMenuOpen] = useState(false)//state for mobile controll menu
    const [isSearchOpen, setIsSearchOpen] = useState(false)//state to control the search visibility
    const [searchTerm, setSearchTerm] = useState("")//state to store search input 
    const [suggestions, setSuggestions] = useState([])// state to store movie sugesstions
    const [isLoading, setIsLoading] = useState(false) // state to track loading status

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Movies", href: "/movies" },
        { name: "TV Series", href: "/tv-series" },

    ]

    //fetch sugesstion from TMDB based on input value
    const fetchSugesstions = async (query) => {
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        //show loading indicator before starting API call
        try {
            setIsLoading(true)
            //get TMDB API Key 
            const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
            const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`

            const res = await fetch(url, { cache: "no-store" })//fresh result with no caching
            if (res.ok) {
                const data = await res.json()

                //keep movie and tv series and limit to 5 results
                const filteredResults = data.results?.filter((item) => item.media_type === "movie" || item.media_type === "tv").slice(0, 5) || []

                setSuggestions(filteredResults)


            } else {
                //clear suggestions if  api call fails
                setSuggestions([])
            }
        } catch (error) {
            console.log(error)
            setSuggestions([])
        } finally {
            setIsLoading(false)
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault()
        //if search is open and suggestions exist,,close search and reset
        if (!searchTerm.trim()) {
            //empty input pe search band kardo
            setIsSearchOpen(false)
            setSuggestions([])
            return
        }
        // new search always
        setIsSearchOpen(true)
        fetchSugesstions(searchTerm)
    }

    const closeSearch = () => {
        setIsSearchOpen(false)
        setSearchTerm("")
        setSuggestions([])
    }

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);


    return (
        <motion.header
            className="bg-transparent text-white w-full py-2 z-50 px-4 md:px-10 xl:px-36 absolute top-0 left-0"

            initial={{ opacity: 0, translateY: -6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 }}
        >

            {/* desktop design */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link href='/' className="flex flex-col items-center">
                        <span className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-yellow-400">
                            MovieVerse
                        </span>
                        <span className="text-xs lg:text-base text-white">
                            Movies and TV Series
                        </span>
                    </Link>




                    {/* mobile menu toggle button */}
                    <motion.button className="md:hidden text-white hover:text-white/80 cursor-pointer "
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />

                        )}

                    </motion.button>

                </div>
                {/* search bar */}
                <motion.div className="relative w-full md:w-1/3 md:mx-8 hidden md:block">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Quick Search"
                            className="w-full px-4 py-1.5 lg:py-3 bg-white text-sm text-gray-500 focus:outline-none placeholder-gray-500 rounded-xl border border-gray-500 focus:border-white pr-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-default" type="button"
                            onClick={isSearchOpen && suggestions.length > 0 ? closeSearch : undefined}
                        >
                            {isLoading ? (
                                //show loading spinner during api call
                                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                            ) : isSearchOpen && suggestions.length > 0 ? (
                                //show close icon
                                <X className="w-5 h-5 text-gray-500" />
                            ) :
                                <Search className="w-5 h-5 text-gray-500" />}
                        </button>
                    </form>

                    {/* animated dropdown suggestion */}
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div className="absolute top-full mt-1 w-full bg-[#18181b] border border-gray-500 rounded-lg shadow-lg z-50"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLoading && (
                                    <div className="w-full text-center py-2">
                                        <LoaderFive text={`Finding Content...`} />
                                    </div>
                                )}

                                {suggestions.length > 0 ? (
                                    suggestions.map((item) => (
                                        <Link key={item.id} href={`/details?id=${item.id}&media_type=${item.media_type}`}
                                        onClick={closeSearch}
                                        >
                                            <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer">
                                                <Image src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/default_poster.jpg"} alt=""
                                                    width={32} height={48} className="w-8 aspect-2/3 object-cover rounded mr-1" />
                                                <div className="flex-1">
                                                    <h3 className="md:text-lg lg:text-xl font-bold text-white line-clamp-2  h-10">{item.title || item.name || "unnamed"}</h3>
                                                    <div className="flex justify-between px-2">
                                                        <p>
                                                            {(item.release_date || item.first_air_date)?.split("-")[0] || "N/A"}
                                                        </p>
                                                        <p>
                                                            ⭐{(item.vote_average).toFixed(1) || "N/A"}/10
                                                        </p>
                                                    </div>

                                                </div>

                                            </div>
                                        </Link>
                                    )))
                                    : (
                                        //no result message
                                        <div className="p-2 text-sm text-gray-400 text-center">
                                            No Results Found
                                        </div>
                                    )}

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* navigation links */}

                <nav className="hidden md:flex md:items-center md:space-x-6" >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm sm:text-base font-medium relative ${pathname === link.href ? 'text-amber-300' : ' text-white hover:text-white/90'}`}
                        >
                            {link.name}

                            <AnimatePresence>
                                {pathname === link.href && (
                                    <motion.span
                                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-yellow-400"
                                        layoutId="desktop-underline"
                                        initial={{ opacity: 0, scaleX: 0 }}
                                        animate={{ opacity: 1, scaleX: 1 }}
                                        exit={{ opacity: 0, scaleX: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* mobile menu */}
            <motion.div className={`md:hidden backdrop-blur-xs bg-[rgba(24,24,27,0.6)] z-50 absolute left-0 w-full px-4 py-4 ${isMenuOpen ? 'block' : 'hidden'}`}
                initial={{ y: -20, opacity: 0 }}
                animate={isMenuOpen ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* mobile search bar */}
                <motion.div className="relative w-full mb-4">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Quick Search..."
                            className="w-full px-4 py-2 bg-white text-gray-500 placeholder:text-gray-500 rounded-xl border border-gray-500 focus:outline-none focus:border-white pr-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" type="button"
                            onClick={isSearchOpen && suggestions.length > 0 ? closeSearch : undefined}
                        >
                            {isLoading ? (
                                //show loading spinner during api call
                                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                            ) : isSearchOpen && suggestions.length > 0 ? (
                                //show close icon
                                <X className="w-5 h-5 text-gray-500" />
                            ) : //show search icon
                                <Search className="w-5 h-5 text-gray-500" />}
                        </button>
                    </form>
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div className="absolute top-full mt-1 w-full bg-[#18181b] border border-gray-500 rounded-lg shadow-lg z-50"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLoading && (
                                    <div className="w-full text-center py-2">
                                        <LoaderFive text={`Finding Content...`} />
                                    </div>
                                )}

                                {suggestions.length > 0 ? (
                                    suggestions.map((item) => (
                                        <Link key={item.id} href={`/details?id=${item.id}&media_type=${item.media_type}`}
                                        onClick={closeSearch}
                                        >
                                            <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer">
                                                <Image src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/default_poster.jpg"} alt=""
                                                    width={32} height={48} className="w-8 aspect-2/3 object-cover rounded mr-1" />
                                                <div className="flex-1">
                                                    <h3 className="text-sm sm:text-base font-bold mt-1 ml-1 text-white line-clamp-2 h-10">{item.title || item.name || "unnamed"}</h3>
                                                    <div className="flex justify-between px-2">
                                                        <p>
                                                            {(item.release_date || item.first_air_date)?.split("-")[0] || "N/A"}
                                                        </p>
                                                        <p>
                                                            ⭐{(item.vote_average).toFixed(1)}/10
                                                        </p>
                                                    </div>

                                                </div>

                                            </div>
                                        </Link>
                                    )))
                                    : (
                                        //no result message
                                        <div className="p-2 text-sm text-gray-400 text-center">
                                            No Results Found
                                        </div>
                                    )}

                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
                {/* mobile navigation links */}
                <nav className="flex flex-col items-center gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative  text-base font-medium ${pathname === link.href ? 'text-amber-300' : ' text-white hover:text-white/90'}`}
                        >
                            {link.name}
                            <AnimatePresence>
                                {pathname === link.href && (
                                    <motion.span
                                        layoutId="mobile-underline"
                                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-yellow-400"
                                        initial={{ opacity: 0, scaleX: 0 }}
                                        animate={{ opacity: 1, scaleX: 1 }}
                                        exit={{ opacity: 0, scaleX: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                        </Link>
                    ))}
                </nav>
            </motion.div>
        </motion.header>
    )
}