import Popup from "@/components/popup/popup";
import useAddDatabase from "../hooks/useAddDatabase"
import styles from "./AddDatabase.module.css"
import EditColumn from "./EditColumn";
import AddNormalColumns from "./AddNormalColumn";
import React from "react";
import AddForeignColumns from "./AddForeignColumns";
import usePageControl from "../hooks/usePageControl";

export default function AddDatabas({ close, edit, name }) {

    const [pageNum, setPageNum, nextPage, prevPage] = usePageControl();
    
    const [
        tableName, setTableName, url, setUrl, user, setUser, password, setPassword,
        createColOpen, setCreateColOpen, addColType, openAddColScreen,
        columns, setColumns, confirm, primaryKey, setPrimaryKey, editCol, setEditCol, project
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
                        <h3 style={pad10}>Columns</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>primary key</th>
                                    {columns.map((value, index) => {
                                        if(value.type == "table") {
                                            return <td colSpan={value.columns.length} key={"prim" + index} style={border}></td>
                                        } else {
                                            return <td key={"prim" + index} style={border}>
                                                <input type="radio" value={value.name} checked={primaryKey == value.name} onChange={(e) => {setPrimaryKey(e.target.value)}}/>
                                            </td>
                                        }
                                    })}
                                    <td rowSpan="5" style={border}>
                                        <div style={{paddingBottom: "10px"}}>
                                            <button className="btn btn-success" onClick={() =>{setEditCol(-1); openAddColScreen(1)}}>列を追加</button>
                                        </div>
                                        <div>
                                            <button className="btn btn-success" onClick={() => {setEditCol(-1);openAddColScreen(2)}}>外部テーブルから列を追加</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th rowSpan="2" style={border}>name</th>
                                    {columns.map((value, index) => {
                                        if (value.type == "table") {
                                            return <td key={"a"+index} colSpan={value.columns.length} style={border}>
                                                <button className="btn" style={{width: "100%", height: "100%"}} onClick={() => {setEditCol(index); openAddColScreen(2)}}>{value.name}</button>
                                            </td>
                                        } else {
                                            return <td key={"a"+index} rowSpan="2" style={border}>
                                                <button className="btn" style={{width: "100%", height: "100%"}} onClick={() => {setEditCol(index);openAddColScreen(1)}}>{value.name}</button>
                                            </td>
                                        }
                                    })}
                                </tr>
                                <tr>
                                    {columns.map((value, index) => {
                                        if (value.type == "table") {
                                            return (
                                                <React.Fragment key={"e"+index}>
                                                    {value.columns.map((v, index) => (
                                                        <td key={"b"+index} style={border}>{project.databases[value.name].columns[v].name}</td>
                                                    ))}
                                                </React.Fragment>
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
                                                <React.Fragment key={"e"+index}>
                                                    {value.columns.map((v, index) => (
                                                        <td key={"b"+index} style={border}>{project.databases[value.name].columns[v].type}</td>
                                                    ))}
                                                </React.Fragment>
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
                                            return <td key={"d" + index} colSpan={value.columns.length} style={border}>{value.name}.{value.relationKey}</td>
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
                <button className="btn btn-primary" onClick={[() => {if(tableName=="")alert("必須項目を入力してください");else nextPage()}, () => {confirm(close);}][1 * (pageNum == 1)]}>{["次へ", "決定"][1 * (pageNum == 1)]}</button>
            </div>
            <Popup isOpen={createColOpen}>
                {addColType == 1 && 
                    <AddNormalColumns close={() => {setCreateColOpen(false)}} columns={columns} setColumns={setColumns} type={addColType} edit={editCol}/>
                }
                {addColType == 2 &&
                    <AddForeignColumns close={() => {setCreateColOpen(false)}} columns={columns} setColumns={setColumns} type={addColType} edit={editCol}/>
                }
            </Popup>
        </div>
    )
}