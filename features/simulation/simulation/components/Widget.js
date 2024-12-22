import { useState } from "react";


export default function Widget({widget, sendMessage}) {
    
    const type = widget.type;
    
    if(type == "button") {
        return <ButtonWidget widget={widget} sendMessage={sendMessage} />
    }
    
    if(type == "label") {
        return <LabelWidget widget={widget} sendMessage={sendMessage}/>
    }
    
    if(type == "textInput") {
        return <TextInputWidget widget={widget} sendMessage={sendMessage}/>
    }
    
    if(type == "table") {
        return <TableWidget widget={widget} sendMEssage={sendMessage} />
    }
    
    return <div></div>
}

function ButtonWidget({widget, sendMessage}) {
    const styles = widget.styles;
    const text = widget.text;
    const id = widget.id;
    
    const onPressed = (e) => {
        sendMessage(`{"method": "mouseEvent", "id": "${id}", "state": "1"}`);
    }
    
    const onReleased = (e) => {
        sendMessage(`{"method": "mouseEvent", "id": "${id}", "state": "0"}`);
    }
    
    return <button style={styles} onMouseUp={onReleased} onMouseDown={onPressed}>{text}</button>
}

function LabelWidget({widget, sendMessage}) {
    const styles = widget.styles;
    const text = widget.text;
    return <label style={styles}>{text}</label>
}

function TextInputWidget({widget, sendMessage}) {
    
    const [value, setValue] = useState("");
    const styles = widget.styles;
    const id = widget.id;
    
    const handleChange = (e) => {
        setValue(e.target.value);
        sendMessage(`{"method": "textEvent", "id": "${id}", "newText": "${e.target.value}"}`);
    }
    
    
    return <input type="text" style={styles} value={value} onChange={handleChange}/>
}

function TableWidget({widget, sendMEssage}) {
    const columns = widget.data.columns;
    const rows = widget.data.rows;
    return (
        <table style={widget.styles}>
            <thead>
                <tr>
                    {columns && columns.map((value, index) => (
                        <th key={"thead"+ index} style={{border: "1px solid black"}}>{value}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows && rows.map((value, index) => (
                    <tr key={"tb" + index}>
                        {value.map((v, i) => (
                            <td key={"tb" + index + i} style={{border: "1px solid black"}}>{v}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}