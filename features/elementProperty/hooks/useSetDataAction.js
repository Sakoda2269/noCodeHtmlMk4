import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";

export default function useSetDataAction(actions) {
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const selectingScreen = useContext(ScreenContext);
    const selecting = useContext(SelectingContext);

    const [selectedDatabase, setSelectedDatabase] = useState(actions.setData.target);
    const [columns, setColumns] = useState(Object.keys(actions.setData.datas));
    const [columnStates, setColumnStates] = useState(actions.setData.datas);
    const [successNavigation, setSuccessNavigation] = useState(actions.setData.success);
    const [fialNavigation, setFailNavigation] = useState(actions.setData.fail);
    
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
            setSelectedDatabase(component.actions.setData.target);
            setColumns(Object.keys(component.actions.setData.datas));
            setColumnStates(component.actions.setData.datas);
            setSuccessNavigation(component.actions.setData.success);
            setFailNavigation(component.actions.setData.fail);
        }
        
    }, [project, selecting])
    
    const changeColumnStates = (e, key) => {
        setColumnStates((prev) => {
            prev[key] = e.target.value;
            return { ...prev };
        });
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
            component.actions.setData = {
                target: selectedDatabase,
                datas: columnStates,
                pkey: project.databases[selectedDatabase].primaryKey,
                success: successNavigation,
                fail: fialNavigation
            }
            setProject({...project});
        }
    }

    return [
        databases, selectedDatabase, onChangeDatabases, columns, columnStates, changeColumnStates, 
        screens, successNavigation, setSuccessNavigation, fialNavigation, setFailNavigation, confirm
    ]
}