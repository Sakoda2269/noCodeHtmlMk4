import { ProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useState } from "react";


export default function useEditColumns(col, setCols, colNum) {
    const project = useContext(ProjectContext);
    const [colData, setColData] = useState(
        colNum == -1 ?
        {
            "name": "",
            "type": "",
            constraint: [],
            "default": "",
            foreignKey: "",
        } : col
    )
    const [foreignTable, setForeignTable] = useState(colNum == -1 ? "" : col.foreignKey.split(".")[0]);
    const [foreignColName, setForeignColName] = useState(colNum == -1 ? "" : col.foreignKey.split(".")[1]);

    const setName = (e) => {
        setColData((prev) => ({
            ...prev,
            ["name"]: e.target.value
        }))
    }

    const setType = (e) => {
        setColData((prev) => ({
            ...prev,
            ["type"]: e.target.value
        }))
    }

    const setDefault = (e) => {
        setColData((prev) => ({
            ...prev,
            ["default"]: e.target.value
        }))
    }

    const setConstraint = (e) => {
        const {name, checked} = e.target;
        let constraints;
        if(checked) {
            constraints = colData["constraint"];
            constraints.push(name);
        } else {
            constraints = [];
            for(let colName of colData["constraint"]) {
                if(colName != name) {
                    constraints.push(colName);
                }
            }
        }
        setColData((prev) => ({
            ...prev,
            ["constraint"]: [...constraints]
        }))
    }

    const changeForeignTable = (e) => {
        setForeignTable(e.target.value);
        setForeignColName("");
    }

    const changeForeignColName = (e) => {
        setForeignColName(e.target.value);
        let index = 0;
        setColData((prev) => ({
            ...project.databases[foreignTable]["columns"][e.target.options.selectedIndex - 1],
            ["name"]: prev["name"],
            ["foreignKey"]: `${foreignTable}.${e.target.value}`
        }))
    }

    const confirm = (close) => {
        if(foreignTable != "" && foreignColName == "") {
            alert("Relationを正しく入力してください")
            return;
        }
        if(colData["name"] != "" && colData["type"] != "") {
            if(colNum == -1) {
                setCols((prev) => (
                    [
                        ...prev,
                        colData
                    ]
                ))
            } else {
                setCols((prev) => {
                    const newCols = [...prev];
                    newCols[colNum] = colData;
                    return newCols;
                })
            }
            close();
        } else {
            alert("必須項目を入力してください")
        }
    }

    return [colData, setName, setType, setDefault, setConstraint, foreignTable, changeForeignTable, foreignColName, changeForeignColName, confirm]
}