import { useState } from "react";
import useLayer, { useAddComponent, useComponent } from "../hooks/useLayer";
import styles from "./Layer.module.css";
import { Collapse } from "react-bootstrap";
import { LayerDragginContext, SetLayerDraggingContext } from "../contexts/layerDragginContext";

export default function Layer() {

    const [project, dragging, setDragging] = useLayer();
    
    return (
        <LayerDragginContext.Provider value={dragging}>
            <SetLayerDraggingContext.Provider value={setDragging}>
                <div style={{widht: "100%", height: "100%", padding: "10px"}}>
                    <div className={styles.container}>
                        {project.screens.map((screen, index) => (
                            <Component key={index} component={screen} depth={0} inIndex={index} path=""/>
                        ))}
                    </div>
                </div>
            </SetLayerDraggingContext.Provider>
        </LayerDragginContext.Provider>
    )
}

function Component({component, depth, inIndex, path}) {

    const [isOpen, setOpen] = useState(false);

    const children = depth == 0 ? component.components : component.children;
    
    const [select, dragStart, drop, dragOver] = useComponent(path, children);
    
    return (
        <div className={styles.component}>
                {depth != 0 &&
                    <div style={{width: "100%", height: "15px"}} 
                        onDragOver={dragOver}
                        onDrop={(e) => drop(e, "u")}>
                    </div>}
                <div draggable="true" onDragStart={dragStart}>
                    {depth == 0 ? (
                        <button 
                            style={{width: "100%"}}
                            onClick={() => {setOpen(!isOpen);select()}}
                            aria-controls="children"
                            aria-expanded={isOpen}
                        >
                            {component.title}
                        </button>
                    ) : (
                        <button 
                            style={{width: "100%"}}
                            onClick={() => {setOpen(!isOpen);select();}}
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
                                    }/>
                                    
                            ))}
                            <div style={{width: "90%", height: "15px", backgroundColor: "red"}} 
                                onDragOver={dragOver}
                                onDrop={(e) => drop(e, "d")}>
                            </div>
                        </div>
                    </Collapse>}
                </div>
        </div>
    )
}