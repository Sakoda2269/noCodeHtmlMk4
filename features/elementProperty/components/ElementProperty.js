"use client"
import { useState } from "react";
import useProperties from "../hooks/useProperties"
import styles from "./ElementProperty.module.css"
import { Collapse } from "react-bootstrap";
import useProperty from "../hooks/useProperty";
import useScreenProperty from "../hooks/useScreenProperty";
import { Tab, Tabs } from "react-bootstrap";

export default function ElementProperty() {

    const [properties, selecting, deleteComponent, componentType] = useProperties();
    const [tabKey, setTabKey] = useState("properties");

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {selecting &&
                <div className={styles.all}>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={tabKey}
                        onSelect={setTabKey}
                    >
                        <Tab eventKey={"properties"} title="プロパティ">
                            <div style={{ paddingTop: "10px" }}>
                                <h5>Component</h5>
                                {Object.entries(properties).map(([key, value]) => (
                                    <Property key={key} property={value} name={key} path={key} />
                                ))}
                            </div>
                        </Tab>
                        <Tab eventKey={"actions"} title="アクション">
                            <div style={{ paddingTop: "10px" }}>
                                <h5>Acctions</h5>
                                <div>
                                    {componentType == "button" && <ButtonActions />}
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                    <button
                        className={`btn btn-danger ${styles.deleteButton}`}
                        onClick={deleteComponent}
                    >
                        delete
                    </button>
                </div>}
            {!selecting && <div className={styles.all}>
                <h3>Screen</h3>
                <ScreenProperty property={"title"} />
            </div>
            }
        </div>
    )
}

function ScreenProperty({ property }) {

    const [propData, onChange] = useScreenProperty(property)

    return (
        <div className={styles.propertyContainer}>
            <div className={styles.propertyName}>
                <label className="form-label">{property}</label>
            </div>
            <div>
                <input type="text" value={propData} onChange={onChange} className="form-control" />
            </div>
        </div>
    )

}

function Property({ name, property, path }) {

    const [isOpen, setOpen] = useState(false);
    const [propData, onChange] = useProperty(path);

    return (
        <div className={styles.propertyContainer}>
            <div className={styles.propertyName}>
                {property.type == "string" && <label className="form-label">{name}</label>}
                {property.type == "object" && <button
                    className={styles.groupButton}
                    onClick={() => { setOpen(!isOpen); }}
                    aria-controls="properties"
                    aria-expanded={isOpen}
                    style={{ width: "100%" }}
                >
                    {isOpen ? <>△</> : <>▽</>}{name}
                </button>}
            </div>
            <div>
                {property.type == "string" &&
                    <input
                        type="text"
                        value={propData}
                        onChange={onChange}
                        className="form-control" />}
                {property.type == "object" &&
                    <Collapse in={isOpen}>
                        <div id="properties">
                            {Object.entries(property.value).map(([key, value]) => (
                                <Property
                                    name={key}
                                    key={key}
                                    property={value}
                                    path={`${path}/${key}`} />
                            ))}
                        </div>
                    </Collapse>
                }
            </div>
        </div>
    )

}

function ButtonActions() {
    
    const pad10 = {padding: "10px", width: "100%"}
    
    return (
        <div>
            <div style={pad10}>
                <label className="form-label">navigation</label>
                <select style={{width: "100%"}} className="form-select">
                    <option value="">なし</option>
                    <option value="screen1">screen1</option>
                </select>
            </div>
            <div>save data</div>
            <div>get data</div>
        </div>
    )
}