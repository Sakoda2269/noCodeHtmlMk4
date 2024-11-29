import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext, SetScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContainerContext, SetSelectingContainerContext } from "@/features/project/contexts/selectingContainerContext";
import { SelectingContext, SetSelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";
import { LayerDragginContext, SetLayerDraggingContext } from "../contexts/layerDragginContext";


export default function useLayer() {
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    
    const [dragging, setDraggging] = useState("");
    
    
    const addScreen = () => {
        const name = "screen" + (project.screens.length + 1);
        setProject({
            ...project, 
            ["screens"]: [
                ...project.screens,
                {
                    title: name,
                    components: []
                }
            ]
        })
    }

    return [project, dragging, setDraggging, addScreen];

}

export function useComponent(path, isContainer, screenIndex) {
    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);
    const selectingContainer = useContext(SelectingContainerContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    const dragging = useContext(LayerDragginContext);
    const setDragging = useContext(SetLayerDraggingContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const screen = useContext(ScreenContext);
    const setScreen = useContext(SetScreenContext);
    
    const [dragOn, setDragOn] = useState(false);
    const [buttomDragOn, setButtomDragOn] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [buttonBorder, setButtomBorder] = useState("1px solid black");
    
    const select = () => {
        setSelecting(path);
        setScreen(screenIndex)
        if(isContainer) {
            setSelectingContainer(path);
        }
    }
    
    useEffect(() => {
        setIsSelecting(selecting == path && screenIndex == screen);
        if(selecting == path && screenIndex == screen) {
            setButtomBorder("3px solid red");
        } else {
            setButtomBorder("1px solid black");
        }
    }, [selecting, screen])
    
    const dragStart = (e) => {
        e.stopPropagation();
        setDragging(path);
    }
    
    const drop = (e, uOrD) => {
        e.preventDefault();
        setDragOn(false);
        setButtomDragOn(false);
        let container = project.screens[screen].components;
        const draggingPaths = dragging.split("/");
        let component = {}
        if(draggingPaths.length == 1) {
            component = container[draggingPaths[0]];
            // container.splice(draggingPaths[0], 1);
        } else if(draggingPaths.length = 2) {
            container = container[draggingPaths[0]];
            for(let i = 1; i < draggingPaths.length - 1; i++) {
                container = container.children[draggingPaths[i]];
            }
            component = container.children[draggingPaths[draggingPaths.length - 1]];
            container = container.children;
            // container.children.splice(draggingPaths[draggingPaths.length - 1], 1);
        }
        const containerPaths = path.split("/");
        let container2 = project.screens[screen].components;
        let insertId = "";
        let containerId = "";
        if(containerPaths.length == 1) {

        } else {
            container2 = container2[containerPaths[0]];
            for(let i = 1; i < containerPaths.length - 1; i++) {
                container2 = container2.children[containerPaths[i]];
            }
            containerId = container2.data.id.value;
            container2 = container2.children;
        }
        
        if(uOrD == "u") {
            insertId = container2[containerPaths[containerPaths.length - 1]].data.id.value;
        } else {
            if(containerPaths[0] != ""){
                containerId = container2[containerPaths[containerPaths.length - 1]].data.id.value;
                container2 = container2[containerPaths[containerPaths.length - 1]].children;
            }
        }

        const id = component.data.id.value;
        if(id === containerId) {
            return;
        }
        if(id === insertId) {
            return;
        }
        let delNum = 0;
        for(let i = 0; i < container.length; i++) {
            if(container[i].data.id.value == id) {
                delNum = i;
                break;
            }
        }
        container.splice(delNum, 1);
        if (uOrD == "u") {
            for(let i = 0; i < container2.length; i++) {
                if(container2[i].data.id.value == insertId) {
                    container2.splice(i, 0, component);
                    break;
                }
            }
        } else {
            container2.push(component);
        }
        setProject({...project});
        setSelecting("");
        setSelectingContainer("");
    }
    
    const dragOver = (e) => {
        e.preventDefault();
    }
    
    const dragEnter = (e) => {
        setDragOn(true);
    }
    
    const dragLeave = (e) => {
        setDragOn(false);
    }
    
    const buttomDragEnter = (e) => {
        setButtomDragOn(true);
    }
    
    const buttomDragLeave = (e) => {
        setButtomDragOn(false);
    }
    
    return [
            select, dragStart, drop, dragOver, 
            dragOn, dragEnter, dragLeave, buttomDragOn, 
            buttomDragEnter, buttomDragLeave, isSelecting, buttonBorder
        ];
}