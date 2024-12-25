import { FaFileExport } from "react-icons/fa6";
import { VscPreview } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import styles from "./Header.module.css"
import useExport from "../hooks/useExport";
import useSimulation from "../hooks/useSimulation";
import useSaveProject from "../hooks/useSaveProject";
import { useRouter } from "next/navigation";

export default function Header({ pid }) {

    const [exportModel] = useExport();
    const [sendModel] = useSimulation();
    const [saveProject] = useSaveProject(pid);

    const router = useRouter();

    const back = () => {
        if (!window.confirm("このページを離れますか？未保存の変更が失われる可能性があります。")) {
            // ユーザーがキャンセルを選んだ場合、遷移を防ぐ
            return;
        }
        router.push("/projects")
    }

    return (
        <div className={styles.header}>
            <div className={styles.left} style={{ marginLeft: "20px" }}>
                <button className="btn" onClick={back} style={{ marginRight: "20px" }}>
                    <IoIosArrowBack />
                </button>
                <button className="btn btn-secondary" onClick={saveProject}>
                    <FaSave />
                </button>
            </div>
            <div className={styles.center}></div>
            <div className={styles.right}>
                <div style={{ paddingRight: "10px" }}>
                    <button className="btn btn-secondary" onClick={exportModel}>
                        <FaFileExport />
                    </button>
                </div>
                <div style={{ paddingRight: "50px" }}>
                    <button className="btn btn-secondary" onClick={sendModel}>
                        <VscPreview />
                    </button>
                </div>
            </div>
        </div>
    )

}