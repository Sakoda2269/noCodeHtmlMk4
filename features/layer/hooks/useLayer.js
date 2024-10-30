import { ProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContainerContext, SetSelectingContainerContext } from "@/features/project/contexts/selectingContainerContext";
import { SelectingContext, SetSelectingContext } from "@/features/project/contexts/selectingContext";
import { useContext } from "react";


export default function useLayer() {
    const project = useContext(ProjectContext);

    return [project];

}

export function useComponent(path, isContainer) {
    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);
    const selectingContainer = useContext(SelectingContainerContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    const select = () => {
        setSelecting(path);
        if(isContainer) {
            setSelectingContainer(path);
        }
    }

    return [select]
}