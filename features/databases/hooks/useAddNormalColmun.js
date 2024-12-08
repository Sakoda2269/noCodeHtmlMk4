import { useState } from "react";

export default function useAddNormalColmun(setCols, columns, edit) {
    const [colName, setColName] = useState(edit == -1 ? "" : columns[edit].name);
    const [colType, setColType] = useState(edit == -1 ? "" : columns[edit].type);
    const [colDefault, setColDefault] = useState(edit == -1 ? "" : columns[edit].default);
    
    const changeColName = (e) => {
        setColName(e.target.value);
    }
    const changeColType = (e) => {
        setColType(e.target.value);
    }
    const changeColDefault = (e) => {
        setColDefault(e.target.value);
    }
    
    const confirm = (close) => {
        if(colName == "" || colType == "") {
            alert("必須項目を入力してください")
            return;
        }
        if(edit != -1) {
            setCols((prev) => {
                const res = [...prev]
                res[edit] = {
                    name: colName,
                    type: colType,
                    default: colDefault
                };
                return res
            })
        } else {
            setCols((prev) => ([
                ...prev,
                {
                    name: colName,
                    type: colType,
                    default: colDefault
                }
            ]))
        }
        close();
    }
    
    return [colName, changeColName, colType, changeColType, colDefault, changeColDefault, confirm];
    
}