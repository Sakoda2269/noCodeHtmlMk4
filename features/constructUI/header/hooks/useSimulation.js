"use client"

import { useContext } from "react";
import { constructModelFile } from "./useExport";
import { ProjectContext } from "../../project/contexts/projectContext";
import { useRouter } from "next/navigation";


export default function useSimulation() {
    
    const project = useContext(ProjectContext);
    const router = useRouter();
    
    
    const sendModel = async () => {
        
        const modelText = constructModelFile(project);
        const form = new FormData();
        form.append("model_text", modelText);
        const id = self.crypto.randomUUID();
        form.append("session_id", id);
        
        const response = await fetch('/api/start_simulation', {
            method: 'POST',
            body: form
        });
        if(response.ok) {
            window.open("/simulation?id="+id, '_blank');
        }
    }
    
    return [sendModel]
}