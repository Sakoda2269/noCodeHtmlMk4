import getCurrentDateTime from "@/util/nowDate";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useCreateProject() {

    const [title, setTitle] = useState("");
    const router = useRouter();

    const formattedDate = getCurrentDateTime();

    const addProject = async () => {
        if (title == "") {
            alert("タイトルを入力してください");
            return;
        }
        const postData = {
            title: title,
            createDate: formattedDate,
            updateDate: formattedDate,
            project: {
                "screens": [
                    {
                        title: "screen1",
                        components: []
                    }
                ],
                "screenNames": {
                    "screen1": 1
                },
                "databases": {},
            }
        }
        const res = await fetch("/api/projects", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        if(res.ok) {
            const data = await res.json();
            router.push("/projects/" + data.id);
        }
    }
    return [title, setTitle, addProject];
}