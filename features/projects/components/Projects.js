"use client"

import { useState } from "react";
import useProjects from "../hooks/useProjects";
import styles from "./Projects.module.css";
import { FaPlus } from "react-icons/fa6";
import Popup from "@/components/popup/popup";
import useCreateProject from "../hooks/useCreateProject";
import { useRouter } from "next/navigation";

const rowStyles = [styles.rowOdd, styles.rowEven];

export default function Projects() {

    const [projects, setProjects, loading, deleteProject] = useProjects();
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div className="container" style={{ paddingTop: "20px" }}>
            <div>
                <h4>プロジェクトを選択</h4>
            </div>
            <div className={styles.projectList}>
                <table style={{ border: "none" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>プロジェクト名</th>
                            <th style={{ textAlign: "center" }}>作成日</th>
                            <th style={{ textAlign: "center" }}>更新日</th>
                            <th style={{ textAlign: "center" }}>その他</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={4}>
                                <button className={styles.projectButton} onClick={() => setIsOpen(true)}>
                                    <div style={{ textAlign: "left" }}>
                                        <FaPlus />プロジェクトを追加する
                                    </div>
                                </button>
                            </td>
                        </tr>
                        {!loading && projects.map((value, index) => (
                            <TableRow key={value.title} value={value} index={index} deleteProject={deleteProject}/>
                        ))}
                    </tbody>
                </table>
                {loading && <div>loading...</div>}
            </div>
            <Popup isOpen={isOpen}>
                <ProjectPopup close={() => {setIsOpen(false)}} setProject={setProjects}/>
            </Popup>
        </div>
    )
}

function TableRow({ value, index, deleteProject }) {

    const [rowStyle, setRowStyle] = useState(rowStyles[index % 2]);
    
    const router = useRouter();

    return (
        <tr className={rowStyle}
            onMouseEnter={() => { setRowStyle(styles.rowMouseHover) }}
            onMouseLeave={() => { setRowStyle(rowStyles[index % 2]) }}
            onClick={() => {
                router.push("/projects/"+value._id);
            }}
        >
            <td>{value.title}</td>
            <td>{value.createDate}</td>
            <td>{value.updateDate}</td>
            <td><button className="btn btn-danger" onClick={(e) =>{e.stopPropagation();deleteProject(value._id)}}>削除</button></td>
        </tr>
    )
}

function ProjectPopup({ close, setProjects}) {
    
    const [title, setTitle, addProject] = useCreateProject();
    
    return (
        <div>
            <h5>プロジェクト新規作成</h5>
            <div style={{ paddingBottom: "20px" }}>
                <label className="fomr-label required">タイトル</label>
                <input className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="bothSideButton">
                <button className="btn btn-secondary" onClick={close}>閉じる</button>
                <button className="btn btn-primary" onClick={addProject}>作成</button>
            </div>
        </div>
    )
}