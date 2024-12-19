export default function Table({ element }) {
    const rowNumTmp = [];
    for (let i = 0; i < parseInt(element.other.rowNum); i++) {
        rowNumTmp.push("");
    }
    
    return (
        <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <table>
                <caption style={{captionSide: "top", textAlign: "center"}}>{element.data.text.value}</caption>
                <thead>
                    <tr style={{height: element.other.rowHeight}}>
                        {element.other.columns.map((value, index) => (
                            <th key={"thead" + index} style={{ border: "1px solid black" }}>{value}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rowNumTmp.map((value, index) => (
                        <tr key={"tbody" + index} style={{height: element.other.rowHeight}}>
                            {element.other.columns.map((value, index2) => (
                                <th key={"tbodycol" + index + index2} style={{ border: "1px solid black" }}></th>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}