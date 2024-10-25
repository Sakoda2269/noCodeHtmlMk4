"use client"
import { CenterBody, RightBody, Sidebar, SideBody, SideIcon, SideItem } from "../../sidebar/components/Sidebar";
import { FaPlus, FaDatabase, FaLayerGroup, FaGear } from "react-icons/fa6";
import Canvas from "../../canvas/components/Canvas";
import useProject from "../hooks";
import { ProjectContext, SetProjectContext } from "../contexts/projectContext";
import { ScreenContext, SetScreenContext } from "../contexts/screenContext";

export default function Project() {

    const [project, setProject, currentScreenId, setCurrentScreenId] = useProject();


    return (
        <div>
            <ProjectContext.Provider value={project}>
            <SetProjectContext.Provider value={setProject}>
            <ScreenContext.Provider value={currentScreenId}>
            <SetScreenContext.Provider value={setCurrentScreenId}>
            <Sidebar>

                <SideItem>
                    <SideIcon>
                        <FaLayerGroup />
                    </SideIcon>
                    <SideBody>
                        bad
                    </SideBody>
                </SideItem>

                <SideItem>
                    <SideIcon>
                        <FaPlus />
                    </SideIcon>
                    <SideBody>
                        hello
                    </SideBody>
                </SideItem>

                <SideItem>
                    <SideIcon>
                        <FaDatabase />
                    </SideIcon>
                    <SideBody>
                        ok
                    </SideBody>
                </SideItem>

                <CenterBody>
                    <Canvas />
                </CenterBody>

                <RightBody>
                    fuga
                </RightBody>

            </Sidebar>
            </SetScreenContext.Provider>
            </ScreenContext.Provider>
            </SetProjectContext.Provider>
            </ProjectContext.Provider>
        </div>
    )
}