import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function useWebsocket() {
    const [message, setMessage] = useState("");
    const socketRef = useRef()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    // #0.WebSocket関連の処理は副作用なので、useEffect内で実装
    useEffect(() => {
        // #1.WebSocketオブジェクトを生成しサーバとの接続を開始
        const websocket = new WebSocket('ws://localhost:8080/ws')
        socketRef.current = websocket

        const onOpen = (event) => {
            console.log("ws connect!");
            websocket.send(id);
        }

        // #2.メッセージ受信時のイベントハンドラを設定
        const onMessage = (event) => {
            setMessage(event.data)
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

    const sendMessage = () => {
        if (socketRef.current) {
            socketRef.current.send("hello");
        }
    }


    return [message, sendMessage]
}