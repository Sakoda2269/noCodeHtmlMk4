import Popup from "@/components/popup/popup";
import useAddDatabase from "../hooks/useAddDatabase"
import styles from "./AddDatabase.module.css"
import EditColumn from "./EditColumn";
import AddColumns from "./AddColumn";

export default function AddDatabas({ close, edit, name }) {

    const [
        pageNum, setPageNum, prevPage, nextPage,
        tableName, setTableName, url, setUrl, user, setUser, password, setPassword,
        createColOpen, setCreateColOpen, addColType, openAddColScreen,
        database, columns, setColumns
    ] = useAddDatabase(edit, name)

    const pad10 = { padding: "10px" };
    const border = { border: "1px solid black" }

    return (
        <div>
            <div className={styles.center}>
                {pageNum == 0 &&
                    <div>
                        <h3>Add table</h3>
                        <div>
                            <div style={pad10}>
                                <label className="form-label required">table name</label>
                                <input type="text" className="form-control" value={tableName} onChange={(e) => setTableName(e.target.value)} />
                            </div>
                            <div style={pad10}>
                                <label className="form-label">url</label>
                                <input type="text" className="form-control" value={url} onChange={(e) => setUrl(e.target.value)} />
                            </div>
                            <div style={pad10}>
                                <label className="form-label">user</label>
                                <input type="text" className="form-control" value={user} onChange={(e) => setUser(e.target.value)} />
                            </div>
                            <div style={pad10}>
                                <label className="form-label">password</label>
                                <input type="text" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                    </div>
                }
                {pageNum == 1 &&
                    <div>
                        <h3 style={pad10}>Add column</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th rowSpan="2" style={border}>name</th>
                                    {columns.map((value, index) => {
                                        if (value.type == "table") {
                                            return <td key={"a"+index} colSpan={value.columns.length} style={border}>{value.name}</td>
                                        } else {
                                            return <td key={"a"+index} rowSpan="2" style={border}>{value.name}</td>
                                        }
                                    })}
                                    <td rowSpan="4" style={border}>
                                        <div style={{paddingBottom: "10px"}}>
                                            <button className="btn btn-success" onClick={() => openAddColScreen(1)}>列を追加</button>
                                        </div>
                                        <div>
                                            <button className="btn btn-success" onClick={() => openAddColScreen(2)}>外部テーブルから列を追加</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    {database.columns.map((value, index) => {
                                        if (value.type == "table") {
                                            return (
                                                <>
                                                    {value.columns.map((value, index) => (
                                                        <td key={"b"+index} style={border}>{value.name}</td>
                                                    ))}
                                                </>
                                            )
                                        } else {
                                            return;
                                        }
                                    })}
                                </tr>
                                <tr>
                                    <th style={border}>type</th>
                                    {columns.map((value, index) => {
                                        if (value.type == "table") {
                                            return (
                                                <>
                                                    {value.columns.map((value, index) => (
                                                        <td key={"c"+index} style={border}>{value.type}</td>
                                                    ))}
                                                </>
                                            )
                                        } else {
                                            return <td key={"c"+index} style={border}>{value.type}</td>
                                        }
                                    })}
                                </tr>
                                <tr>
                                    <th style={border}>relation key</th>
                                    {columns.map((value, index) => {
                                        if (value.type == "table") {
                                            return <td key={"d" + index} colSpan={value.columns.length} style={border}>{value.relationKey}</td>
                                        } else {
                                            return <td key={"d" + index} style={border}></td>;
                                        }
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }
                {pageNum == 2 &&
                    <div>
                        ok
                    </div>
                }
            </div>
            <div className={styles.buttonContainer}>
                <button className="btn btn-secondary" onClick={[prevPage, close][1 * (pageNum == 0)]}>{["戻る", "閉じる"][1 * (pageNum == 0)]}</button>
                <button className="btn btn-primary" onClick={[nextPage, close][1 * (pageNum == 3)]}>{["次へ", "決定"][1 * (pageNum == 3)]}</button>
            </div>
            <Popup isOpen={createColOpen}>
                <AddColumns close={() => {setCreateColOpen(false)}} columns={columns} setColumns={setColumns} type={addColType}/>
            </Popup>
        </div>
    )
}