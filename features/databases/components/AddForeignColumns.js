import useAddForeignColumns from "../hooks/useAddForeignColumns";
import usePageControl from "../hooks/usePageControl";
import styles from "./AddDatabase.module.css"


export default function AddForeignColumns({ close, colmuns, setColumns }) {

    const [foreignTable, setForeignTable, selectedColumns, setSelectedColumns, foreignColumns, databases, confirm] = useAddForeignColumns(setColumns);

    const pad10 = { padding: "10px" };

    return (
        <div>
            <h3>Add foreign column</h3>
            <div className={styles.center}>
                <div style={pad10}>
                    <label className="form-label">foreign table</label>
                    <select className="form-select" onChange={(e) => setForeignTable(e.target.value)} value={foreignTable}>
                        <option value="" disabled>select...</option>
                        {Object.keys(databases).map((value, index) => (
                            <option value={value} key={index}>{value}</option>
                        ))}
                    </select>
                </div>
                {foreignTable != "" && <div style={pad10}>
                    {foreignColumns && foreignColumns.columns.map((value, index) => (
                        <div style={pad10} key={index}>
                            <label className="form-label">
                                <input type="checkbox" name={value.name} value={index} checked={selectedColumns.includes(index)} onChange={
                                    (e) => {
                                        const value = parseInt(e.target.value, 10);
                                        const checked = e.target.checked;
                                        if (checked) {
                                            setSelectedColumns((prev) => [...prev, value]);
                                        }else {
                                            setSelectedColumns((prev) => {
                                                const res = [];
                                                for(const col of prev) {
                                                    if (col != value) {
                                                        res.push(col);
                                                    }
                                                }
                                                return res;
                                            })
                                        }
                                    }
                                }/>
                                {value.name}
                            </label>
                        </div>
                    ))}
                </div>}
            </div>
            <div className={styles.buttonContainer}>
                <button className="btn btn-secondary" onClick={close}>閉じる</button>
                <button className="btn btn-primary" onClick={() => {confirm(); close(); }}>決定</button>
            </div>
        </div>
    )
}