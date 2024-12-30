import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function useWebsocket() {
    const [message, setMessage] = useState("");
    const [widgets, setWidgets] = useState({});
    const socketRef = useRef()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8080/ws')
        socketRef.current = websocket

        const onOpen = (event) => {
            console.log("ws connect!");
            websocket.send(`{"method": "connect", "id": "${id}"}`);
        }

        const onMessage = (event) => {
            setMessage(event.data)
            console.log(event.data)
            const message = JSON.parse(event.data);
            console.log(message);
            const method = message.method;
            if(method == "updateHtml") {
                const addWidgets = message.data.add;
                const widgets = {};
                for(const widget of addWidgets) {
                    widgets[widget.id] = widget;
                }
                console.log(widgets)
                setWidgets(widgets);
            }else if(method == "changeText") {
                setWidgets((prev) => {
                    prev[message.id].text = message.datas.newText;
                    return {...prev};
                })
            }
        }
        websocket.addEventListener('message', onMessage)
        websocket.addEventListener("open", onOpen);
        websocket.addEventListener("close", (e) => console.log("ws close"))

        // #3.useEffectのクリーンアップの中で、WebSocketのクローズ処理を実行
        return () => {
            websocket.close()
            websocket.removeEventListener('message', onMessage)
        }
    }, []);

    const sendMessage = (message) => {
        if (socketRef.current) {
            socketRef.current.send(message);
        }
    }


    return [message, widgets, sendMessage]
}