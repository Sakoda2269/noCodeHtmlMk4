import { useState } from "react";

export default function useAddColumns() {
    
    const [pageNum, setPageNum] = useState(0);
    const nextPage = () => {
        setPageNum((p) => p+1);
    }
    const prevPage = () => {
        setPageNum((p) => p-1);
    }
    
    return [pageNum, setPageNum, nextPage, prevPage];
    
}