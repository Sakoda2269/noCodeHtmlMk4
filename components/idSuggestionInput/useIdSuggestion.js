import { ProjectContext } from "@/features/constructUI/project/contexts/projectContext";
import { useContext, useState } from "react";

export default function useIdSuggestionInput(onChange, onBlur, onFocus, value, onKeyDown, setValue) {
    
    const project = useContext(ProjectContext);
    
    const [suggestions, setSuggestions] = useState(Object.keys(project.widgetNames));
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [focus, setFocus] = useState(false);
    
    const handleChange = (e) => {
        if(onChange) {
            onChange(e);
        }
        if(/^\${/.test(e.target.value)) {
            setFocus(true);
        }
    }
    
    const handleBlur = (e) => {
        setTimeout(() => {
            if(onBlur) {
                onBlur(e);
            }
            setFocus(false);
        }, 200)
    }
    
    const handleFocus = (e) => {
        if(onFocus) {
            onFocus(e);
        }
    }
    
    const handleKeyDown = (e) => {
        if(e.key == "Tab" && focus) {
            e.preventDefault();
            if(e.shiftKey) {
                setSelectedIndex(p => (p - 1 + suggestions.length) % suggestions.length);
            } else {
                setSelectedIndex(p => (p + 1) % suggestions.length);
            }
        }
        if(e.key == "Enter" && focus) {
            suggestClick(suggestions[selectedIndex])
        }
        if(onKeyDown) {
            onKeyDown(e);
        }
    }
    
    const suggestClick = (text) => {
        const e = {
            target: {
                value: "${" + text + "}"
            }
        }
        if(onChange) {
            onChange(e);
        }
        setFocus(false);
    }
    
    
    return [handleChange, handleBlur, handleFocus, suggestions, selectedIndex, handleKeyDown, focus, suggestClick];
}