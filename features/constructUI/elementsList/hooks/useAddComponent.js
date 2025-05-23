import { Containers } from "@/features/constructUI/elements/components/Wrapper";
import { ProjectContext, SetProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { ScreenContext } from "@/features/constructUI/project/contexts/screenContext";
import { SelectingContainerContext } from "@/features/constructUI/project/contexts/selectingContainerContext";
import { useContext } from "react";
import { TrieInsertContext } from "../../project/contexts/trieContext";


export default function useAddComponent() {
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const selectingContainer = useContext(SelectingContainerContext);
    const selectingScreen = useContext(ScreenContext);
    const trieInsert = useContext(TrieInsertContext);
    
    const addComponent = (type) => {
        const newProject = {...project}
        const screen = newProject.screens[selectingScreen];
        const paths = selectingContainer.split("/");
        let container = screen.components;
        for(const path of paths) {
            if(path === '') {
                break;
            }
            container = container[path].children;
        }
        let id = self.crypto.randomUUID().replace(/-/g, '');
        id = "w" + id;
        trieInsert(id);
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
                            value: "60px"
                        },
                        height: {
                            type: "string",
                            value: "24px"
                        },
                        fontSize: {
                            type: "string",
                            value: "10px"
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
                "setData": {
                    "target": "",
                    "datas": {},
                    "success": "",
                    "fail": ""
                },
                "updateData": {
                    "target": "",
                    "datas": {},
                    "success": "",
                    "fail": ""
                },
                "deleteData": {
                    "target": "",
                    "datas": {},
                    "success": "",
                    "fail": ""
                },
                "getData": {}
            }
        }
        if(type == "table") {
            data["other"] = {
                "source": "",
                "columns": [],
                "rowName": 1,
                "rowHeight": "40px"
            }
        }
        container.push(data);
        setProject(newProject);
    };
    return [addComponent];
}