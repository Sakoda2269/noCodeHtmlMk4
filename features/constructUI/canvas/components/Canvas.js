"use client"
import Wrapper from "@/features/constructUI/elements/components/Wrapper";
import useCanvas from "../hooks"
import styles from "./Canvas.module.css"
import { useEffect, useRef, useState } from "react";


export default function Canvas() {

    const [curScreen, resetSelecting, loading] = useCanvas();
    const [height, setHeight] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.offsetHeight); // 高さを状態にセット
            console.log(ref.current.offsetHeight);
        }
    }, [])
    
    return(
        <div className={styles.all}>
            <div className={styles.canvasContaienr}>
                <div className={styles.canvas} onClick={resetSelecting} ref={ref}>
                    {!loading && curScreen.components.map((value, index) => (
                        <Wrapper element={value} layout="absolute" key={index} path={`${index}`}/>
                    ))}
                </div>
            </div>
            <div className={styles.footer}>
            </div>
        </div>
    )
}