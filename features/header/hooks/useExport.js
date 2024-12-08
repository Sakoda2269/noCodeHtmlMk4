import { ProjectContext } from "@/features/project/contexts/projectContext";
import { useContext } from "react";

export default function useExport() {

    const project = useContext(ProjectContext);

    const exportModel = (e) => {
        const text = constructModelFile(project);
        const blob = new Blob([text], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "output.model"; // ファイル名

        // ダウンロードリンクをクリック
        a.click();

        // 一時的なオブジェクトURLを解放
        URL.revokeObjectURL(a.href);
    }

    return [exportModel]

}

const typeChange = {
    "text": "Str",
    "integer": "Int"
}

function constructDatabaseModel(databases) {
    const res = []
    for (const key in databases) {
        const value = databases[key];
        const pkeys = value.primaryKey;
        let pkeysTypes = "";
        const otherCols = [];
        const otherColsTypes = [];
        const foreignCols = []
        for (const col of value.columns) {
            if (pkeys == col.name) {
                pkeysTypes = typeChange[col.type];
            } else {
                if (col.type == "table") {
                    foreignCols.push(col);
                } else {
                    otherCols.push(col.name);
                    otherColsTypes.push(typeChange[col.type]);
                }
            }
        }
        res.push(createAddToMap(key, pkeys, pkeysTypes, otherCols, otherColsTypes, foreignCols, databases))
        for (let i = 0; i < otherCols.length; i++) {
            res.push(createChange(key, pkeys, pkeysTypes, otherCols[i], otherColsTypes[i]));
        }
        for (const col of foreignCols) {
            for (const fcol of constructForeignCols(col, key, pkeys, pkeysTypes, databases)) {
                res.push(fcol);
            }
        }
    }
    return res.join("\n");
}

function constructModelFile(project) {

    const databases = constructDatabaseModel(project.databases);
    const ui = "";

    return databases + "\n\n" + ui;
}

function createAddToMap(mapName, id, idType, others, othersTypes, foreignCols, databases) {
    const channelName = "add" + capitalizeFirstLetter(mapName);
    let nameAndTypes = []
    for (let i = 0; i < others.length; i++) {
        nameAndTypes.push(`${others[i]}: ${othersTypes[i]}`)
    }
    for(const fcol of foreignCols) {
        const fkey = fcol.name + capitalizeFirstLetter(fcol.relationKey);
        nameAndTypes.push(`${fkey}: ${typeChange[searchFkeyType(databases, fcol.name, fcol.relationKey)]}`)
    }
    const args = id + ": " + idType + ", " + nameAndTypes.join(", ");
    let insertJson = [];
    for (const other of others) {
        insertJson.push(`"${other}": ${other}`)
    }
    for (const fcol of foreignCols) {
        const fkey = fcol.name + capitalizeFirstLetter(fcol.relationKey);
        insertJson.push(`"${fkey}": ${fkey}`)
    }
    return (
        `channel ${channelName} {
        out ${mapName}(${mapName}: Map, ${channelName}(${args})) = insert(${mapName}, ${id}, {${insertJson.join(",")}})
}
`
    )
}

function createChange(mapName, pkey, pkeyType, colName, colType) {
    const Col = capitalizeFirstLetter(colName);
    const channelName = "change" + capitalizeFirstLetter(mapName) + Col;
    const paths = [mapName, `{${pkey}}`, colName];
    return (
        `channel ${channelName}(${pkey}: ${pkeyType}) {
        out ${paths.join(".")}(${colName}: ${colType}, ${channelName}(new${Col}: ${colType})) = new${Col}
}
`
    )
}

function constructForeignCols(column, tableName, pkey, pkeyType, databases) {
    const fTableName = column.name;
    const fkey = column.relationKey;
    const res = []
    const fkeyType = searchFkeyType(databases, fTableName, fkey);
    res.push(createChange(tableName, pkey, pkeyType, `${fTableName}${capitalizeFirstLetter(fkey)}`, typeChange[fkeyType]));
    for (const i of column.columns) {
        res.push(createForeignCols(tableName, pkey, pkeyType, fTableName, fkey, typeChange[fkeyType], databases[fTableName].columns[i].name, typeChange[databases[fTableName].columns[i].type]))
    }
    return res;
}

function searchFkeyType(databases, tableName, fkey) {
    console.log(databases, tableName)
    for (const col of databases[tableName].columns) {
        if (col.name == fkey) {
            return col.type;
        }
    }
}

function createForeignCols(tableName, pkey, pkeyType, fTableName, fkey, fkeyType, fcol, fcolType) {
    const col = `${fTableName}${capitalizeFirstLetter(fcol)}`
    const channelName = `${col}Of${capitalizeFirstLetter(tableName)}`;
    const colType = fcolType;
    const newCol = `new${capitalizeFirstLetter(col)}`;
    fkey = `${fTableName}${capitalizeFirstLetter(fkey)}`;
    const newFkey = `new${capitalizeFirstLetter(fkey)}`;
    return (
        `channel ${channelName}(${pkey}: ${pkeyType}){
    in ${tableName}.{${pkey}}.${fkey}(${fkey}: ${fkeyType}, ${channelName}(${newFkey}: ${fkeyType}, ${newCol}: ${colType})) = ${newFkey}
    in ${fTableName}.{${newFkey}}.${fcol}(${fcol}: ${fcolType}, ${channelName}(${newFkey}, ${newCol})) = ${newCol}
    out ${tableName}.{${pkey}}.${col}(${col}, ${channelName}(${newFkey}, ${newCol})) = ${newCol}
} 
`
    )
}

function capitalizeFirstLetter(str) {
    if (!str) return ""; // 空文字の場合はそのまま返す
    return str.charAt(0).toUpperCase() + str.slice(1);
}