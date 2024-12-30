import { ProjectContext, SetProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { ScreenContext } from "@/features/constructUI/project/contexts/screenContext";
import { SetSelectingContainerContext } from "@/features/constructUI/project/contexts/selectingContainerContext";
import { SelectingContext, SetSelectingContext } from "@/features/constructUI/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";
import { TrieDeleteContext } from "../../project/contexts/trieContext";


export default function useProperties() {
    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const screen = useContext(ScreenContext);
    const trieDelete = useContext(TrieDeleteContext);
    const [properties, setProperties] = useState({});
    const [actions, setActions] = useState({});
    const [componentType, setComponentType] = useState("");
    const [otherData, setOtherData] = useState({});
    
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
        setActions(component.actions);
        setProperties(component.data)
        setComponentType(component.type)
        setOtherData(component.other)
    }, [project, selecting, screen]);
    
    useEffect(() => {
        const paths = selecting.split("/");
        const newProject = {...project}
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
        component.other = otherData;
        setProject({...newProject});
    }, [otherData])
    
    const deleteComponent = () => {
        const newProject = {...project};
        const paths = selecting.split("/");
        let id = ""
        if(paths.length == 1) {
            id = newProject.screens[screen].components[selecting].data.id.value;
            newProject.screens[screen].components.splice(selecting, 1);
        } else {
            let newComps = newProject.screens[screen].components[paths[0]];
            for(let i = 1; i < paths.length - 1; i++){
                newComps = newComps.children[paths[i]];
            }
            id = newComps[selecting].data.id.value;
            newComps.children.splice(paths[paths.length - 1], 1);
        }
        delete newProject.widgetNames[id];
        trieDelete(id);
        console.log(newProject.widgetNames, id);
        setProject(newProject);
        setSelecting("");
        setSelectingContainer("");
    }
    
    
    return [properties, selecting, deleteComponent, componentType, actions, otherData, setOtherData];
    
}