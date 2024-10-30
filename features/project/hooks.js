"use client"

import { useState } from "react";

export default function useProject() {
    const [project, setProject] = useState({
        title: "project1",
        screens: [
            {
                title: "screen1",
                components:[
                    {
                        type: "button",
                        data: {
                            text: "hello",
                            styles: {
                                left: "10px",
                                top: "10px",
                                width: "100px",
                                height: "40px"
                            }
                        }
                    },
                    {
                        type: "absoluteContainer",
                        data: {
                            styles: {
                                left: "150px",
                                top: "30px",
                                width: "100px",
                                height: "300px",
                            }
                            
                        },
                        children: [
                            {
                                type: "button",
                                data: {
                                    text: "good",
                                    styles: {
                                        left: "30px",
                                        top: "210px",
                                        width: "80px",
                                        height: "100px"
                                    }
                                }
                            }
                        ]
                    }
                ]
                ,
            }
        ]
    });

    const [currentScreenId, setCurrentScreenId] = useState(0);

    const [selecting, setSelecting] = useState("");

    const [selectingContainer, setSelectingContainer] = useState("");

    return [project, setProject, currentScreenId, setCurrentScreenId, selecting, setSelecting, selectingContainer, setSelectingContainer];
}
