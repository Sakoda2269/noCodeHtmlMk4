import { useState } from "react";

export default function useAddNormalColmun(setCols, edit) {
    const [colName, setColName] = useState(Object.keys(edit).length == 0 ? "" : edit.name);
    const [colType, setColType] = useState(Object.keys(edit).length == 0 ? "" : edit.type);
    const [colDefault, setColDefault] = useState(Object.keys(edit).length == 0 ? "" : edit.default);
    
    const changeColName = (e) => {
        setColName(e.target.value);
    }
    const changeColType = (e) => {
        setColType(e.target.value);
    }
    const changeColDefault = (e) => {
        setColDefault(e.target.value);
    }
    
    const confirm = () => {
        if(colName == "" || colType == "") {
            alert("必須項目を入力してください")
            return;
        }
        setCols((prev) => ([
            ...prev,
            {
                name: colName,
                type: colType,
                default: colDefault
            }
        ]))
    }
    
    return [colName, changeColName, colType, changeColType, colDefault, changeColDefault, confirm];
    
}