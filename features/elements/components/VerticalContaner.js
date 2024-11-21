import Wrapper from "./Wrapper";


export default function VerticalContainer({ element, path }) {

    return (
        <div style={{width: "100%", height: "100%", border: "1px solid black", position: "relative", overflow: "hidden",
            display: "flex",flexDirection: "column", flexWrap: "wrap"
        }}>
            {element.children.map((value, index) => (
                <Wrapper element={value} layout="vertical" key={index} path={`${path}/${index}`}/>
            ))}
        </div>
    )

}
