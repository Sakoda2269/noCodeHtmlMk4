import { FaFileExport } from "react-icons/fa6";
import styles from "./Header.module.css"
import useExport from "../hooks/useExport";

export default function Header() {

    const [exportModel] = useExport();

    return (
        <div className={styles.header}>
            <div className={styles.left}></div>
            <div className={styles.center}></div>
            <div className={styles.right}>
                <button className="btn btn-secondary" onClick={exportModel}>
                    <FaFileExport />
                </button>
            </div>
        </div>
    )

}