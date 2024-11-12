import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContainerContext, SetSelectingContainerContext } from "@/features/project/contexts/selectingContainerContext";
import { SelectingContext, SetSelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext, useState } from "react";
import { LayerDragginContext, SetLayerDraggingContext } from "../contexts/layerDragginContext";


export default function useLayer() {
    const project = useContext(ProjectContext);
    const [dragging, setDraggging] = useState("");

    return [project, dragging, setDraggging];

}

export function useComponent(path, isContainer) {
    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);
    const selectingContainer = useContext(SelectingContainerContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    const dragging = useContext(LayerDragginContext);
    const setDragging = useContext(SetLayerDraggingContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const screen = useContext(ScreenContext);
    
    
    const select = () => {
        setSelecting(path);
        if(isContainer) {
            setSelectingContainer(path);
        }
    }

    const dragStart = (e) => {
        e.stopPropagation();
        setDragging(path);
    }
    
    const drop = (e, uOrD) => {
        e.preventDefault();
        let container = project.screens[screen].components;
        const draggingPaths = dragging.split("/");
        let component = {}
        if(draggingPaths.length == 1) {
            component = container[draggingPaths[0]];
        } else if(draggingPaths.length = 2) {
            container = container[draggingPaths[0]];
            for(let i = 1; i < draggingPaths.length - 1; i++) {
                container = container.children[draggingPaths[i]];
            }
            component = container.children[draggingPaths[draggingPaths.length - 1]];
        }
        console.log(component);
        console.log(dragging, path);
        console.log(path.split("/"), uOrD)
        
        
    }
    
    const dragOver = (e) => {
        e.preventDefault();
    }
    
    return [select, dragStart, drop, dragOver]
}