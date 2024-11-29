import { ProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useState } from "react";


export default function useDatabases() {
    
    const project = useContext(ProjectContext);

    const [databases, setDatabases] = useState(project.databases);
    const [isCreateDBOpen, setIsCreateDBOpen] = useState(false);
    const [isEditDBOpen, setIsEditDBOpen] = useState(false);
    const [editDB, setEditDB] = useState("");

    const openEditDB = (tableName) => {
        setEditDB(tableName);
        setIsEditDBOpen(true);
    }

    return [
        databases, isCreateDBOpen, setIsCreateDBOpen,
        isEditDBOpen, editDB, openEditDB, setIsEditDBOpen
    ]
}