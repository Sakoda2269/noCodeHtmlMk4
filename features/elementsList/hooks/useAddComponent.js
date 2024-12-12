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
        const id = self.crypto.randomUUID();
        const data = {
            type: type,
            data: {
                id: {
                    type: "string",
                    value: id
                },
                styles: {
                    type: "object",
                    value: {
                        left: {
                            type: "string",
                            value: "10px"
                        },
                        top: {
                            type: "string",
                            value: "10px"
                        },
                        width: {
                            type: "string",
                            value: "100px"
                        },
                        height: {
                            type: "string",
                            value: "40px"
                        }
                    }
                }
            }
        };
        if (Containers.hasOwnProperty(type)) {
            data["children"] = [];
        } else {
            data.data["text"] = {
                type: "string",
                value: type
            };
        }
        if(type == "button") {
            data["actions"] = {
                "navigation": "",
                "setData": {},
                "getData": {}
            }
        }
        container.push(data);
        setProject((prevProject) => ({
            ...prevProject,
            [selectingScreen]: screen
        }));
    };
    return [addComponent];
}