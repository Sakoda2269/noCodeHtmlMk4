import { ProjectContext } from "@/features/project/contexts/projectContext";
import { useContext } from "react";
import constructDatabaseModel from "./constructDatabases";
import consturctUIModel from "./consturctUIModel";

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

function constructModelFile(project) {

    const ui = consturctUIModel(project.screens);
    const databases = constructDatabaseModel(project.databases);

    return ui + "\n" + databases;
}

export const typeChange = {
    "text": "Str",
    "integer": "Int"
}

export function capitalizeFirstLetter(str) {
    if (!str) return ""; // 空文字の場合はそのまま返す
    return str.charAt(0).toUpperCase() + str.slice(1);
}