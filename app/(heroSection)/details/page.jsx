import { Suspense } from "react";
import DetailsClient from "./DetailsClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen" />}>
            <DetailsClient />
        </Suspense>
    );
}