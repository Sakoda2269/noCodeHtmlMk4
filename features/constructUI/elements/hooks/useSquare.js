const { useState, useEffect } = require("react");


export default function useSquare(position, setPosition, size, setSize) {
    const [squares, setSquares] = useState();

    const minW = 20;
    const minH = 20;
    
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
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        let tmpX = e.pageX;
        let tmpY = e.pageY;
        if(dx > 0 && size.w < minW) {
            dx = 0;
            tmpX = mousePos.x;
        }
        if(dy > 0 && size.h < minH) {
            dy = 0;
            tmpY = mousePos.y;
        }
        setMousePos({x: tmpX, y: tmpY})
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
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        let tmpX = e.pageX;
        let tmpY = e.pageY;
        if(dx < 0 && size.w < minW) {
            dx = 0;
            tmpX = mousePos.x;
        }
        if(dy > 0 && size.h < minH) {
            dy = 0;
            tmpY = mousePos.y;
        }
        setMousePos({x: tmpX, y: tmpY})
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
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        let tmpX = e.pageX;
        let tmpY = e.pageY;
        if(dx > 0 && size.w < minW) {
            dx = 0;
            tmpX = mousePos.x;
        }
        if(dy < 0 && size.h < minH) {
            dy = 0;
            tmpY = mousePos.y;
        }
        setMousePos({x: tmpX, y: tmpY})
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
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        let tmpx = e.pageX;
        let tmpy = e.pageY;
        if(dx < 0 && size.w < minW) {
            dx = 0;
            tmpx = mousePos.x;
        }
        if(dy < 0 && size.h < minH) {
            dy = 0;
            tmpy = mousePos.y;
        }
        setMousePos({x: tmpx, y: tmpy})
        setSize({
            w: size.w + dx,
            h: size.h + dy
        })
    }

    return [squares, moveStart, [move0, move1, move2, move3]]
}