import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../project/contexts/projectContext";
import { ScreenContext } from "../project/contexts/screenContext";
import { SetSelectingContext } from "../project/contexts/selectingContext";
import { SetSelectingContainerContext } from "../project/contexts/selectingContainerContext";
import { LoadingContext, SetLoadingContext } from "../project/contexts/loadingContext";


export default function useCanvas() {
    const project = useContext(ProjectContext);
    const currentScreenId = useContext(ScreenContext);
    const setSelecting = useContext(SetSelectingContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    const [curScreen, setCurScreen] = useState(project.screens[currentScreenId]);
    const loading = useContext(LoadingContext);
    const SetLoading = useContext(SetLoadingContext);
    
    useEffect(() => {
        setCurScreen(project.screens[currentScreenId])
        SetLoading(false);
    }, [currentScreenId, project])

    const resetSelecting = (e) => {
        e.stopPropagation();
        setSelecting("");
        setSelectingContainer("");
    }
    return [curScreen, resetSelecting, loading];
}