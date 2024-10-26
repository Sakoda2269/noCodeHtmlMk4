"use client"
import useWrapper from "../hooks/useWrapper"
import AbsoluteContainer from "./AbsoluteContainer"
import Button from "./Button"


export default function Wrapper({ element, layout, path }) {

    const [styles, select, isSelecting, position, size] = useWrapper(element, path);

    const Elements = {
        button: Button,
    }

    const Containers = {
        absoluteContainer: AbsoluteContainer
    }

    const Element = {
        ...Elements, ...Containers
    }[element.type]

    switch(layout) {
        case "absolute":
            styles["position"] = "absolute";
            break;
    }


    return(
        <div style={{...styles}} onClick={select}>
            <Element element={element} path={path}/>
            {isSelecting && (
                <div style={{
                    left: "-2px",
                    top: "-2px",
                    width: size.w + 1 + "px",
                    height: size.h + 1 + "px",
                    position: "absolute",
                    border: "3px solid black"
                }}
                >
                </div>
            )
            }
            
        </div>
    )

}