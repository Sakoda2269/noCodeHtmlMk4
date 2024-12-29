import { ProjectContext, SetProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { ScreenContext } from "@/features/constructUI/project/contexts/screenContext";
import { useContext, useEffect, useState } from "react";

export default function useScreenProperty(property) {
    const screen = useContext(ScreenContext)
    const project = useContext(ProjectContext)
    const setProject = useContext(SetProjectContext)
    
    const [prop, setProp] = useState(project.screens[screen][property]);
    const [startName, setStartName] = useState("");
    
    
    const onChange = (e) => {
        let tmp = e.target.value;
        setProp(tmp)
    }
    
    const onBlur = (e) => {
        let tmp = e.target.value;
        if(tmp == "") {
            setProp(startName);
        } else {
            const newProject = {...project};
            newProject.screens[screen][property] = tmp;
            setProject(newProject)
        }
    }
    
    const onFocus = (e) => {
        setStartName(e.target.value);
    }
    
    useEffect(() => {
        setProp(project.screens[screen][property]);
    }, [screen])
    
    return [prop, onChange, onFocus, onBlur]
}