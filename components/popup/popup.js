import styles from "./popup.module.css"

export default function Popup({isOpen, children}) {
    return (
        <div>
            {isOpen && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}
