import AbsoluteContainer from "./AbsoluteContainer"
import Button from "./Button"


export default function Wrapper({ element, layout }) {

    const Elements = {
        button: Button,
    }

    const Containers = {
        absoluteContainer: AbsoluteContainer
    }

    const Element = {
        ...Elements, ...Containers
    }[element.type]

    const styles = {...element.data.styles};
    switch(layout) {
        case "absolute":
            styles["position"] = "absolute";
            break;
    }


    return(
        <div style={{...styles}}>
            <Element element={element}/>
        </div>
    )

}