import { useState } from "react";

export default function usePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const nextPage = () => {
        setPageNum((p) => p + 1)
    }
    const prevPage = () => {
        setPageNum((p) => p - 1)
    }
    return [isOpen, setIsOpen, pageNum, nextPage, prevPage]
}