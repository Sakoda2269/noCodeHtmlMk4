import { useState } from "react";


export default function useViews() {
    
    const [createViewPage, setCreateViewPage] = useState(0);
    
    
    return [createViewPage, setCreateViewPage]
}