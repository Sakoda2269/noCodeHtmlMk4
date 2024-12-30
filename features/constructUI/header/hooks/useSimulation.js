"use client"

import { useContext } from "react";
import { constructModelFile } from "./useExport";
import { ProjectContext } from "../../project/contexts/projectContext";
import { useRouter } from "next/navigation";
import { ScreenContext } from "../../project/contexts/screenContext";


export default function useSimulation() {
    
    const project = useContext(ProjectContext);
    const screen = useContext(ScreenContext);
    const router = useRouter();
    
    
    const sendModel = async () => {
        let canCreateModel = true;
        for(const scr of project.screens) {
            canCreateModel = canCreateModel && (scr.components.length > 0)
        }
        if(!canCreateModel) {
            alert("ウィジェットが一つもないスクリーンを作ることはできません")
            return;
        }
        const modelText = constructModelFile(project, screen);
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