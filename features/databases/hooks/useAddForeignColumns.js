import { ProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useEffect, useState } from "react";

export default function useAddForeignColumns(setCol, columns, edit) {
    const project = useContext(ProjectContext);
    const [foreignTable, setForeignTable] = useState(edit == -1 ? "" : columns[edit].name);
    const [selectedColumns, setSelectedColumns] = useState(edit == -1 ? [] : columns[edit].columns);
    const [foreignColumns, setForeignColumns] = useState(edit == -1 ? [] : project.databases[foreignTable]);
    
    const databases = project.databases;
    
    useEffect(() => {
        setForeignColumns(project.databases[foreignTable]);
    }, [foreignTable])
    
    const confirm = () => {
        if(foreignTable == "") {
            alert("テーブルを選択してください");
            return;
        }
        if(selectedColumns.length == 0) {
            alert("列を一つ以上選択してください");
            return;
        }
        const columns = [];
        for(const col of selectedColumns) {
            columns.push({
                name: databases[foreignTable].columns[col].name,
                type: databases[foreignTable].columns[col].type
            })
        }
        setCol((prev) => ([
            ...prev,
            {
                name: foreignTable,
                type: "table",
                relationKey: databases[foreignTable].primaryKey,
                columns:columns
            }
        ]))
    }
    
    return [foreignTable, setForeignTable, selectedColumns, setSelectedColumns, foreignColumns, databases, confirm];
}