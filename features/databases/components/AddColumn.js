import useAddColumns from "../hooks/useAddColumns"
import styles from "./AddDatabase.module.css"

export default function AddColumns({ close, colmuns, setColumns, type }) {

    const [
        pageNum, setPageNum, nextPage, prevPage
    ] = useAddColumns();

    return (
        <div>
            <div className={styles.center}>
                {pageNum == 0 && 
                    <div>
                        {type}
                    </div>
                }
                {pageNum == 1 && 
                    <div>
                        iii
                    </div>
                }
            </div>
            <div className={styles.buttonContainer}>
                <button className="btn btn-secondary" onClick={[close, prevPage][1*(pageNum != 0)]}>{["閉じる","戻る"][1*(pageNum != 0)]}</button>
                <button className="btn btn-primary" onClick={nextPage}>次へ</button>
            </div>
        </div>
    )
}