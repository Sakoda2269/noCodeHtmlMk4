import { useState } from "react";

export default function useMove(position, setPosition) {

    const [mousePos, setMousePos] = useState({x: 0, y: 0});

    const moveStart = (e) => {
        setMousePos({
            x: e.pageX,
            y: e.pageY
        })
    }

    const move = (e) => {
        const dx = e.pageX - mousePos.x;
        const dy = e.pageY - mousePos.y;
        setMousePos({
            x: e.pageX,
            y: e.pageY
        });
        setPosition({
            x: position.x + dx,
            y: position.y + dy
        })
    }

    return [moveStart, move];

}