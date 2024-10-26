"use client"
import Wrapper from "@/features/elements/components/Wrapper";
import useCanvas from "../hooks"
import styles from "./Canvas.module.css"


export default function Canvas() {

    const [project, currentScreenId, resetSelecting] = useCanvas();

    return(
        <div className={styles.all}>
            <div className={styles.canvasContaienr}>
                <div className={styles.canvas} onClick={resetSelecting}>
                    {project.screens[currentScreenId].components.map((value, index) => (
                        <Wrapper element={value} layout="absolute" key={index} path={`${index}`}/>
                    ))}
                </div>
            </div>
            <div className={styles.footer}>
            </div>
        </div>
    )
}