"use client"
import useMove from "../hooks/useMove";
import useSquare from "../hooks/useSquare";
import useWrapper from "../hooks/useWrapper"
import AbsoluteContainer from "./AbsoluteContainer"
import Button from "./Button"
import HorizontalContainer from "./HorizontalContainer";
import TextInput from "./TextInput";
import Label from "./TextLabel";
import VerticalContainer from "./VerticalContaner";

export const Elements = {
    button: Button,
    label: Label,
    textInput:TextInput
}

export const Containers = {
    absoluteContainer: AbsoluteContainer,
    horizontalContainer: HorizontalContainer,
    VerticalContainer: VerticalContainer
}


export default function Wrapper({ element, layout, path }) {

    const [styles, select, isSelecting, position, setPosiont, size, setSize] = 
        useWrapper(element, path);
    const [squares, squaresMoveStart, squaresMoves] = 
        useSquare(position, setPosiont, size, setSize);
    const [moveStart, move] = useMove(position, setPosiont);

    const Element = {
        ...Elements, ...Containers
    }[element.type]

    switch(layout) {
        case "absolute":
            styles["position"] = "absolute";
            break;
        case  "horizontal":
            break;
        case "vertical":
            break
    }

    return(
        <div style={{...styles, zIndex: "100"}} onClick={select}>
            <Element element={element} path={path}/>
            {isSelecting && (
                <span>
                <div style={{
                    left: "-4px",
                    top:  - 4 -size.h + "px",
                    width: size.w + 9 + "px",
                    height: size.h + 9 + "px",
                    position: "relative",
                    border: "2px solid black",
                }}
                onDragStart={moveStart}
                onDrag={move}
                onDragEnd={move}
                onClick={(e) => {e.preventDefault()}}
                draggable
                >
                </div>
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} style={{
                        position: "relative",
                        left: squares[index].x + "px",
                        top: squares[index].y + "px",
                        backgroundColor: "blue",
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%"
                    }}
                    onDragStart={squaresMoveStart}
                    onDrag={squaresMoves[index]}
                    onDragEnd={squaresMoves[index]}
                    draggable>
                    </div>
                ))}
                </span>
            )
            }
            
        </div>
    )

}