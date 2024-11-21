

export default function TextInput({ element }) {
    return (
        <input type="text" style={{width: "100%", height: "100%"}} readOnly value={element.data.text.value}/>
    )
}