import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SetSelectingContainerContext } from "@/features/project/contexts/selectingContainerContext";
import { SelectingContext, SetSelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";


export default function useProperties() {
    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
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
    
    const deleteComponent = () => {
        const newProject = {...project};
        const paths = selecting.split("/");
        if(paths.length == 1) {
          newProject.screens[screen].components.splice(selecting, 1);
        } else {
            let newComps = newProject.screens[screen].components[paths[0]];
            for(let i = 1; i < paths.length - 1; i++){
                newComps = newComps.children[paths[i]];
            }
            console.log(newComps)
            newComps.children.splice(paths[paths.length - 1], 1);
        }
        setProject(newProject);
        setSelecting("");
        setSelectingContainer("");
    }
    
    return [properties, selecting, deleteComponent];
    
}