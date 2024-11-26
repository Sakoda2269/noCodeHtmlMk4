import { useState } from "react";
import useLayer, { useAddComponent, useComponent } from "../hooks/useLayer";
import styles from "./Layer.module.css";
import { Collapse } from "react-bootstrap";
import { LayerDragginContext, SetLayerDraggingContext } from "../contexts/layerDragginContext";
import { SetProjectContext } from "@/features/project/contexts/projectContext";

export default function Layer() {

    const [project, dragging, setDragging, addScreen] = useLayer();
    
    return (
        <LayerDragginContext.Provider value={dragging}>
            <SetLayerDraggingContext.Provider value={setDragging}>
                <div style={{widht: "100%", height: "100%", padding: "10px", overflowY: "auto"}}>
                    <div className={styles.container}>
                        {project.screens.map((screen, index) => (
                            <Component key={index} component={screen} depth={0} inIndex={index} path="" screenIndex={index}/>
                        ))}
                    </div>
                    <div style={{textAlign: "center", padding: "10px"}}>
                        <button style={{width: "100%"}} onClick={addScreen}>add screen</button>
                    </div>
                </div>
            </SetLayerDraggingContext.Provider>
        </LayerDragginContext.Provider>
    )
}

function Component({component, depth, inIndex, path, screenIndex}) {

    const [isOpen, setOpen] = useState(true);

    const children = depth == 0 ? component.components : component.children;
    
    const [
            select, dragStart, drop, dragOver, 
            dragOn, dragEnter, dragLeave, buttomDragOn, 
            buttomDragEnter, buttomDragLeave, isSelecting
        ] = useComponent(path, children, screenIndex);
        
    const collapseOpen = () => {
        console.log(isSelecting)
        if(isOpen && isSelecting) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }
    
    return (
        <div className={styles.component}>
                {depth != 0 &&
                    <div style={{width: "100%", height: "15px"}}
                        className={`${dragOn ? styles.dragOn : ""}`} 
                        onDragOver={dragOver}
                        onDragEnter={dragEnter}
                        onDragLeave={dragLeave}
                        onDrop={(e) => drop(e, "u")}>
                    </div>}
                <div draggable="true" onDragStart={dragStart}>
                    {depth == 0 ? (
                        <button 
                            className={styles.layerButton}
                            onClick={() => {
                                collapseOpen();
                                select();
                            }}
                            aria-controls="children"
                            aria-expanded={isOpen}
                        >
                            {component.title}
                        </button>
                    ) : (
                        <button 
                            className={styles.layerButton}
                            onClick={() => {
                                collapseOpen();
                                select();
                            }}
                            aria-controls="children"
                            aria-expanded={isOpen}
                        >
                            {component.data.id.value}
                        </button>
                    )}
                    {children && <Collapse in={isOpen}>
                        <div className={styles.container} id="children">
                            {children.map((child, index) => (
                                <Component 
                                    key={index} 
                                    component={child} 
                                    depth={depth+1} 
                                    inIndex={index} 
                                    path={
                                        depth == 0 ? index+"" : path + "/" + index
                                    }
                                    screenIndex={screenIndex}/>
                                    
                            ))}
                            <div style={{width: "90%", height: "15px"}}
                                className={`${buttomDragOn ? styles.dragOn : ""}`}
                                onDragOver={dragOver}
                                onDragEnter={buttomDragEnter}
                                onDragLeave={buttomDragLeave}
                                onDrop={(e) => drop(e, "d")}>
                            </div>
                        </div>
                    </Collapse>}
                </div>
        </div>
    )
}