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
                        type: "varchar(32)",
                        constraint: [],
                        default: "$unique"
                    },
                    {
                        name: "name",
                        type: "varchar(16)",
                        constraint: ["unique", "notNull"],
                        default: null
                    },
                    {
                        name: "age",
                        type: "integer",
                        constraint: [],
                        default: null
                    }
                ],
                primaryKey: ["id"],
                foreignKey: []
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
                        constraint: [],
                        default: "$sequential"
                    },
                    {
                        name: "accountId",
                        type: "varchar(32)",
                        constraint: [],
                        default: null
                    },
                    {
                        name: "content",
                        type: "text",
                        constraint: [],
                        default: ""
                    }
                ],
                primaryKey: ["tweetId"],
                foreignKey: [["accountId", "accounts.id"]]
            }
        }
    });

    const [currentScreenId, setCurrentScreenId] = useState(0);

    const [selecting, setSelecting] = useState("");

    const [selectingContainer, setSelectingContainer] = useState("");

    return [project, setProject, currentScreenId, setCurrentScreenId, selecting, setSelecting, selectingContainer, setSelectingContainer];
}
