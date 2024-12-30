import useIdSuggestionInput from "./useIdSuggestion"

export default function IdSuggestionInput({ value, onChange, onBlur, onFocus, onKeyDown, setValue }) {

    const [handleChange, handleBlur, handleFocus,
         suggestions, selectedIndex, handleKeyDown, 
         focus, suggestClick] = useIdSuggestionInput(onChange, onBlur, onFocus, value, onKeyDown, setValue);

    return (
        <>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                style={{width: "100%"}}
                className="form-control"
            />
            {focus && suggestions.length > 0 && (
                <ul style={{ border: '1px solid #ccc', padding: 0, marginTop: 5, width: "100%"}}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={"sug" + index}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: index === selectedIndex ? '#ddd' : 'transparent',
                                cursor: 'pointer',
                                overflow: "hidden"
                            }}
                            onClick={() => suggestClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </>
    )

}