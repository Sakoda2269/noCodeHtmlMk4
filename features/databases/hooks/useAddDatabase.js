import { SetProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useState } from "react";

export default function useAddDatabase(edit, name) {
    
    const setProject = useContext(SetProjectContext);
    
    const [tableName, setTableName] = useState(name ? name : "");
    const [url, setUrl] = useState(edit ? edit.url : "");
    const [user, setUser] = useState(edit ? edit.user : "");
    const [password, setPassword] = useState(edit ? edit.password : "");
    const [createColOpen, setCreateColOpen] = useState(false);
    const [addColType, setAddColType] = useState(0);
    const [primaryKey, setPrimaryKey] = useState(edit ? edit.primaryKey : "");
    const [editCol, setEditCol] = useState(-1);
    
    const [columns, setColumns] = useState(edit ? edit.columns : []);
    
    
    const openAddColScreen = (n) => {
        setCreateColOpen(true);
        setAddColType(n);
    }
    
    const confirm = (close) => {
        if(columns.length == 0) {
            alert("列は一つ以上必要です");
            return;
        }
        if(primaryKey == "") {
            alert("主キーをひとつ選択してください");
            return;
        }
        
        setProject((prev) => {
            if(name) {
                const {[name]: _tmp, ...databases} = {...prev.databases};
                databases[tableName] = {
                    url: url,
                    user: user,
                    password: password,
                    database: "postgresql",
                    columns: columns,
                    primaryKey: primaryKey
                }
                return {
                    ...prev,
                    "databases": databases
                }
            } else {
                return {
                    ...prev,
                    "databases": {
                        ...prev["databases"],
                        [tableName]: {
                            url: url,
                            user: user,
                            password: password,
                            database: "postgresql",
                            columns: columns,
                            primaryKey: primaryKey
                        }
                    }
                }
            }
        })
        close();
    }
    
    return [
        tableName, setTableName, url, setUrl, user, setUser, password, setPassword,
        createColOpen, setCreateColOpen, addColType, openAddColScreen,
        columns, setColumns, confirm, primaryKey, setPrimaryKey,editCol, setEditCol
    ]
    
}