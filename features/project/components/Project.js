"use client"
import { CenterBody, RightBody, Sidebar, SideBody, SideIcon, SideItem } from "../../sidebar/components/Sidebar";
import { FaPlus, FaDatabase, FaLayerGroup, FaGear } from "react-icons/fa6";
import Canvas from "../../canvas/components/Canvas";
import useProject from "../hooks";
import { ProjectContext, SetProjectContext } from "../contexts/projectContext";
import { ScreenContext, SetScreenContext } from "../contexts/screenContext";
import { SelectingContext, SetSelectingContext } from "../contexts/selectingContext";
import ElementsList from "@/features/elementsList/components/ElementsList";
import { SelectingContainerContext, SetSelectingContainerContext } from "../contexts/selectingContainerContext";
import Layer from "@/features/layer/components/Layer";
import ElementProperty from "@/features/elementProperty/components/ElementProperty";

export default function Project() {

    const [project, setProject, currentScreenId, setCurrentScreenId, selecting, setSelecting,
        selectingContainer, setSelectingContainer
    ] = useProject();


    return (
        <div>
            <ProjectContext.Provider value={project}>
            <SetProjectContext.Provider value={setProject}>
            <ScreenContext.Provider value={currentScreenId}>
            <SetScreenContext.Provider value={setCurrentScreenId}>
            <SelectingContext.Provider value={selecting}>
            <SetSelectingContext.Provider value={setSelecting}>
            <SelectingContainerContext.Provider value={selectingContainer}>
            <SetSelectingContainerContext.Provider value={setSelectingContainer}>
            <Sidebar>

                <SideItem>
                    <SideIcon>
                        <FaLayerGroup />
                    </SideIcon>
                    <SideBody>
                        <Layer />
                    </SideBody>
                </SideItem>

                <SideItem>
                    <SideIcon>
                        <FaPlus />
                    </SideIcon>
                    <SideBody>
                        <ElementsList />
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
                    <ElementProperty />
                </RightBody>

            </Sidebar>
            </SetSelectingContainerContext.Provider>
            </SelectingContainerContext.Provider>
            </SetSelectingContext.Provider>
            </SelectingContext.Provider>
            </SetScreenContext.Provider>
            </ScreenContext.Provider>
            </SetProjectContext.Provider>
            </ProjectContext.Provider>
        </div>
    )
}