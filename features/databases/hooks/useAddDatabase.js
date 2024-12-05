import { SetProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useState } from "react";

export default function useAddDatabase(edit, name) {
    
    const [pageNum, setPageNum] = useState(0);
    const [tableName, setTableName] = useState("");
    const [url, setUrl] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [createColOpen, setCreateColOpen] = useState(false);
    const [addColType, setAddColType] = useState(0);
    const [database, setDatabase] = useState(edit ? edit: {
        tableName: "",
        url: "",
        user: "",
        password: "",
        columns: []
    });
    
    const [columns, setColumns] = useState(edit ? edit.columns : []);
    
    
    const nextPage = () => {
        setPageNum((p) => {
            return p + 1
        })
    }
    
    const prevPage = () => {
        setPageNum((p) => {
            if(p > 0) {
                return p - 1
            }
            return p
        })
    }
    
    const openAddColScreen = (n) => {
        setCreateColOpen(true);
        setAddColType(n);
    }
    
    return [
        pageNum, setPageNum, prevPage, nextPage,
        tableName, setTableName, url, setUrl, user, setUser, password, setPassword,
        createColOpen, setCreateColOpen, addColType, openAddColScreen,
        database, columns, setColumns
    ]
    
}