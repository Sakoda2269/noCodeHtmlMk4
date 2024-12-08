import Popup from "@/components/popup/popup";
import useDatabases from "../hooks/useDatabases"
import styles from "./Databases.module.css"
import AddDatabas from "./AddDatabase";

export default function Databases() {
    
    const [
        databases, isCreateDBOpen, setIsCreateDBOpen,
        isEditDBOpen, editDB, openEditDB, setIsEditDBOpen
    ] = useDatabases();

    return (
        <div className={styles.container}>
            <div className={styles.containerElement}>
                {Object.entries(databases).map(([key, value]) => (
                    <div key={key} style={{width: "100%", marginBottom: "10px"}}>
                        <button style={{width: "100%"}} onClick={() => openEditDB(key)}>
                            {key}
                        </button>
                    </div>
                ))}
            </div>
            <button 
                className={styles.containerElement}
                onClick={() => {setIsCreateDBOpen(true)}}
            >add table</button>
            
            <Popup isOpen={isCreateDBOpen}>
                <AddDatabas close={() => {setIsCreateDBOpen(false)}}/>
            </Popup>
            
            <Popup isOpen={isEditDBOpen}>
            {editDB != "" && 
                (
                    <div>
                        <AddDatabas close={() => {setIsEditDBOpen(false)}} edit={databases[editDB]} name={editDB}/>
                    </div>
                )
            }
            </Popup>

        </div>
    )
}