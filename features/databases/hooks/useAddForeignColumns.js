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
    
    const confirm = (close) => {
        if(foreignTable == "") {
            alert("テーブルを選択してください");
            return;
        }
        if(selectedColumns.length == 0) {
            alert("列を一つ以上選択してください");
            return;
        }
        if(edit != -1) {
            setCol((prev) => {
                const res = [...prev]
                res[edit] = {
                    name: foreignTable,
                    type: "table",
                    relationKey: databases[foreignTable].primaryKey,
                    columns:selectedColumns
                };
                return res;
            })
        } else {
            setCol((prev) => ([
                ...prev,
                {
                    name: foreignTable,
                    type: "table",
                    relationKey: databases[foreignTable].primaryKey,
                    columns:selectedColumns
                }
            ]))
        }
        close();
    }
    
    return [foreignTable, setForeignTable, selectedColumns, setSelectedColumns, foreignColumns, databases, confirm];
}