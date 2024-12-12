import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext, useEffect, useState } from "react";

export default function useActions() {
    const selectingScreen = useContext(ScreenContext);
    const selecting = useContext(SelectingContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    
    const [navigation, setNavigation] = useState("");
    
    useEffect(() => {
        const paths = selecting.split("/");
        let component = project.screens[selectingScreen].components;
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
        setNavigation(component.actions.navigation);
    }, [selectingScreen, selecting])
    
    const selectNavigation = (e) => {
        setNavigation(e.target.value);
        const value = e.target.value;
        const paths = selecting.split("/");
        let component = project.screens[selectingScreen].components;
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
        component.actions.navigation = e.target.value;
        setProject({...project});
    }
    
    return [selectingScreen, project, navigation, selectNavigation];
}