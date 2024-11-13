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
                            id: {
                                type: "string",
                                value: "btn1"
                            },
                            text: {
                                type: "string",
                                value: "hello"
                            },
                            styles: {
                                type: "object",
                                value: {
                                    left: {
                                        type: "string",
                                        value: "30px"
                                    },
                                    top: {
                                        type: "string",
                                        value: "30px"
                                    },
                                    width: {
                                        type: "string",
                                        value: "100px"
                                    },
                                    height: {
                                        type: "string",
                                        value: "40px"
                                    }
                                }
                            }
                        }
                    },
                    {
                        type: "absoluteContainer",
                        data: {
                            id: {
                                type: "string",
                                value: "abCon1"
                            },
                            styles: {
                                type: "object",
                                value: {
                                    left: {
                                        type: "string",
                                        value: "150px"
                                    },
                                    top: {
                                        type: "string",
                                        value: "30px"
                                    },
                                    width: {
                                        type: "string",
                                        value: "100px"
                                    },
                                    height: {
                                        type: "string",
                                        value: "300px"
                                    }
                                }
                            }
                            
                        },
                        children: [
                            {
                                type: "button",
                                data: {
                                    id: {
                                        type: "string",
                                        value: "btn2"
                                    },
                                    text: {
                                        type: "string",
                                        value: "good"
                                    },
                                    styles: {
                                        type: "object",
                                        value: {
                                            left: {
                                                type: "string",
                                                value: "30px"
                                            },
                                            top: {
                                                type: "string",
                                                value: "210px"
                                            },
                                            width: {
                                                type: "string",
                                                value: "80px"
                                            },
                                            height: {
                                                type: "string",
                                                value: "100px"
                                            }
                                        }
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
