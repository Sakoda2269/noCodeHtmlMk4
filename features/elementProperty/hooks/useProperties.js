import { ProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";


export default function useProperties() {
    const selecting = useContext(SelectingContext);
    const project = useContext(ProjectContext);
    const screen = useContext(ScreenContext);
    const [properties, setProperties] = useState({});
    
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
        setProperties(component.data)
    }, [project, selecting])
    
    return [properties];
    
}