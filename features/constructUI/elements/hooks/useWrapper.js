"use client"
import { SelectingContext, SetSelectingContext } from "@/features/constructUI/project/contexts/selectingContext";
import getNum from "@/utils/getNum";
import { useCallback, useContext, useEffect, useState } from "react";
import { Containers } from "../components/Wrapper";
import { SetSelectingContainerContext } from "@/features/constructUI/project/contexts/selectingContainerContext";
import { ProjectContext, SetProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { ScreenContext } from "@/features/constructUI/project/contexts/screenContext";


export default function useWrapper(element, path) {

    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const screen = useContext(ScreenContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);
    const [position, setPosition] = useState({
        x: getNum(element.data.styles.value.left.value),
        y: getNum(element.data.styles.value.top.value)
    });
    const [size, setSize] = useState({
        w: getNum(element.data.styles.value.width.value),
        h: getNum(element.data.styles.value.height.value)
    });
    const [styles, setStyles] = useState(() => {
        const res = {};
        Object.entries(element.data.styles.value).map(([key, value]) => {
            res[key] = value.value;
        });
        return res;
    });
    const [isSelecting, setIsSelecting] = useState(false);


    const setStyle = useCallback((key, value) => {
        setStyles((prevStyle) => ({
            ...prevStyle,
            [key]: value
        }));

        const prevProject = project;
        const paths = path.split("/");
        let component = prevProject.screens[screen].components;
        if(component.length == 0) {
            return;
        }
        for(let i = 0; i < paths.length; i++) {
            if(paths[i] == "") {
                break;
            }
            component = component[paths[i]];
            if(i != paths.length - 1) {
                component = component.children;
            }
        }
        component.data.styles.value = {
            ...component.data.styles.value,
            [key]: {
                type: "string",
                value: value
            }
        }
        setProject({...prevProject});
        
    }, [screen, path, project]);

    const removeStyle = useCallback((key) => {
        const { [key]: value, ...other } = styles;
        setStyles(other)
    }, [styles])

    useEffect(() => {
        if(selecting === path) {
            setIsSelecting(true);
            setPosition({
                x: getNum(element.data.styles.value.left.value),
                y: getNum(element.data.styles.value.top.value)
            })
            setSize({
                w: getNum(element.data.styles.value.width.value),
                h: getNum(element.data.styles.value.height.value)
            })
        } else {
            setIsSelecting(false);
        }
    }, [selecting, path]);

    useEffect(() => {
        setStyle("width", size.w + "px");
        setStyle("height", size.h + "px");
    }, [size]);

    useEffect(() => {
        setStyle("top", position.y + "px");
        setStyle("left", position.x + "px");
    }, [position])
    
    useEffect(() => {
        const res = {};
        Object.entries(element.data.styles.value).map(([key, value]) => {
            res[key] = value.value;
        });
        setStyles(res)
    }, [element])
    

    const select = (e) => {
        e.stopPropagation();
        setSelecting(path);
        if(Containers.hasOwnProperty(element.type)) {
            setSelectingContainer(path);
        }
    }


    return [styles, select, isSelecting, position, setPosition, size, setSize];

}