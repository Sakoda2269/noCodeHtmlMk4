

export default function Button({ element }) {
    return (
        <button style={{width: "100%", height: "100%"}}>
            {element.data.text}
        </button>
    )
}