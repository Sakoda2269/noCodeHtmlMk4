import { FaFileExport } from "react-icons/fa6";
import { VscPreview } from "react-icons/vsc";
import styles from "./Header.module.css"
import useExport from "../hooks/useExport";
import useSimulation from "../hooks/useSimulation";

export default function Header() {

    const [exportModel] = useExport();
    const [sendModel] = useSimulation();

    return (
        <div className={styles.header}>
            <div className={styles.left}></div>
            <div className={styles.center}></div>
            <div className={styles.right}>
                <div style={{paddingRight: "10px"}}>
                    <button className="btn btn-secondary"  onClick={exportModel}>
                        <FaFileExport />
                    </button>
                </div>
                <div style={{paddingRight: "50px"}}>
                    <button className="btn btn-secondary" onClick={sendModel}>
                        <VscPreview />
                    </button>
                </div>
            </div>
        </div>
    )

}