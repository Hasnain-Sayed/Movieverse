import { Suspense } from "react";
import MoviesClient from "./MoviesClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen" />}>
            <MoviesClient />
        </Suspense>
    );
}