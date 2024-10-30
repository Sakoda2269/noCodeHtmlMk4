import { useState } from "react";
import useLayer, { useAddComponent, useComponent } from "../hooks/useLayer";
import styles from "./Layer.module.css";
import { Collapse } from "react-bootstrap";

export default function Layer() {

    const [project] = useLayer();

    return (
        <div style={{widht: "100%", height: "100%", padding: "10px"}}>
            <div className={styles.container}>
                {project.screens.map((screen, index) => (
                    <Component key={index} component={screen} depth={0} index={index} path=""/>
                ))}
            </div>
        </div>
    )
}

function Component({component, depth, index, path}) {

    const [isOpen, setOpen] = useState(false);

    const children = depth == 0 ? component.components : component.children;
    
    const [select] = useComponent(path, children);

    return (
        <div className={styles.component}>
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
                    {component.type}{index}
                </button>
            )}
            <Collapse in={isOpen}>
                <div className={styles.container} id="children">
                    {children && children.map((child, index) => (
                        <Component 
                            key={index} 
                            component={child} 
                            depth={depth+1} 
                            index={index} 
                            path={
                                depth == 0 ? index+"" : path + "/" + index
                            }/>
                    ))}
                </div>
            </Collapse>
        </div>
    )
}