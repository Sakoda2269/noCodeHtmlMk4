"use client"

import useWebsocket from "../hooks/useWebsocket"
import Widget from "./Widget";

export default function Simulation() {
    
    const [receivedMessage, widgets, sendMessage] = useWebsocket();
    
    return (
        <div>
            {widgets.widgets && Object.entries(widgets.widgets).map(([key, value]) => (
                <Widget widget={value} key={"wid"+key} sendMessage={sendMessage}/>
            ))}
        </div>
    )
}