"use client"

import useWebsocket from "../hooks/useWebsocket"

export default function Simulation() {
    
    const [receivedMessage] = useWebsocket();
    
    return (
        <div>
            {receivedMessage}
        </div>
    )
}