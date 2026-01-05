import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebsocket() {
    const [message, setMessage] = useState("");
    const [widgets, setWidgets] = useState({widgets: {}, cache: {}});
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
                
                setWidgets(prev => {
                    const cache = prev.cache;
                    const widgets = {};
                    for(const widget of addWidgets) {
                        widgets[widget.id] = widget;
                        if (widget.id in prev.cache) {
                            widgets[widget.id].data = cache[widget.id];
                            delete cache[widget.id];
                        }
                    }
                    return {cache: cache, widgets: widgets}
                });
            }else if(method == "changeText") {
                setWidgets((prev) => {
                    prev.widgets[message.id].text = message.datas.newText;
                    return {...prev};
                })
            } else if(method == "updateTable") {
                setWidgets((prev) => {
                    const widgets = {...prev.widgets}
                    const cache = {...prev.cache};
                    if (widgets[message.id]) {
                        widgets[message.id].data = message.datas.nextTableData;
                    } else {
                        cache[message.id] = message.datas.nextTableData;
                    }
                    return {widgets: widgets, cache: cache};
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