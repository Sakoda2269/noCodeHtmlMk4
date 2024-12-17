"use client"
import { useState } from "react";
import useProperties from "../hooks/useProperties"
import styles from "./ElementProperty.module.css"
import { Collapse } from "react-bootstrap";
import useProperty from "../hooks/useProperty";
import useScreenProperty from "../hooks/useScreenProperty";
import { Tab, Tabs } from "react-bootstrap";
import useNavigateAction from "../hooks/useNavigateAction";
import useSetDataAction from "../hooks/useSetDataAction";
import usePopup from "../hooks/usePopup";
import Popup from "@/components/popup/popup";
import useTableData from "../hooks/useTableData";

export default function ElementProperty() {

    const [properties, selecting, deleteComponent, componentType, actions, otherData, setOtherData] = useProperties();
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
                        <Tab eventKey={"actions"} title="アクション" style={{ width: "100%" }}>
                            <div style={{ paddingTop: "10px", width: "100%" }}>
                                <h5>Acctions</h5>
                                {componentType == "button" && <ButtonActions actions={actions} />}
                                <input type="text" style={{ visibility: "hidden" }} />
                            </div>
                        </Tab>
                        <Tab eventKey={"otehr"} title="その他" style={{width: "100%"}}>
                        <div style={{ paddingTop: "10px", width: "100%" }}>
                                <h5>Others</h5>
                                {componentType == "table" && <TableSourceSetting data={otherData} setData={setOtherData}/>}
                            </div>
                        </Tab>
                    </Tabs>
                    <button
                        className={`btn btn-danger ${styles.deleteButton}`}
                        onClick={deleteComponent}
                    >
                        delete
                    </button>
                    <br />
                    <br />
                    <br />
                    <br />
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
    const [propData, onChange, selectOptions] = useProperty(path);

    return (
        <div className={styles.propertyContainer}>
            <div className={styles.propertyName}>
                {(["string", "integer", "select"].includes(property.type)) && <label className="form-label">{name}</label>}
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
                {property.type == "integer" && 
                    <input 
                        type="number"
                        value={propData}
                        onChange={onChange}
                        className="form-control" />
                    }
                {property.type == "select" && 
                    <select 
                        value={propData}
                        onChange={onChange}
                        className="form-select">
                            <option value="" disabled>選択してください...</option>
                            {selectOptions.map((value, index) => (
                                <option value={value} key={"select" + index}>{value}</option>
                            ))}
                        </select>
                }
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

function ButtonActions({ actions }) {


    return (
        <div className={styles.propertyContainer}>
            <NavigateAction />
            <SetDataAction actions={actions} />
        </div>
    )
}

function NavigateAction() {

    const [selectingScreen, project, navigation, selectNavigation] = useNavigateAction();

    return (
        <div>
            <div className={styles.propertyName}>
                <h6>navigation</h6>
            </div>
            <div style={{ width: "100%" }}>
                <select style={{ width: "100%" }} className="form-select" value={navigation} onChange={selectNavigation}>
                    <option value="">なし</option>
                    {project.screens.map((value, index) => {
                        if (index != selectingScreen) {
                            return <option value={value.title} key={"navigate" + index}>{value.title}</option>
                        } else {
                            return;
                        }
                    })}
                </select>
            </div>
        </div>
    )
}

function SetDataAction({ actions }) {

    const [
        databases, selectedDatabase, onChangeDatabases, columns, columnStates, changeColumnStates,
        screens, successNavigation, setSuccessNavigation, fialNavigation, setFailNavigation, confirm
    ] = useSetDataAction(actions);
    const [isOpen, setIsOpen, pageNum, nextPage, prevPage] = usePopup();
    const pad10 = { padding: "3px" }

    return (
        <div>
            <div className={styles.propertyName}>
                <h6>set data</h6>
            </div>
            <div>
                <button className="btn btn-secondary" onClick={() => setIsOpen(true)}>設定</button>
            </div>
            <Popup isOpen={isOpen}>
                {pageNum == 0 &&
                    <div style={{ width: "100%" }}>
                        <label className="form-label">table</label>
                        <select className="form-select" value={selectedDatabase} onChange={onChangeDatabases}>
                            <option value="">なし</option>
                            {databases.map((value, index) => (
                                <option value={value} key={"setDb" + index}>{value}</option>
                            ))}
                        </select>
                        {columns.map((value, index) => (
                            <div key={"columns" + index} style={pad10}>
                                <label className="form-label">{value}</label>
                                <input type="text" className="form-control" value={columnStates[value]} onChange={(e) => changeColumnStates(e, value)} />
                            </div>
                        ))}
                        <div className="bothSideButton" style={{paddingTop: "10px"}}>
                            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>閉じる</button>
                            <button className="btn btn-primary" onClick={nextPage}>次へ</button>
                        </div>
                    </div>
                }
                {pageNum == 1 && 
                    <div style={{width: "100%"}}>
                        <div style={pad10}>
                            <label className="form-label">成功時</label>
                            <select className="form-select" value={successNavigation} onChange={(e) => setSuccessNavigation(e.target.value)}>
                                <option value={""}>なし</option>
                                {screens.map((value, index) => (
                                    <option value={value} key={"successNav" + index}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div style={pad10}>
                            <label className="form-label">失敗時</label>
                            <select className="form-select" value={fialNavigation} onChange={(e) => setFailNavigation(e.target.value)}>
                                <option value={""}>なし</option>
                                {screens.map((value, index) => (
                                    <option value={value} key={"failNav" + index}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div className="bothSideButton" style={{paddingTop: "10px"}}>
                            <button className="btn btn-secondary" onClick={prevPage}>戻る</button>
                            <button className="btn btn-primary" onClick={() => {confirm();setIsOpen(false);prevPage();}}>決定</button>
                        </div>
                    </div>
                }
            </Popup>
        </div>
    )

}

function TableSourceSetting({data, setData}) {
    
    const [
        source, handleChangeSource, columns, handleChangeColumns, rowNum, handleChangeRowNum, sourceColums, databases,
        rowHeight, handleChangeRowHeight
    ] = useTableData(data, setData); 
    
    const pad10 = {"padding": "10px 0px"}
    
    return (
        <div>
            <div style={pad10}>
                <label className="form-label">ソース</label>
                <select className="form-select" value={source} onChange={handleChangeSource}>
                    <option value="" disabled>選択してください...</option>
                    {databases.map((value, index) => (
                        <option value={value} key={"source"+index}>{value}</option>
                    ))}
                </select>
            </div>
            {source != "" && <div style={pad10}>
                <label className="form-label">項目</label>
                {sourceColums.map((value, index) => (
                    <div key={"col" + index}>
                        <label className="form-label">
                            <input type="checkbox" onChange={handleChangeColumns} checked={columns.includes(value)} name={value} />
                            {value}
                        </label>
                    </div>
                ))}
            </div>}
            <div style={pad10}>
                <label className="form-label">表示する列数</label>
                <input type="number" className="form-control" value={rowNum} onChange={handleChangeRowNum} />
            </div>
            <div style={pad10}>
                <label className="form-label">列の高さ</label>
                <input type="text" className="form-control" value={rowHeight} onChange={handleChangeRowHeight} />
            </div>
        </div>
    )   
}
