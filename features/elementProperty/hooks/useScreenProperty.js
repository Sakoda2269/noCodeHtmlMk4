import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { useContext, useState } from "react";

export default function useScreenProperty(property) {
    const screen = useContext(ScreenContext)
    const project = useContext(ProjectContext)
    const setProject = useContext(SetProjectContext)
    
    const [prop, onPropChange] = useState(project.screens[screen][property]);
    
    const onChange = (e) => {
        let tmp = e.target.value;
        onPropChange(tmp)
        const newProject = {...project};
        newProject.screens[screen][property] = tmp;
        setProject(newProject)
    }
    
    return [prop, onChange]
}