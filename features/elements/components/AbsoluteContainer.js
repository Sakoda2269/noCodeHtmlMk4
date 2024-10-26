import Wrapper from "./Wrapper";


export default function AbsoluteContainer({ element, path }) {


    return (
        <div style={{width: "100%", height: "100%", border: "1px solid black"}}>
            {element.children.map((value, index) => (
                <Wrapper element={value} layout="absolute" key={index} path={`${path}/${index}`}/>
            ))}
        </div>
    )

}
