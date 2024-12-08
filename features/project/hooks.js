"use client"

import { useState } from "react";

export default function useProject() {
    const [project, setProject] = useState({
        title: "project1",
        screens: [
            {
                title: "screen1",
                components:[]
            }
        ],
        variables: [
        ],
        databases: {
            "accounts": {
                url: "",
                user: "",
                password: "",
                database: "postgresql",
                columns: [
                    {
                        name: "id",
                        type: "text",
                        constraint: [],
                        default: "$unique",
                        foreignKey: ""
                    },
                    {
                        name: "name",
                        type: "text",
                        constraint: ["unique", "notNull"],
                        default: "",
                        foreignKey: ""
                    },
                    {
                        name: "age",
                        type: "integer",
                        constraint: [],
                        default: "",
                        foreignKey: ""
                    }
                ],
                primaryKey: "id",
            },
            "tweets": {
                url: "",
                user: "",
                password: "",
                database: "postgresql",
                columns:[
                    {
                        name: "tweetId",
                        type: "integer",
                        default: "$sequential",
                    },
                    {
                        name: "contents",
                        type: "text",
                        default: "",
                    },
                    {
                        name: "accounts",
                        type: "table",
                        relationKey: "id",
                        columns: [1, 2]
                    }
                ],
                primaryKey: "tweetId",
            }
        }
    });

    const [currentScreenId, setCurrentScreenId] = useState(0);

    const [selecting, setSelecting] = useState("");

    const [selectingContainer, setSelectingContainer] = useState("");

    const [loading, setLoading] = useState(false);

    return [project, setProject, currentScreenId, setCurrentScreenId, selecting, setSelecting, selectingContainer, setSelectingContainer
        ,loading, setLoading
    ];
}
