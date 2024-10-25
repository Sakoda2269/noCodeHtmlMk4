import { useContext } from "react";
import { ProjectContext } from "../project/contexts/projectContext";
import { ScreenContext } from "../project/contexts/screenContext";


export default function useCanvas() {
    const project = useContext(ProjectContext);
    const currentScreenId = useContext(ScreenContext);
    return [project, currentScreenId];
}