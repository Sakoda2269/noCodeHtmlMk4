import useAddDatabase from "../hooks/useAddDatabase"
import styles from "./AddDatabase.module.css"

export default function AddDatabas() {

    const [
        pageNum, nextPage, prevPage,
        url, changeURL, user, changeUser, password, changePassword, useDatabase, changeDatabase,
        columns, setColumns, primaryKeys, setPrimaryKeys, foreignKeys, setForeingKeys
    ] = useAddDatabase();

    const isForeignKey = (foreingKeys, columnName) => {
        for (let key of foreingKeys) {
            if (columnName == key[0]) {
                return key[1];
            }
        }
        return "";
    }

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
                                        <button className={styles.addButton}>
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
                                            {isForeignKey(foreignKeys, value.name)}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.right}>
                        <button className="btn" style={{ fontSize: "40px" }} onClick={nextPage}>&gt;</button>
                    </div>
                </div>
            )}
            {pageNum == 2 && (
                <div className={styles.mainContainer}>
                    <div className={styles.left}>
                        <button className="btn" style={{ fontSize: "40px" }} onClick={prevPage}>&lt;</button>
                    </div>
                    <div className={styles.center}>
                        bad
                    </div>
                    <div className={styles.right}>
                    </div>
                </div>
            )}
        </div>
    )
}
