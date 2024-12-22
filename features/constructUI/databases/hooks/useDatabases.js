import { ProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { useContext, useEffect, useState } from "react";


export default function useDatabases() {
    
    const project = useContext(ProjectContext);

    const [databases, setDatabases] = useState(project.databases);
    const [isCreateDBOpen, setIsCreateDBOpen] = useState(false);
    const [isEditDBOpen, setIsEditDBOpen] = useState(false);
    const [editDB, setEditDB] = useState("");

    useEffect(() => {
        setDatabases(project.databases);
    }, [project])

    const openEditDB = (tableName) => {
        setEditDB(tableName);
        setIsEditDBOpen(true);
    }

    return [
        databases, isCreateDBOpen, setIsCreateDBOpen,
        isEditDBOpen, editDB, openEditDB, setIsEditDBOpen
    ]
}