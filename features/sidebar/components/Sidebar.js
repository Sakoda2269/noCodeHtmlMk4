"use client"
import useSidebar from "../hooks/useSidebar";
import styles from "./Sidebar.module.css"


export function Sidebar({ children }) {
    const [openNum, selectNumber, center, right, sideIcons, sideBodies] = useSidebar(children);

    return (
        <div>
            <div className={styles.all}>
                <div className={styles.leftIcons}>
                    {sideIcons.map((icon, index) => (
                        <button className={openNum == index ? "btn btn-secondary" : "btn border-secondary"} onClick={() => selectNumber(index)} key={index}>
                            {icon}
                        </button>
                    ))}
                </div>
                <div className={`${styles.container} ${openNum != -1 ? styles.left : styles.leftClose}`}>
                    {sideBodies.map((body, index) => {
                        if (openNum == index) {
                            return (
                                <div className={styles.leftContainer} key={index}>
                                    {body}
                                </div>
                            )
                        }
                        return null;
                    })}
                </div>
                <div className={`${styles.container} ${styles.center}`}>
                    {center}
                </div>
                <div className={styles.right}>
                    {right}
                </div>
            </div>
        </div>
    )

}

export function SideItem({children}) {
    return <>{children}</>
}

export function SideIcon({children}) {
    return <>{children}</>
}

export function SideBody({children}) {
    return <div style={{height: "100%", width: "100%"}}>{children}</div>
}

export function CenterBody({children}) {
    return <div style={{height: "100%", width: "100%"}}>{children}</div>
}

export function RightBody({children}) {
    return <div style={{height: "100%", width: "100%"}}>{children}</div>
}

function findElem(children, type) {
    return children.find((child) => React.isValidElement(child) && child.type == type);
}