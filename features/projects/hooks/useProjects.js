import { useEffect, useState } from "react";

export default function useProjects() {
    const [projects, setProjecs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProjects = async () => {
            const res = await fetch("/api/projects", { "method": "GET" });
            const data = await res.json();
            console.log(data);
            const dataSort = data.slice().sort((a, b) => {
                return a.updateDate.localeCompare(b.updateDate);  // アルファベット順でソート
            });
            setProjecs(dataSort);
            setLoading(false);
        }
        getProjects();
    }, [])

    const deleteProject = async (_id) => {
        setLoading(true);
        const res = await fetch("/api/projects", {
            "method": "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "_id": _id }),
        });
        const res2 = await fetch("/api/projects", { "method": "GET" });
        const data = await res2.json();
        const dataSort = data.slice().sort((a, b) => {
            return a.updateDate.localeCompare(b.updateDate);  // アルファベット順でソート
        });
        setProjecs(dataSort);
        setLoading(false);
    }

    return [projects, setProjecs, loading, deleteProject];
}