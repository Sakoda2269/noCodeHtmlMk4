"use client"
import { SelectingContext, SetSelectingContext } from "@/features/project/contexts/selectingContext";
import getNum from "@/utils/getNum";
import { useCallback, useContext, useEffect, useState } from "react";
import { Containers } from "../components/Wrapper";
import { SetSelectingContainerContext } from "@/features/project/contexts/selectingContainerContext";


export default function useWrapper(element, path) {

    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);
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

    const select = (e) => {
        e.stopPropagation();
        setSelecting(path);
        if(Containers.hasOwnProperty(element.type)) {
            setSelectingContainer(path);
        }
    }


    return [styles, select, isSelecting, position, setPosiont, size, setSize];

}