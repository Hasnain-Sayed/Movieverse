import { Suspense } from "react";
import TvSeriesClient from "./TvSeriesClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen" />}>
            <TvSeriesClient />
        </Suspense>
    );
}