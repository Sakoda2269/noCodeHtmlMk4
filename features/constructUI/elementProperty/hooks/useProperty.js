"use client"
import { ProjectContext, SetProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { ScreenContext } from "@/features/constructUI/project/contexts/screenContext";
import { SelectingContext } from "@/features/constructUI/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";


export default function useProperty(propertyName) {
    const screen = useContext(ScreenContext);
    const selecting = useContext(SelectingContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const [property, setProperty] = useState("");
    const [selectOptions, setSelectOptions] = useState([]);
    const [startId, setStartId] = useState("");
    
         
    useEffect(() => {
        const paths = selecting.split("/");
        let component = project.screens[screen].components;
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
        const propPaths = propertyName.split("/");
        let prop = component.data[propPaths[0]];
        for(let i = 1; i < propPaths.length; i++) {
            if(!prop) {
                return;
            }
            prop = prop.value[propPaths[i]];
        }
        if(prop) {
            setProperty(prop.value);
            if(prop.type == "select") {
                if(prop.source == "databases") {
                    setSelectOptions(Object.keys(project.databases));
                }
            }
        }
    }, [selecting, project, propertyName])
    
    const onChange = (e) => {
        const paths = selecting.split("/");
        const newProject = {...project};
        let component = newProject.screens[screen].components;
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
        const propPaths = propertyName.split("/");
        let value = e.target.value;
        if (propPaths == "id") {
            value = value.replace(/[-\s\r\n]+/g, '');
        }
        let prop = component.data[propPaths[0]];
        for(let i = 1; i < propPaths.length; i++) {
            if(!prop) {
                return;
            }
            prop = prop.value[propPaths[i]];
        }
        if(prop) {
            prop.value = value;
        }
        setProperty(value);
        setProject({...newProject});
    }
    
    const onIdFocus = (e) => {
        setStartId(e.target.value);
    }
    
    const onIdChange = (e) => {
        setProperty(e.target.value);
    }
    
    const onIdBlur = (e) => {
        if(e.target.value in project.widgetNames) {
            alert("このidは使用されています");
            setProperty(startId);
            return;
        }
        if(/^\d/.test(e.target.value)) {
            alert("idの先頭を数字にすることはできません");
            setProperty(startId);
            return;
        }
        if(e.target.value == "") {
            setProperty(startId);
            return;
        }
        if(e.target.value == startId) {
            return;
        }
        const paths = selecting.split("/");
        const newProject = {...project};
        let component = newProject.screens[screen].components;
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
        const propPaths = propertyName.split("/");
        let value = e.target.value;
        value = value.replace(/[-\s\r\n]+/g, '');
        let prop = component.data[propPaths[0]];
        for(let i = 1; i < propPaths.length; i++) {
            if(!prop) {
                return;
            }
            prop = prop.value[propPaths[i]];
        }
        if(prop) {
            prop.value = value;
        }
        delete newProject.widgetNames[startId];
        newProject.widgetNames[value] = 1;
        console.log(value);
        setProject({...newProject});
    }
    
    const onKeyDown = (e) => {
        if(e.key == "Enter") {
            e.target.blur();
        }
    }
    
    return [property, onChange, selectOptions, onIdFocus, onIdChange, onIdBlur, onKeyDown];
    
}