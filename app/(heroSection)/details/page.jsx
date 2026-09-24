import { Suspense } from "react";
import DetailsPage from "./DetailsClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen" />}>
            <DetailsPage />
        </Suspense>
    );
}