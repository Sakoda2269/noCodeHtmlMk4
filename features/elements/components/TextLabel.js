

export default function Label({ element }) {
    return (
        <label style={{width: "100%", height: "100%"}}>
            {element.data.text.value}
        </label>
    )
}