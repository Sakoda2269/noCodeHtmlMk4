"use client"
import Wrapper from "@/features/elements/components/Wrapper";
import useCanvas from "../hooks"
import styles from "./Canvas.module.css"


export default function Canvas() {

    const [project, currentScreenId] = useCanvas();

    return(
        <div className={styles.all}>
            <div className={styles.canvasContaienr}>
                <div className={styles.canvas}>
                    {Object.entries(project.screens[currentScreenId].components).map(([key, value]) => (
                        <Wrapper element={value} layout="absolute" key={key}/>
                    ))}
                </div>
            </div>
            <div className={styles.footer}>
            </div>
        </div>
    )
}