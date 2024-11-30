import { SetProjectContext } from "@/features/project/contexts/projectContext";
import { useContext, useState } from "react";

export default function useAddDatabase() {
    const setProject = useContext(SetProjectContext)
    const [pageNum, setPageNum] = useState(0);
    const [url, setUrl] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("")
    const [useDatabase, setUseDatabase] = useState("");
    const [tableName, setTableName] = useState("");
    const [columns, setColumns] = useState([]);
    const [primaryKeys, setPrimaryKeys] = useState(["tweetId"]);
    const [foreignKeys, setForeignKeys] = useState([["accountId", "accounts.id"]]);

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

    const confirm = (close) => {
        if(columns.length == 0) {
            alert("列が一つ以上必要です");
            return;
        }
        if(tableName == "") {
            alert("テーブル名を入力してください");
            return;
        }
        setProject((prev) => (
            {
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
        ));
        close();
    }

    return [
        pageNum, nextPage, prevPage, setPageNum,
        url, changeURL, user, changeUser, password, changePassword, useDatabase, changeDatabase, tableName, changeTableName,
        columns, setColumns, primaryKeys, changePrimaryKey, foreignKeys, setForeignKeys, confirm
    ]
}