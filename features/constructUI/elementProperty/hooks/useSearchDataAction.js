import { useContext, useEffect, useState } from "react";
import { ProjectContext, SetProjectContext } from "../../project/contexts/projectContext";
import { ScreenContext } from "../../project/contexts/screenContext";
import { SelectingContext } from "../../project/contexts/selectingContext";


export function useSearchDataAction(actions) {
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const selectingScreen = useContext(ScreenContext);
    const selecting = useContext(SelectingContext);

    const [selectedDatabase, setSelectedDatabase] = useState(actions.searchData.target);
    const [columns, setColumns] = useState([]);
    const [columnStates, setColumnStates] = useState(actions.searchData.datas.selectedColumns ?? {});
    const [selectedColumns, setSelectedColumns] = useState(Object.keys(actions.searchData.datas.selectedColumns ?? {}));
    const [targetWidget, setTargetWidget] = useState(actions.searchData.datas.targetWidget ?? "");
    
    const databases = Object.keys(project.databases);
    const screens = [];
    for(const screen of project.screens) {
        screens.push(screen.title);
    }
    
    useEffect(() => {
        const paths = selecting.split("/");
        let component = project.screens[selectingScreen].components;
        for(let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (path == "") {
                return;
            }
            component = component[path];
            if(i != paths.length - 1) {
                component = component.children;
            }
        }
        if (component.type == "button") {
            setSelectedDatabase(component.actions.searchData.target);
            // setColumnStates(component.actions.searchData.datas.selectedColumns ?? {});
            setSelectedColumns(Object.keys(actions.searchData.datas.selectedColumns ?? {}))
            setTargetWidget(actions.searchData.datas.targetWidget ?? "");
            const tmp = [];
            const states = {};
            if (component.actions.searchData.target ?? "" != "") {
                for (const col of project.databases[component.actions.searchData.target].columns) {
                    if (col.name == project.databases[component.actions.searchData.target].primaryKey) {
                        continue;
                    } 
                    if(col.type == "table") {
                        tmp.push(col.name + "." + col.relationKey);
                        if (col.name + "." + col.relationKey in component.actions.searchData.datas.selectedColumns ?? {}) {
                            states[col.name + "." + col.relationKey] = component.actions.searchData.datas.selectedColumns[col.name + "." + col.relationKey];
                        } else {
                            states[col.name + "." + col.relationKey] = "";
                        }
                    } else {
                        tmp.push(col.name);
                        if (col.name in component.actions.searchData.datas.selectedColumns ?? {}) {
                            states[col.name] = component.actions.searchData.datas.selectedColumns[col.name];    
                        } else {
                            states[col.name] = "";
                        }
                    }
                }
                setColumns(tmp);
                setColumnStates(states);
            }
        }
        
    }, [project, selecting])
    
    const changeColumnStates = (e, key) => {
        setColumnStates((prev) => ({
            ...prev,
            [key]: e.target.value
        }));
    }

    const onSelectColumn = (e) => {
        if(e.target.checked) {
            setSelectedColumns((prev) => [...prev, e.target.value]);
        } else {
            setSelectedColumns((prev) => prev.filter((v) => v !== e.target.value));
        }
    }
    
    const onChangeDatabases = (e) => {
        setSelectedDatabase(e.target.value);
        const tmp = [];
        const states = {};
        if (e.target.value != "") {
            for (const col of project.databases[e.target.value].columns) {
                if (col.name == project.databases[e.target.value].primaryKey) {
                    continue;
                } 
                if(col.type == "table") {
                    tmp.push(col.name + "." + col.relationKey);
                    states[col.name + "." + col.relationKey] = "";
                } else {
                    tmp.push(col.name);
                    states[col.name] = "";
                }
            }
            setColumns(tmp);
            setColumnStates(states);
        } else {
            setColumns([]);
            setColumnStates({});
        }
    }
    
    const confirm = () => {
        const paths = selecting.split("/");
        let component = project.screens[selectingScreen].components;
        for(let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (path == "") {
                return;
            }
            component = component[path];
            if(i != paths.length - 1) {
                component = component.children;
            }
        }
        if(component.type == "button") {
            for(var key of Object.keys(columnStates)) {
                if (! selectedColumns.includes(key)) {
                    delete columnStates[key];
                }
            }
            component.actions.searchData = {
                target: selectedDatabase,
                datas: {
                    selectedColumns: columnStates,
                    pkey: project.databases[selectedDatabase].primaryKey,
                    targetWidget: targetWidget
                },
            }
            setProject({...project});
        }
    }

    return [
        databases, selectedDatabase, onChangeDatabases, columns, columnStates, changeColumnStates, 
        screens, confirm, onSelectColumn, selectedColumns, targetWidget, setTargetWidget
    ]
}