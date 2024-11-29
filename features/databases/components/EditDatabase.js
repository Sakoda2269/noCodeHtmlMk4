import styles from "./EditDatabase.module.css"

export default function EditDatabase({ database }) {

    const isForeignKey = (foreingKeys, columnName) => {
        for(let key of foreingKeys) {
            if (columnName == key[0]) {
                return key[1];
            }
        }
        return "";
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th style={{ borderRight: "3px solid black" }}>
                            <div style={{ textAlign: "center" }}>
                                column name
                            </div>
                        </th>
                        {database.columns.map((value, index) => (
                            <th key={index} style={{ borderRight: "1px solid black" }}>
                                <button
                                    className={styles.tableHeaderButton}
                                    style={{ color: database.primaryKey.includes(value.name) ? "red" : "black" }}
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
                        {database.columns.map((value, index) => (
                            <td key={index} style={{ borderRight: "1px solid black" }}>
                                {value.type}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td style={{ borderRight: "3px solid black" }}>
                            constraint
                        </td>
                        {database.columns.map((value, index) => (
                            <td key={index} style={{ borderRight: "1px solid black" }}>
                                {value.constraint.join(", ")}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td style={{ borderRight: "3px solid black" }}>
                            relation
                        </td>
                        {database.columns.map((value, index) => (
                            <td key={index} style={{ borderRight: "1px solid black" }}>
                                {isForeignKey(database.foreignKey, value.name)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <div style={{ padding: "20px" }}></div>
            <div style={{ padding: "5px" }}>
                url:&nbsp;&nbsp;&nbsp;{database.url}
            </div>
            <div style={{ padding: "5px" }}>
                user:&nbsp;&nbsp;&nbsp;{database.url}
            </div>
            <div style={{ padding: "5px" }}>
                password:&nbsp;&nbsp;&nbsp;{database.url}
            </div>
            <div style={{ padding: "5px" }}>
                database:&nbsp;&nbsp;&nbsp;{database.database}
            </div>
        </div>
    )
}