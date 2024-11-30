import useAddDatabase from "../hooks/useAddDatabase"
import styles from "./AddDatabase.module.css"
import EditColumn from "./EditColumn";

export default function AddDatabas({ close, edit, name }) {

    const [
        pageNum, nextPage, prevPage, setPageNum,
        url, changeURL, user, changeUser, password, changePassword, useDatabase, changeDatabase, tableName, changeTableName,
        columns, setColumns, primaryKeys, changePrimaryKey, confirm, deleteColumn
    ] = useAddDatabase(edit, name);

    return (
        <div >
            <h3>
                Add Table
            </h3>
            {pageNum == 0 && (
                <div className={styles.mainContainer}>
                    <div className={styles.left}>
                    </div>
                    <div className={styles.center}>
                        <div style={{ paddingBottom: "10px" }}>
                            <label className="form-label required">table name</label>
                            <input type="text" className="form-control" value={tableName} onChange={changeTableName} />
                        </div>
                        <div style={{ paddingBottom: "10px" }}>
                            <label className="form-label">url</label>
                            <input type="text" className="form-control" value={url} onChange={changeURL} />
                        </div>
                        <div style={{ paddingBottom: "10px" }}>
                            <label className="form-label">user</label>
                            <input type="text" className="form-control" value={user} onChange={changeUser} />
                        </div>
                        <div style={{ paddingBottom: "10px" }}>
                            <label className="form-label">password</label>
                            <input type="text" className="form-control" value={password} onChange={changePassword} />
                        </div>
                        <div style={{ paddingBottom: "10px" }}>
                            <label className="form-label">database</label>
                            <br />
                            <select className="btn border-secondary dropdown-toggle" value={useDatabase} onChange={changeDatabase}>
                                <option value="">選択しない</option>
                                <option value="postgresql">PostgreSQL</option>
                                <option value="mysql">MySQL</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <button className="btn" style={{ fontSize: "40px" }} onClick={nextPage}>&gt;</button>
                    </div>
                </div>
            )}
            {pageNum == 1 && (
                <div className={styles.mainContainer}>
                    <div className={styles.left}>
                        <button className="btn" style={{ fontSize: "40px" }} onClick={prevPage}>&lt;</button>
                    </div>
                    <div className={styles.center}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ borderRight: "3px solid black" }}>
                                        <div style={{ textAlign: "center" }}>
                                            primary Key
                                        </div>
                                    </th>
                                    {columns.map((value, index) => (
                                        <th key={index} style={{ borderRight: "1px solid black" }}>
                                            <div style={{ textAlign: "center" }}>
                                                <input
                                                    type="checkbox"
                                                    name={value.name}
                                                    checked={primaryKeys.includes(value.name)}
                                                    onChange={changePrimaryKey} />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                <tr>
                                    <th style={{ borderRight: "3px solid black" }}>
                                        <div style={{ textAlign: "center" }}>
                                            column name
                                        </div>
                                    </th>
                                    {columns.map((value, index) => (
                                        <th key={index} style={{ borderRight: "1px solid black" }}>
                                            <button
                                                className={styles.tableHeaderButton}
                                                style={{ color: primaryKeys.includes(value.name) ? "red" : "black" }}
                                            >{value.name}</button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ borderRight: "3px solid black" }}>
                                        type
                                    </td>
                                    {columns.map((value, index) => (
                                        <td key={index} style={{ borderRight: "1px solid black" }}>
                                            {value.type}
                                        </td>
                                    ))}
                                    <td rowSpan="4">
                                        <button className={styles.addButton} onClick={() => setPageNum(3)}>
                                            +
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ borderRight: "3px solid black" }}>
                                        constraint
                                    </td>
                                    {columns.map((value, index) => (
                                        <td key={index} style={{ borderRight: "1px solid black" }}>
                                            {value.constraint.join(", ")}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td style={{ borderRight: "3px solid black" }}>
                                        relation
                                    </td>
                                    {columns.map((value, index) => (
                                        <td key={index} style={{ borderRight: "1px solid black" }}>
                                            {value.foreignKey}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td style={{ borderRight: "3px solid black" }}>
                                        delete
                                    </td>
                                    {columns.map((value, index) => (
                                        <td key={index} style={{ borderRight: "1px solid black" }}>
                                            <button className="btn btn-danger" onClick={() => deleteColumn(index)}>削除</button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.right}>
                    </div>
                </div>
            )}
            {pageNum == 3 && (
                <div>
                    <EditColumn
                        colName={""}
                        setCols={setColumns}
                        colNum={-1}
                        close={() => setPageNum(1)}
                        name={name}
                    />
                </div>

            )}
            {[0, 1].includes(pageNum) && 
            <div className={styles.buttonContainer}>
                <button
                    className="btn btn-secondary"
                    style={{ marginTop: "20px" }}
                    onClick={close}
                >閉じる</button>
                <button
                    className="btn btn-primary"
                    style={{ marginTop: "20px" }}
                    onClick={() => {
                        confirm(close)
                    }}
                >決定</button>
            </div>
            }

        </div>
    )
}
