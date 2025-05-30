"use client"
import { CenterBody, RightBody, Sidebar, SideBody, SideIcon, SideItem } from "../../sidebar/components/Sidebar";
import { FaPlus, FaDatabase, FaLayerGroup, FaGear, FaTable } from "react-icons/fa6";
import { AiOutlineFunction } from "react-icons/ai";
import Canvas from "../../canvas/components/Canvas";
import useProject from "../hooks";
import { ProjectContext, SetProjectContext } from "../contexts/projectContext";
import { ScreenContext, SetScreenContext } from "../contexts/screenContext";
import { SelectingContext, SetSelectingContext } from "../contexts/selectingContext";
import ElementsList from "@/features/constructUI/elementsList/components/ElementsList";
import { SelectingContainerContext, SetSelectingContainerContext } from "../contexts/selectingContainerContext";
import Layer from "@/features/constructUI/layer/components/Layer";
import ElementProperty from "@/features/constructUI/elementProperty/components/ElementProperty";
import Variables from "@/features/constructUI/variables/components/Variables";
import Databases from "@/features/constructUI/databases/components/Databases";
import { LoadingContext, SetLoadingContext } from "../contexts/loadingContext";
import Header from "@/features/constructUI/header/component/Header";
import { useEffect, useRef, useState } from "react";
import { TrieDeleteContext, TrieFindContext, TrieInsertContext } from "../contexts/trieContext";

export default function Project({pid}) {

    const [project, setProject, currentScreenId, setCurrentScreenId, selecting, setSelecting,
        selectingContainer, setSelectingContainer, loading, setLoadin, connecting,
        trieInsert, trieDelete, autoComplete, exists
    ] = useProject(pid);
    
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    
    useEffect(() => {
        // ページを離れる前に確認するためのイベントリスナーを設定
        const handleBeforeUnload = (event) => {
          const message = "このページを離れますか？未保存の変更が失われる可能性があります。";
          event.returnValue = message; // Chrome, Firefox 用
          return message; // 古いブラウザや一部ブラウザ用
        };
        
        if(ref.current) {
            setHeight(ref.current.offsetHeight);
        }
    
        window.addEventListener('beforeunload', handleBeforeUnload, true);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload, true);
        };
      }, []);


    return (
        <div ref={ref}>
            <ProjectContext.Provider value={project}>
            <SetProjectContext.Provider value={setProject}>
            <ScreenContext.Provider value={currentScreenId}>
            <SetScreenContext.Provider value={setCurrentScreenId}>
            <SelectingContext.Provider value={selecting}>
            <SetSelectingContext.Provider value={setSelecting}>
            <SelectingContainerContext.Provider value={selectingContainer}>
            <SetSelectingContainerContext.Provider value={setSelectingContainer}>
            <LoadingContext.Provider value={loading}>
            <SetLoadingContext.Provider value={setLoadin}>
            <TrieInsertContext.Provider value={trieInsert}>
            <TrieDeleteContext.Provider value={trieDelete}>
            <TrieFindContext.Provider value={[exists, autoComplete]}>
                
            <Header pid={pid} allHeightRef={ref}/>
            {!connecting && 
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
                        <Databases />
                    </SideBody>
                </SideItem>
                
                {/* <SideItem>
                    <SideIcon>
                        <AiOutlineFunction />
                    </SideIcon>
                    <SideBody>
                        <Variables />
                    </SideBody>
                </SideItem> */}

                <CenterBody>
                    <Canvas />
                </CenterBody>

                <RightBody>
                    <ElementProperty />
                </RightBody>

            </Sidebar>
            }
            {connecting && <div>loading...</div>}
            
            </TrieFindContext.Provider>
            </TrieDeleteContext.Provider>
            </TrieInsertContext.Provider>
            </SetLoadingContext.Provider>
            </LoadingContext.Provider>
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