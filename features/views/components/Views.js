import Popup from "@/components/popup/popup";
import styles from "./Vies.module.css";
import useViews from "../hooks/useViews";

export default function Views() {
    
    const [createViewPage, setCreateViewPage] = useViews();
    
    return (
        <>
        <div className={styles.container}>
            <button className={styles.containerElement} onClick={() => {setCreateViewPage(1)}}>add View</button>
        </div>
        <Popup isOpen={createViewPage != 0}>
            <CreateViewScreen pageNum={createViewPage} setPageNum={setCreateViewPage} />
        </Popup>
        </>
    )
}

function CreateViewScreen({pageNum, setPageNum}) {
    return (
        <>
        {pageNum == 1 && 
        <div className={styles.mainContainer}>
            <div className={styles.left}>
                <button onClick={() => {setPageNum(0)}}>&lt;</button>
            </div>
            <div className={styles.center}></div>
            <div className={styles.right}>
                <button onClick={() => {setPageNum(0)}}>&gt;</button>
            </div>
        </div>
        }
        {pageNum == 2 && 
        <div>
            
        </div>
        }
        </>
    )
}