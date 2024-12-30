import { ProjectContext, SetProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { ScreenContext, SetScreenContext } from "@/features/constructUI/project/contexts/screenContext";
import { useContext, useEffect, useState } from "react";
import { SetSelectingContext } from "../../project/contexts/selectingContext";
import { SetSelectingContainerContext } from "../../project/contexts/selectingContainerContext";

export default function useScreenProperty(property) {
    const screen = useContext(ScreenContext)
    const project = useContext(ProjectContext)
    const setProject = useContext(SetProjectContext)
    const setScreen = useContext(SetScreenContext);
    const setSelecting = useContext(SetSelectingContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    
    const [prop, setProp] = useState(project.screens[screen][property]);
    const [startName, setStartName] = useState("");
    const [lastOne, setLastOne] = useState(project.screens.length > 1);
    
    
    const onChange = (e) => {
        let tmp = e.target.value;
        setProp(tmp)
    }
    
    const onBlur = (e) => {
        let newName = e.target.value;
        if(newName == "") {
            setProp(startName);
        } else {
            if(newName == startName) {
                return;
            }
            const newProject = {...project};
            newProject.screens[screen][property] = newName;
            delete newProject.screenNames[startName];
            newProject.screenNames[newName] = 1;
            setProject(newProject)
        }
    }
    
    const onEnter = (e) => {
        if(e.key == "Enter") {
            e.target.blur();
        }
    }
    
    const onFocus = (e) => {
        setStartName(e.target.value);
    }
    
    const deleteScreen = () => {
        setSelecting("");
        setScreen("0");
        setSelectingContainer("");
        const newProject = {...project};
        newProject.screens.splice(Number(screen), 1);
        delete newProject.screenNames[screen];
        setProject(newProject);
    }
    
    useEffect(() => {
        setProp(project.screens[screen][property]);
    }, [screen])
    
    useEffect(() => {
        setLastOne(project.screens.length > 1);
    }, [project])
    
    return [prop, onChange, onFocus, onBlur, deleteScreen, lastOne, onEnter]
}