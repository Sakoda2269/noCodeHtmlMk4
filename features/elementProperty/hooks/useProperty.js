"use client"
import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";


export default function useProperty(propertyName) {
    const selecting = useContext(SelectingContext);
    const screen = useContext(ScreenContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const [property, setProperty] = useState("");
        
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
        }
    }, [selecting, project, propertyName])
    
    const onChange = (e) => {
        setProperty(e.target.value);
        const value = e.target.value;
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
            prop.value = e.target.value;
        }
        setProject({...project});
    }
    
    return [property, onChange];
    
}