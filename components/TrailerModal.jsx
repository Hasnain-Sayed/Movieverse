"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function TrailerModal({ isOpen, onClose, trailerUrl, title }) {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const embedUrl = trailerUrl
        ? `${trailerUrl}&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` : null; // to avoid 153 error of youtube
    //hanfling escape key to close the modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
        }
        return () => document.removeEventListener("keydown", handleEsc)

    }, [isOpen, onClose])

    if (!isOpen || !trailerUrl) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-label="Trailer Modal"
        >
            <div className="bg-[#18181b] p-4 rounded-lg max-w-3xl w-full relative"
                onClick={(e) => e.stopPropagation()} //prevent closing when click inside the modal
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-2 py-1 text-sm text-white hover:bg-black/80"
                    aria-label="Close trailer modal"
                >
                    <X />
                </button>

                {trailerUrl ? (
                    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                        <iframe src={embedUrl} title={`${title} Trailer `}
                            allow="autoplay; encrypted-media;fullscreen"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                        ></iframe>
                    </div>
                ) : (
                    <div className="flex min-h-55 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-center text-white">
                        <div>
                            <p className="text-lg font-semibold">No trailer available</p>
                            <p className="mt-2 text-sm text-zinc-300">This title does not currently have a public YouTube trailer.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)

}