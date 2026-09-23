"use client"

import { createContext, useContext } from "react"
import useSWR from "swr"

const AuthContext = createContext(null)

const fetcher = (url) => fetch(url, { credentials: "include" })
    .then(res => { if (!res.ok) throw new Error(); return res.json(); });

export function AuthProvider({ children }) {
    const { data } = useSWR("/api/auth/checkCookies", fetcher);
    return (
        <AuthContext.Provider value={{ user: data?.user || null }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);