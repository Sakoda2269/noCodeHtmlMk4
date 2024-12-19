import { ProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContainerContext } from "@/features/project/contexts/selectingContainerContext";
import { SelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";

export default function useTableData(data, setOtherData) {
    
    const project = useContext(ProjectContext);
    const selecting = useContext(SelectingContext);
    const screen = useContext(ScreenContext);
    const [source, setSource] = useState("");
    const [columns, setColumns] = useState([]);
    const [rowNum, setRowNum] = useState(1);
    const [sourceColums, setSourceColumns] = useState([]);
    const [rowHeight, setRowHeight] = useState("40px");
    
    useEffect(() => {
        const paths = selecting.split("/");
        let component = project.screens[screen].components;
        for(let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (path == "") {
                return;
            }
            component = component[path];
            if(i != paths.length - 1) {
                component = component.children;
            }
        }
        const data = component.other
        setSource(data.source ? data.source : "");
        setColumns(data.columns ? data.columns : "");
        setRowNum(data.rowNum ? parseInt(data.rowNum) : 1);
        setRowHeight(data.rowHeight ? data.rowHeight : "40px");
        if(data.source != "") {
            const cols = [];
            for (const col of project.databases[data.source].columns) {
                if(col.type == "table") {
                    const foreignTable = col.foreignTable;
                    for(const i of col.columns) {
                        cols.push(col.name + "." + project.databases[foreignTable].columns[i].name);
                    }
                } else {
                    cols.push(col.name);
                }
            }
            setSourceColumns(cols);
        } else {
            setSourceColumns([]);
        }
    }, [selecting, screen])

    const handleChangeColumns = (e) => {
        let newCol = [];
        if (e.target.checked) {
            setColumns((prev) => {
                const tmp =[...prev, e.target.name];
                newCol = tmp; 
                return tmp;
            });
        } else {
            setColumns((prev) => {
                const res = [];
                for (const col of prev) {
                    if (col != e.target.name) {
                        res.push(col);
                    }
                }
                newCol = res;
                return res;
            })
        }
        setOtherData((prev) => ({
            ...prev,
            columns: newCol
        }));
    }
    
    const handleChangeSource = (e) => {
        setSource(e.target.value);
        setColumns([]);
        setOtherData((prev) => (
            {
                ...prev,
                source: e.target.value,
                columns: []
            }
        ));
        if (e.target.value != "") {
            const res = [];
            for (const col of project.databases[e.target.value].columns) {
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
            rowHeight: e.target.value
        }))
    }

    return [
        source, handleChangeSource, columns, handleChangeColumns, rowNum, handleChangeRowNum, sourceColums, Object.keys(project.databases),
        rowHeight, handleChangeRowHeight
    ]
}