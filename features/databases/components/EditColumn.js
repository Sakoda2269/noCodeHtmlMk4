import { useContext } from "react";
import useEditColumns from "../hooks/useEditColumsn"
import styles from "./EditColumn.module.css"
import { ProjectContext } from "@/features/project/contexts/projectContext";
export default function EditColumn({ col, setCols, colNum, close, name}) {

    const [
        colData, setName, setType, setDefault, setConstraint, foreignTable, changeForeignTable, foreignColName, changeForeignColName, confirm
    ] = useEditColumns(col, setCols, colNum);

    const project = useContext(ProjectContext);

    return (
        <div>
            <div style={{ paddingBottom: "10px" }}>
                <label className="form-label required">Name</label>
                <input type="text" className="form-control" value={colData["name"]} onChange={setName} />
            </div>

            <div style={{ paddingBottom: "10px" }}>
                
                <label className="form-label required">Type</label><br />
                {foreignColName == "" ? 
                <select value={colData["type"]} className="btn border-secondary dropdown-toggle" onChange={setType}>
                    <option value={""} disabled>選択してください</option>
                    <option value={"integer"}>integer</option>
                    <option value={"text"}>text</option>
                </select>:
                <select value={colData["type"]} className="btn border-secondary dropdown-toggle" disabled>
                    <option value={"integer"}>integer</option>
                    <option value={"text"}>text</option>
                </select>
                }
            </div>

            <div style={{ paddingBottom: "10px" }}>
                <label className="form-label">Constraint</label><br />
                <div>
                    <label className={styles.checkBox}>
                    {foreignColName == "" ? 
                        <input type="checkbox" name="notNull" checked={colData["constraint"].includes("notNull")} onChange={setConstraint} />:
                        <input type="checkbox" name="notNull" checked={colData["constraint"].includes("notNull")} disabled readOnly />
                    }
                        not Null
                    </label>
                    <label>
                    {foreignColName == "" ? 
                        <input type="checkbox" name="unique" checked={colData["constraint"].includes("unique")} onChange={setConstraint} />:
                        <input type="checkbox" name="unique" checked={colData["constraint"].includes("unique")} disabled readOnly />
                    }
                        unique
                    </label>
                </div>
            </div>

            <div style={{ paddingBottom: "10px", display: "flex"}}>
                <div>
                    <label className="form-label">Relation</label><br />
                    <select value={foreignTable} className="btn border-secondary dropdown-toggle" onChange={changeForeignTable}>
                        <option value={""}>選択しない</option>
                        {Object.entries(project.databases).map(([key, value]) => {
                            if(name != key) {
                                return <option value={key} key={key}>{key}</option>
                            }
                        }
                        )}
                    </select>
                    {foreignTable != "" &&
                        <select value={foreignColName} className="btn border-secondary dropdown-toggle" onChange={changeForeignColName}>
                        <option value={""} disabled>選択してください</option>
                        {Object.entries(project.databases[foreignTable].columns).map(([key, value]) => (
                            <option value={value.name} key={key}>{value.name}</option>
                        ))}
                    </select>}
                </div>
            </div>

            <div style={{ paddingBottom: "10px" }}>
                <label className="form-label">Default</label>
                {foreignColName == "" ? 
                <input type="text" className="form-control" value={colData["default"]} onChange={setDefault} />:
                <input type="text" className="form-control" value={colData["default"]} disabled readOnly />
                }
            </div>

            <div className={styles.buttonContainer}>
                <div>
                    <button
                        className="btn btn-secondary"
                        style={{ marginTop: "20px", textAlign: "left" }}
                        onClick={close}
                    >閉じる</button>
                </div>
                <div>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: "20px", textAlign: "right" }}
                        onClick={() => {confirm(close);}}
                    >決定</button>
                </div>
            </div>
        </div>
    )
}
