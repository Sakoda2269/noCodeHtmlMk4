import { useState } from "react";

export default function useAddDatabase() {
    const [pageNum, setPageNum] = useState(0);
    const [url, setUrl] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("")
    const [useDatabase, setUseDatabase] = useState("");
    const [columns, setColumns] = useState([
        {
            name: "tweetId",
            type: "integer",
            constraint: [],
            default: "$sequential"
        },
        {
            name: "accountId",
            type: "varchar(32)",
            constraint: [],
            default: null
        },
        {
            name: "content",
            type: "text",
            constraint: [],
            default: ""
        }
    ]);
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

    return [
        pageNum, nextPage, prevPage,
        url, changeURL, user, changeUser, password, changePassword, useDatabase, changeDatabase,
        columns, setColumns, primaryKeys, setPrimaryKeys, foreignKeys, setForeignKeys
    ]
}