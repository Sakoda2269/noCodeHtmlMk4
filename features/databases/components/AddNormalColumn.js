import useAddNormalColmun from "../hooks/useAddNormalColmun";
import usePageControl from "../hooks/usePageControl"
import styles from "./AddDatabase.module.css"

export default function AddNormalColumns({ close, columns, setColumns, edit, pkey }) {

    const [
        colName, changeColName, colType, changeColType, colDefault, 
        changeColDefault, confirm, deleteColumn
    ] = useAddNormalColmun(setColumns, columns, edit, pkey);

    const pad10 = { padding: "10px" };

    return (
        <div>
            <h3>Add column</h3>
            <div className={styles.center}>
                <div style={pad10}>
                    <label className="form-label required">name</label>
                    <input type="text" className="form-control" value={colName} onChange={changeColName} />
                </div>
                <div style={pad10}>
                    <label className="form-label required">type</label>
                    <select className="form-select" value={colType} onChange={changeColType}>
                        <option disabled value={""}>select...</option>
                        <option value={"integer"}>integer</option>
                        <option value={"text"}>text</option>
                    </select>
                </div>
                <div style={pad10}>
                    <label className="form-label">default</label>
                    <input type="text" className="form-control" value={colDefault} onChange={changeColDefault} />
                </div>
                {edit != -1 && <div style={{textAlign: "center"}}>
                    <button className="btn btn-danger" onClick={() => deleteColumn(close)}>削除</button>
                </div>}
            </div>
            <div className={styles.buttonContainer}>
                <button className="btn btn-secondary" onClick={close}>閉じる</button>
                <button className="btn btn-primary" onClick={() => {confirm(close)}}>決定</button>
            </div>
        </div>
    )
}