import { useState } from "react";

export default function usePageControl(defaultPage = 0) {
    const [pageNum, setPageNum] = useState(defaultPage);
    
    const nextPage = () => {
        setPageNum((p) => (p + 1))
    }
    
    const prevPage = () => {
        setPageNum((p) => (p - 1))
    }
    
    return [pageNum, setPageNum, nextPage, prevPage]
    
}