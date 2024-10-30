import { Containers } from "@/features/elements/components/Wrapper";
import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";
import { SelectingContainerContext } from "@/features/project/contexts/selectingContainerContext";
import { useContext } from "react";


export default function useAddComponent() {
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const selectingContainer = useContext(SelectingContainerContext);
    const selectingScreen = useContext(ScreenContext);

    const addComponent = (type) => {
        const screen = project.screens[selectingScreen];
        const paths = selectingContainer.split("/");
        let container = screen.components;
        for(const path of paths) {
            if(path === '') {
                break;
            }
            container = container[path].children;
        }
        const data = {
            type: type,
            data: {
                styles: {
                    left: "10px",
                    top: "10px",
                    width: "100px",
                    height: "40px"
                }
            }
        };
        if (Containers.hasOwnProperty(type)) {
            data["children"] = [];
        } else {
            data.data["text"] = type;
        }
        container.push(data);
        setProject((prevProject) => ({
            ...prevProject,
            [selectingScreen]: screen
        }));
    };
    return [addComponent];
}