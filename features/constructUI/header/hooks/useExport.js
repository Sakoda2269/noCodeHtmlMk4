import { ProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { act, useContext } from "react";
import constructDatabaseModel from "./constructDatabases";
import consturctUIModel from "./consturctUIModel";
import { ScreenContext } from "../../project/contexts/screenContext";

export default function useExport(title) {

    const project = useContext(ProjectContext);
    const screen = useContext(ScreenContext);
    
    const exportModel = (e) => {
        let canCreateModel = true;
        for(const scr of project.screens) {
            canCreateModel = canCreateModel && (scr.components.length > 0)
        }
        if(!canCreateModel) {
            alert("ウィジェットが一つもないスクリーンを作ることはできません")
            return;
        }
        const text = constructModelFile(project, screen);
        const blob = new Blob([text], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "output.model"; // ファイル名

        // ダウンロードリンクをクリック
        a.click();

        // 一時的なオブジェクトURLを解放
        URL.revokeObjectURL(a.href);
    }

    const exportJson = () => {
        constructJson(project, title)
    }

    return [exportModel, exportJson]

}

export function constructModelFile(project, screen) {

    const ui = consturctUIModel(project.screens, screen);
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

function constructJson(project, title) {
    console.log(project);
    const projectId = "p" + self.crypto.randomUUID().replace(/-/g, "")
    const now = new Date();
    const projectData = {
        id: projectId,
        title: title,
        detail: "",
        createdTime: now,
        updatedTime: now,
        screens: project.screens.map((screen, idx) => constructScreen(screen, projectId, idx)),
        tables: Object.entries(project.databases).map(([name, database]) => constructDatabase(database, name, project.databases))
    };
    const result = JSON.stringify(projectData, null, 2)
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}_JSON.json`
    a.click();
    URL.revokeObjectURL(url);

}

function constructScreen(screen, projectId, idx) {
    const screenId = "s" + self.crypto.randomUUID().replace(/-/g, "")
    const screenData = {
        id: screenId,
        projectId: projectId,
        name: screen.title,
        index: idx,
        components: screen.components.map((comp, idx) => constructWidget(comp, screenId, idx))
    }
    return screenData
}

function constructWidget(widget, screenId, idx) {
    switch (widget.type) {
        case "button":
            return constructButton(widget, screenId, idx)
        case "table":
            return constructTable(widget, screenId, idx)
        default:
            return constructOthers(widget, screenId, idx)
    }
}

function constructTable(widget, screenId, idx) {
    const data = widget.data;
    const other = widget.other;
    return {
        id: "w" + self.crypto.randomUUID().replace(/-/g, ""),
        screenId: screenId,
        name: data.id.value,
        type: widget.type,
        index: idx,
        generalData: {
            "referenceTableName": other.source,
            "columns": other.columns
        },
        style: {},
        uiData: {
            "posX": Number(data.styles.value.left.value.slice(0, -2)),
            "posY": Number(data.styles.value.top.value.slice(0, -2)),
            "width": Number(data.styles.value.width.value.slice(0, -2)),
            "height": Number(data.styles.value.height.value.slice(0, -2))
        },
    }
}

function constructOthers(widget, screenId, idx) {
    const data = widget.data;
    return {
        id: "w" + self.crypto.randomUUID().replace(/-/g, ""),
        screenId: screenId,
        name: data.id.value,
        type: widget.type,
        index: idx,
        generalData: {
            "text": data.text.value
        },
        style: {},
        uiData: {
            "posX": Number(data.styles.value.left.value.slice(0, -2)),
            "posY": Number(data.styles.value.top.value.slice(0, -2)),
            "width": Number(data.styles.value.width.value.slice(0, -2)),
            "height": Number(data.styles.value.height.value.slice(0, -2))
        },
    }
}

function constructButton(widget, screenId, idx) {
    const widgetId = "w" + self.crypto.randomUUID().replace(/-/g, "")
    const action = widget.actions;
    const data = widget.data;
    let actionData = {};
    if (action.navigation != "") {
        actionData = constructNavigateAction(action);
    } else if (action.setData.target != "") {
        actionData = constructSetDataAction(action.setData);
    } else if (action.updateData.target != "") {
        actionData = constructUpdateDataAction(action.updateData);
    } else if (action.deleteData.target != "") {
        actionData = constructDeleteDataAction(action.deleteData);
    } else if(action.searchData.target != "") {
        actionData = constructSearchDataAction(action.searchData);
    }
    return {
        id: widgetId,
        screenId: screenId,
        name: data.id.value,
        type: widget.type,
        index: idx,
        generalData: {
            "text": data.text.value
        },
        style: {},
        uiData: {
            "posX": Number(data.styles.value.left.value.slice(0, -2)),
            "posY": Number(data.styles.value.top.value.slice(0, -2)),
            "width": Number(data.styles.value.width.value.slice(0, -2)),
            "height": Number(data.styles.value.height.value.slice(0, -2))
        },
        action: actionData
    }
}

function constructNavigateAction(action) {
    return {
        type: "navigate",
        action: {
            "nextScreenName": action.navigation
        }
    }
}

function constructSetDataAction(action) {
    return {
        type: "addData",
        action: {
            "tableName": action.target,
            "newData": action.datas,
            "successScreenName": action.success,
            "fialScreenName": action.fail
        }
    }
}

function constructUpdateDataAction(action) {
    return {
        type: "updateData",
        action: {
            "tableName": action.target,
            "newData": action.datas,
            "successScreenName": action.success,
            "fialScreenName": action.fail
        }
    }
}

function constructDeleteDataAction(action) {
    return {
        type: "deleteData",
        action: {
            "tableName": action.target,
            "deleteData": action.datas,
            "successScreenName": action.success,
            "failScreenName": action.fail
        }
    }
}

function constructSearchDataAction(action) {
    return {
        type: "searchData",
        action: {
            "tableName": action.target,
            "searchData": action.datas.selectedColumns,
            "targetComponentName": action.datas.targetWidget
        }
    }
}

function constructDatabase(database, name, databases) {
    return {
        id: "t" + self.crypto.randomUUID().replace(/-/g, ""),
        name: name,
        columns: database.columns.map((column) => constructColumn(column, database.primaryKey, databases))
    }
}

function constructColumn(column, primaryKey, databases) {
    if (!column.foreignTable) {
        return {
            name: column.name,
            type: "string",
            isPrimary: column.name === primaryKey
        }
    }
    
    return {
        name: column.name,
        isPrimary: column.name === primaryKey,
        type: "foreign",
        foreignTableName: column.foreignTable,
        foreignTableColumns: column.columns.map(idx => databases[column.foreignTable].columns[idx].name) 
    }

}

