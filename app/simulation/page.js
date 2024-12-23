import Simulation from "@/features/simulation/simulation/components/Simulation";
import { Suspense } from "react";

export default function SimulatorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Simulation />
        </Suspense>
    )
}