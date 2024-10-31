"use client"
import { useState } from "react";
import useProperties from "../hooks/useProperties"
import styles from "./ElementProperty.module.css"
import { Collapse } from "react-bootstrap";
import useProperty from "../hooks/useProperty";

export default function ElementProperty() {
    
    const [properties] = useProperties();
    
    return (
        <div className={styles.all}>
            {Object.entries(properties).map(([key, value]) => (
                <Property key={key} property={value} name={key} path={key}/>
            ))}
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