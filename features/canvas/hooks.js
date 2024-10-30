import { useContext } from "react";
import { ProjectContext } from "../project/contexts/projectContext";
import { ScreenContext } from "../project/contexts/screenContext";
import { SetSelectingContext } from "../project/contexts/selectingContext";
import { SetSelectingContainerContext } from "../project/contexts/selectingContainerContext";


export default function useCanvas() {
    const project = useContext(ProjectContext);
    const currentScreenId = useContext(ScreenContext);
    const setSelecting = useContext(SetSelectingContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    const resetSelecting = (e) => {
        e.stopPropagation();
        setSelecting("");
        setSelectingContainer("");
    }
    return [project, currentScreenId, resetSelecting];
}