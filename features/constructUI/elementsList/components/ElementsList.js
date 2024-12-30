import { useState } from "react";
import { Collapse } from "react-bootstrap";

import styles from "./ElementsList.module.css"
import { Containers, Elements } from "@/features/constructUI/elements/components/Wrapper";
import useAddComponent from "../hooks/useAddComponent";


export default function ElementsList() {
    
    const [elementsOpen, setElementsOpen] = useState(true);
    const [containersOpen, setContainersOpen] = useState(false);

    const [addComponent] = useAddComponent();
    
    return (
        <div className={styles.container}>
                <button 
                onClick={() => {setElementsOpen(!elementsOpen)}}
                aria-controls="elements"
                aria-expanded={elementsOpen}
                className={`${styles.selectButton}`}
            >elements</button>
            <Collapse in={elementsOpen}>
                <div id="elements" className={styles.collapseContainer}>
                    {Object.entries(Elements).map(([key, value]) => (
                        <button key={key} className={styles.elementButton}
                            onClick={() => {addComponent(key)}}
                        >{key}</button>
                    ))}
                </div>
            </Collapse>
            
            {/* <button 
                onClick={() => {setContainersOpen(!containersOpen)}}
                aria-controls="container"
                aria-expanded={containersOpen}
                className={`${styles.selectButton}`}
            >containers</button>
            <Collapse in={containersOpen}>
                <div id="container" className={styles.collapseContainer}>
                    {Object.entries(Containers).map(([key, value]) => (
                        <button key={key} className={styles.elementButton}
                            onClick={() => {addComponent(key)}}
                        >{key}</button>
                    ))}
                </div>
            </Collapse> */}
                
        </div>
    )
    
}