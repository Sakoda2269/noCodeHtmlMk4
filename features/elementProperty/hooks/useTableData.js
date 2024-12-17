import { ProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useEffect, useState } from "react";

export default function useTableData(data, setOtherData) {
    const curSource = data.source;
    const curCols = data.columns;
    const curRowNum = data.rowNum;
    const curRowHeight = data.rowHeight;
    const project = useContext(ProjectContext);
    const [source, setSource] = useState(curSource != "" ? curSource : "");
    const [columns, setColumns] = useState(curCols.length != 0 ? curCols : []);
    const [rowNum, setRowNum] = useState(parseInt(curRowNum) ? parseInt(curRowNum) : 1);
    const [sourceColums, setSourceColumns] = useState(curSource != "" ? () => {
        const res = [];
        for (const col of project.databases[curSource].columns) {
            if(col.type == "table") {
                const foreignTable = col.foreignTable;
                for(const i of col.columns) {
                    res.push(col.name + "." + project.databases[foreignTable].columns[i].name);
                }
            } else {
                res.push(col.name);
            }
        }
        return res;
    } : []);
    const [rowHeight, setRowHeight] = useState(curRowHeight!="" ? curRowHeight : "100px");

    useEffect(() => {
        if (source != "") {
            const res = [];
            for (const col of project.databases[source].columns) {
                if(col.type == "table") {
                    const foreignTable = col.foreignTable;
                    for(const i of col.columns) {
                        res.push(col.name + "." + project.databases[foreignTable].columns[i].name);
                    }
                } else {
                    res.push(col.name);
                }
            }
            setSourceColumns(res);
        }
    }, [source, project])
    
    useEffect(() => {
        setOtherData((prev) => ({
            ...prev,
            columns: columns
        }));
    }, [columns])

    const handleChangeColumns = (e) => {
        if (e.target.checked) {
            setColumns((prev) => (
                [...prev, e.target.name]
            ));
        } else {
            setColumns((prev) => {
                const res = [];
                for (const col of prev) {
                    if (col != e.target.name) {
                        res.push(col);
                    }
                }
                return res;
            })
        }
    }
    
    const handleChangeSource = (e) => {
        setSource(e.target.value);
        setOtherData((prev) => (
            {
                ...prev,
                source: e.target.value
            }
        ));
    }
    
    const handleChangeRowNum = (e) => {
        setRowNum(e.target.value);
        setOtherData((prev) => ({
            ...prev,
            rowNum: e.target.value
        }))
    }
    const handleChangeRowHeight = (e) => {
        setRowHeight(e.target.value);
        setOtherData((prev) => ({
            ...prev,
            rowHeight: rowHeight
        }))
    }

    return [
        source, handleChangeSource, columns, handleChangeColumns, rowNum, handleChangeRowNum, sourceColums, Object.keys(project.databases),
        rowHeight, handleChangeRowHeight
    ]
}