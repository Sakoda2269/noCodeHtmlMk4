const { useState, useEffect } = require("react");


export default function useSquare(position, setPosition, size, setSize) {
    const [squares, setSquares] = useState();

    useEffect(() => {
        setSquares(
            [
                {
                    x: -8,
                    y: -2*size.h - 16
                },
                {
                    x: size.w - 2,
                    y: -2*size.h - 26
                },
                {
                    x: -8,
                    y: -size.h - 28
                },
                {
                    x: size.w - 2,
                    y: -size.h - 36
                }
            ]
        )
    }, [size])

    const [mousePos, setMousePos] = useState({x: 0, y: 0});

    const moveStart = (e) => {
        setMousePos({x: e.pageX, y: e.pageY});
    }

    const move0 = (e) => {
        const dx = e.pageX - mousePos.x;
        const dy = e.pageY - mousePos.y;
        setMousePos({x: e.pageX, y: e.pageY})
        setPosition({
            x: position.x + dx,
            y: position.y + dy
        });
        setSize({
            w: size.w - dx,
            h: size.h - dy
        })

    }
    const move1 = (e) => {
        const dx = e.pageX - mousePos.x;
        const dy = e.pageY - mousePos.y;
        setMousePos({x: e.pageX, y: e.pageY})
        setPosition({
            x: position.x,
            y: position.y + dy
        });
        setSize({
            w: size.w + dx,
            h: size.h - dy
        })
    }
    const move2 = (e) => {
        const dx = e.pageX - mousePos.x;
        const dy = e.pageY - mousePos.y;
        setMousePos({x: e.pageX, y: e.pageY})
        setPosition({
            x: position.x + dx,
            y: position.y
        });
        setSize({
            w: size.w - dx,
            h: size.h + dy
        })
    }
    const move3 = (e) => {
        const dx = e.pageX - mousePos.x;
        const dy = e.pageY - mousePos.y;
        setMousePos({x: e.pageX, y: e.pageY})
        setSize({
            w: size.w + dx,
            h: size.h + dy
        })
    }

    return [squares, moveStart, [move0, move1, move2, move3]]
}