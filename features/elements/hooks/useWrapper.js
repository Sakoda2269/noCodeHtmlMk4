"use client"
import { SelectingContext, SetSelectingContext } from "@/features/project/contexts/selectingContext";
import getNum from "@/utils/getNum";
import { useCallback, useContext, useEffect, useState } from "react";


export default function useWrapper(element, path) {

    const selecting = useContext(SelectingContext);
    const setSelecting = useContext(SetSelectingContext);

    const [position, setPosiont] = useState({
        x: getNum(element.data.styles.left),
        y: getNum(element.data.styles.top)
    });
    const [size, setSize] = useState({
        w: getNum(element.data.styles.width),
        h: getNum(element.data.styles.height)
    });
    const [styles, setStyles] = useState({ ...element.data.styles });
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
    }


    return [styles, select, isSelecting, position, setPosiont, size, setSize];

}