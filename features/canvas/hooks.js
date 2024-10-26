import { useContext } from "react";
import { ProjectContext } from "../project/contexts/projectContext";
import { ScreenContext } from "../project/contexts/screenContext";
import { SetSelectingContext } from "../project/contexts/selectingContext";


export default function useCanvas() {
    const project = useContext(ProjectContext);
    const currentScreenId = useContext(ScreenContext);
    const setSelecting = useContext(SetSelectingContext);
    const resetSelecting = (e) => {
        e.stopPropagation();
        setSelecting("");

    }
    return [project, currentScreenId, resetSelecting];
}