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
    const [columns, setColumns] = useState(Object.keys(actions.searchData.datas));
    const [columnStates, setColumnStates] = useState(actions.searchData.datas);
    const [selectedColumn, setSelectedColumn] = useState(actions.searchData.selectedColumn)
    
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
            setColumns(Object.keys(component.actions.searchData.datas));
            setColumnStates(component.actions.searchData.datas);
        }
        
    }, [project, selecting])
    
    const changeColumnStates = (e, key) => {
        setColumnStates((prev) => {
            prev[key] = e.target.value;
            return { ...prev };
        });
    }

    const onSelectColumn = (e) => {
        
    }
    
    const onChangeDatabases = (e) => {
        setSelectedDatabase(e.target.value);
        const tmp = [];
        const states = {};
        if (e.target.value != "") {
            for (const col of project.databases[e.target.value].columns) {
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
            component.actions.searchData = {
                target: selectedDatabase,
                datas: columnStates,
                pkey: project.databases[selectedDatabase].primaryKey,
            }
            setProject({...project});
        }
    }

    return [
        databases, selectedDatabase, onChangeDatabases, columns, columnStates, changeColumnStates, 
        screens, confirm
    ]
}