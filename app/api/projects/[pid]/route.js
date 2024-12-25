import clientPromise from "@/lib/mongodb";
import getCurrentDateTime from "@/util/nowDate";
import { ObjectId } from "mongodb";

export async function GET(request, {params}) {
    try{
        const client = await clientPromise;
        const db = client.db("nocode");
        const collection = db.collection("projects");
        const {pid} = await params;
        const res = await collection.findOne({ _id: new ObjectId(pid) });
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({message: "error"}), {status: 500});
    }
}

export async function PUT(request, {params}) {
    try{
        
        const formattedDate = getCurrentDateTime();
        
        const client = await clientPromise;
        const db = client.db("nocode");
        const collection = db.collection("projects");
        const {pid} = await params;
        const project = await request.json();
        console.log(project)
        const res = await collection.updateOne(
            { _id: new ObjectId(pid) },  // どのドキュメントを更新するかを指定（ObjectId型に変換）
            { $set: { "project": project, "updateDate": formattedDate } }  // `age` フィールドを新しい値に設定
          );
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({message: "error"}), {status: 500});
    }
}