"use client"
import { SelectingContext, SetSelectingContext } from "@/features/project/contexts/selectingContext";
import getNum from "@/utils/getNum";
import { useCallback, useContext, useEffect, useState } from "react";
import { Containers } from "../components/Wrapper";
import { SetSelectingContainerContext } from "@/features/project/contexts/selectingContainerContext";
import { ProjectContext, SetProjectContext } from "@/features/project/contexts/projectContext";
import { ScreenContext } from "@/features/project/contexts/screenContext";


export default function useWrapper(element, path) {

    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);
    const project = useContext(ProjectContext);
    const setProject = useContext(SetProjectContext);
    const screen = useContext(ScreenContext);
    const setSelectingContainer = useContext(SetSelectingContainerContext);

    const [position, setPosiont] = useState({
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
        
    }, [])

    const removeStyle = useCallback((key) => {
        const { [key]: value, ...other } = styles;
        setStyles(other)
    }, [styles])

    useEffect(() => {
        if(selecting === path) {
            setIsSelecting(true);
        } else {
            setIsSelecting(false);
        }
    }, [selecting, path]);

    useEffect(() => {
        setStyle("width", size.w + "px");
        setStyle("height", size.h + "px");
    }, [size, setStyle]);

    useEffect(() => {
        setStyle("top", position.y + "px");
        setStyle("left", position.x + "px");
    }, [position, setStyle])
    
    useEffect(() => {
        const res = {};
        Object.entries(element.data.styles.value).map(([key, value]) => {
            res[key] = value.value;
        });
        setStyles(res)
    }, [project])
    

    const select = (e) => {
        e.stopPropagation();
        setSelecting(path);
        if(Containers.hasOwnProperty(element.type)) {
            setSelectingContainer(path);
        }
    }


    return [styles, select, isSelecting, position, setPosiont, size, setSize];

}