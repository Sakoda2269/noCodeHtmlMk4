import { ProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useEffect, useState } from "react";

export default function useAddForeignColumns(setCol, edit) {
    const project = useContext(ProjectContext);
    const [foreignTable, setForeignTable] = useState(Object.keys(edit).length == 0 ? "" : edit.name);
    const [selectedColumns, setSelectedColumns] = useState(Object.keys(edit).length == 0 ? [] : edit.columns);
    const [foreignColumns, setForeignColumns] = useState(Object.keys(edit).length == 0 ? [] : project.databases[foreignTable]);
    
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