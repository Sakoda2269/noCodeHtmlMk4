import { useContext } from "react"
import { ProjectContext } from "../../project/contexts/projectContext"

export default function useSaveProject(pid) {
    
    const project = useContext(ProjectContext);
    
    const saveProject = async() => {
        fetch("/api/projects/" + pid, 
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project)
            }
        )
    }
    
    return [saveProject]
}