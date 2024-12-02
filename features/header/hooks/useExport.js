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
    for(const key in databases) {
        const value = databases[key];
        const pkeys = value.primaryKey;
        const pkeysTypes = [];
        const otherCols = [];
        const otherColsTypes = [];
        for(const col of value.columns) {
            if(pkeys.includes(col.name)) {
                pkeysTypes.push(typeChange[col.type]);
            } else {
                otherCols.push(col.name);
                otherColsTypes.push(typeChange[col.type]);
            }
        }
        res.push(createAddToMap(key, pkeys[0], pkeysTypes[0], pkeys.slice(1).concat(otherCols), pkeysTypes.slice(1).concat(otherColsTypes)))
        for(let i = 0; i < otherCols.length; i++) {
            res.push(createChange(key, pkeys, pkeysTypes, otherCols[i], otherColsTypes[i]));
        }
    }
    return res.join("\n");
}

function constructModelFile(project) {

    const databases = constructDatabaseModel(project.databases);
    const ui = "";

    return databases + "\n\n" + ui;
}

function createAddToMap(mapName, id, idType, others, othersTypes) {
    const channelName = "add" + capitalizeFirstLetter(mapName);
    
    let nameAndTypes = []
    for(let i = 0; i < others.length; i++) {
        nameAndTypes.push(`${others[i]}: ${othersTypes[i]}`)
    }
    const args = id + ": " + idType + ", " + nameAndTypes.join(", ");
    let insertJson = [];
    for(let other of others) {
        insertJson.push(`"${other}": ${other}`)
    }
    return (
`channel ${channelName} {
        out ${mapName}(${mapName}: Map, ${channelName}(${args})) = insert(${mapName}, ${id}, {${insertJson.join(",")}})
}
`
    )
}

function createChange(mapName, pkeys, pkeysTypes, colName, colType) {
    const Col = capitalizeFirstLetter(colName);
    const channelName = "change" + capitalizeFirstLetter(mapName) + Col;
    const pkeyAndTypes = [];
    for(let i = 0; i < pkeys.length; i++) {
        pkeyAndTypes.push(pkeys[i] + ": " + pkeysTypes[i]);
    }
    const paths = [mapName, ...pkeys.map((pkey) => "{" + pkey + "}"), colName];
    return (
`channel ${channelName}(${pkeyAndTypes.join(",")}) {
        out ${paths.join(".")}(${colName}: ${colType}, ${channelName}(new${Col}: ${colType})) = new${Col}
}
`
    )
}

function capitalizeFirstLetter(str) {
    if (!str) return ""; // 空文字の場合はそのまま返す
    return str.charAt(0).toUpperCase() + str.slice(1);
  }