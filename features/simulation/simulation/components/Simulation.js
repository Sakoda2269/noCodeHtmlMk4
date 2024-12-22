"use client"

import useWebsocket from "../hooks/useWebsocket"
import Widget from "./Widget";

export default function Simulation() {
    
    const [receivedMessage, widgets, sendMessage] = useWebsocket();
    
    return (
        <div>
            {widgets && widgets.map((value, index) => (
                <Widget widget={value} key={"wid"+index} sendMessage={sendMessage}/>
            ))}
        </div>
    )
}