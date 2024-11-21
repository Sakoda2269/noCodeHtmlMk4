import Wrapper from "./Wrapper";


export default function HorizontalContainer({ element, path }) {


    return (
        <div style={{width: "100%", height: "100%", border: "1px solid black", position: "relative", overflow: "hidden",
            display: "flex", flexWrap: "wrap", rowGap: "10px"
        }}>
            {element.children.map((value, index) => (
                <Wrapper element={value} layout="horizontal" key={index} path={`${path}/${index}`}/>
            ))}
        </div>
    )

}
