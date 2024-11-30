import { SetProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useState } from "react";

export default function useAddDatabase(edit, name) {
    const setProject = useContext(SetProjectContext)
    const [pageNum, setPageNum] = useState(0);
    const [url, setUrl] = useState(edit ? edit.url : "");
    const [user, setUser] = useState(edit ? edit.user : "");
    const [password, setPassword] = useState(edit ? edit.password : "")
    const [useDatabase, setUseDatabase] = useState(edit ? edit.database : "");
    const [tableName, setTableName] = useState(name ? name : "");
    const [columns, setColumns] = useState(edit ? edit.columns : []);
    const [primaryKeys, setPrimaryKeys] = useState(edit ? edit.primaryKey : []);

    const nextPage = () => {
        setPageNum(pageNum + 1);
    }

    const prevPage = () => {
        setPageNum(pageNum - 1);
    }

    const changeURL = (e) => {
        setUrl(e.target.value);
    }

    const changeUser = (e) => {
        setUser(e.target.value);
    }

    const changePassword = (e) => {
        setPassword(e.target.value);
    }

    const changeDatabase = (e) => {
        setUseDatabase(e.target.value);
    }

    const changeTableName = (e) => {
        setTableName(e.target.value);
    }

    const changePrimaryKey = (e) => {
        const {name, checked} = e.target;
        if(!checked && primaryKeys.length == 1) {
            alert("主キーは一つ以上必要です。");
            return;
        }
        setPrimaryKeys((prev) => {
            if (checked) {
                return [...prev, name]
            } else {
                const res = [];
                for(let pkey of prev) {
                    if(pkey != name) {
                        res.push(pkey)
                    }
                }
                return res;
            }
        })
    }

    const deleteColumn = (index) => {
        let colName = "";
        setColumns((prev) => {
            const res = [];
            for(let i = 0; i < prev.length; i++) {
                if(i != index) {
                    res.push(prev[i]);
                } else {
                    colName = prev[i].name;
                    console.log(prev[i].name)
                }
            }
            if(primaryKeys.includes(colName)) {
                setPrimaryKeys((prev) => {
                    const res = [];
                    for(let name of prev) {
                        if(name != colName) {
                            res.push(name);
                        }
                    }
                    return res;
                });
            }
            return res;
        });
    }

    const deleteTable = (close) => {
        setProject((prev) =>{
            const {[name]: some, ...others} = prev["databases"]
            return {
                ...prev,
                ["databases"]: {...others}
            }
        })
        close();
    }

    const confirm = (close) => {
        if(columns.length == 0) {
            alert("列が一つ以上必要です");
            return;
        }
        if(tableName == "") {
            alert("テーブル名を入力してください");
            return;
        }
        setProject((prev) => {
            if(!edit) {
                return {
                    ...prev,
                    ["databases"]: {
                        ...prev["databases"],
                        [tableName]: {
                            url: url,
                            user: user,
                            password: password,
                            database: useDatabase,
                            columns: columns,
                            primaryKey: primaryKeys
                        }
                    }
                }
            } else {
                const {[name]: rect , ...others} = prev.databases;
                return {
                    ...prev,
                    ["databases"]: {
                        ...others,
                        [tableName]: {
                            url: url,
                            user: user,
                            password: password,
                            database: useDatabase,
                            columns: columns,
                            primaryKey: primaryKeys
                        }
                    }
                }
            }
            
        });
        close();
    }

    return [
        pageNum, nextPage, prevPage, setPageNum,
        url, changeURL, user, changeUser, password, changePassword, useDatabase, changeDatabase, tableName, changeTableName,
        columns, setColumns, primaryKeys, changePrimaryKey, confirm, deleteColumn, deleteTable
    ]
}