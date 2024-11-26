"use client"
import { useState } from "react";
import useProperties from "../hooks/useProperties"
import styles from "./ElementProperty.module.css"
import { Collapse } from "react-bootstrap";
import useProperty from "../hooks/useProperty";
import useScreenProperty from "../hooks/useScreenProperty";

export default function ElementProperty() {
    
    const [properties, selecting, deleteComponent] = useProperties();
    
    return (
        <div style={{width: "100%", height: "100%"}}>
            {selecting && <div className={styles.all}>
                <h3>Component</h3>
                {Object.entries(properties).map(([key, value]) => (
                    <Property key={key} property={value} name={key} path={key}/>
                ))}
                <button 
                    className={`btn btn-danger ${styles.deleteButton}`}
                    onClick={deleteComponent}
                >
                    delete
                </button>
            </div>}
            {!selecting && <div className={styles.all}>
                <h3>Screen</h3>
                <ScreenProperty property={"title"}/>
            </div>
            }
        </div>
    )
}

function ScreenProperty({property}) {
    
    const [propData, onChange] = useScreenProperty(property)
    
    return (
        <div className={styles.propertyContainer}>
            <div className={styles.propertyName}>
                <label className="form-label">{property}</label>
            </div>
            <div>
                <input type="text" value={propData} onChange={onChange} className="form-control"/>
            </div>
        </div>
    )
    
}

function Property({name, property, path}) {
    
    const [isOpen, setOpen] = useState(false);
    const [propData, onChange] = useProperty(path);
     
    return(
        <div className={styles.propertyContainer}>
            <div className={styles.propertyName}>
                {property.type=="string" && <label className="form-label">{name}</label>}
                {property.type=="object" && <button 
                    className={styles.groupButton}
                    onClick={() => {setOpen(!isOpen);}}
                    aria-controls="properties"
                    aria-expanded={isOpen}
                    style={{width: "100%"}}
                >
                    {isOpen ? <>△</> : <>▽</>}{name}
                </button>}
            </div>
            <div>
                {property.type=="string" && 
                    <input
                        type="text" 
                        value={propData} 
                        onChange={onChange}
                        className="form-control"/>}
                {property.type=="object" && 
                    <Collapse in={isOpen}>
                    <div id="properties">
                        {Object.entries(property.value).map(([key, value]) => (
                            <Property 
                                name={key} 
                                key={key} 
                                property={value} 
                                path={`${path}/${key}`}/>
                        ))}
                    </div>
                    </Collapse>
                }
            </div>
        </div>
    )
    
}