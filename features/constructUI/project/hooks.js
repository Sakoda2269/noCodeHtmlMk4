"use client"

import { useEffect, useState } from "react";

export default function useProject(pid) {
    const [project, setProject] = useState({});

    const [currentScreenId, setCurrentScreenId] = useState(0);

    const [selecting, setSelecting] = useState("");

    const [selectingContainer, setSelectingContainer] = useState("");

    const [loading, setLoading] = useState(true);
    
    const [connecting, setConnecting] = useState(true);
    
    
    useEffect(() => {
        const getProject = async () => {
            const res = await fetch("/api/projects/" + pid);
            const data = await res.json();
            setProject(data.project)
            setConnecting(false);
        }
        getProject();
    }, [])

    return [project, setProject, currentScreenId, setCurrentScreenId, selecting, setSelecting, selectingContainer, setSelectingContainer
        ,loading, setLoading, connecting
    ];
}
