"use client"
import { SelectingContext, SetSelectingContext } from "@/features/project/contexts/selectingContext";
import getNum from "@/utils/getNum";
import { useContext, useEffect, useState } from "react";


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

    useEffect(() => {
        if(selecting === path) {
            addStyle("border", "1px solid black");
            setIsSelecting(true);
        } else {
            removeStyle("border");
            setIsSelecting(false);
        }
    }, [selecting])

    const addStyle = (key, value) => {
        setStyles({
            ...styles,
            [key]: value
        });
    }

    const removeStyle = (key) => {
        const { [key]: value, ...other } = styles;
        setStyles(other)
    }

    const select = (e) => {
        e.stopPropagation();
        setSelecting(path);
    }


    return [styles, select, isSelecting, position, size];

}