"use client"

import Project from "@/features/constructUI/project/components/Project";
import { useParams } from "next/navigation"

export default function ProjectPage() {
    const { pid } = useParams();

    return (
        <div>
            <Project pid={pid}/>
        </div>
    )
}