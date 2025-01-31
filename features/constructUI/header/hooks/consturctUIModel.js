import { useContext } from "react";
import { capitalizeFirstLetter } from "./useExport";
import { ScreenContext } from "../../project/contexts/screenContext";


let dataSenderIds = new Set();


export default function consturctUIModel(screens, screen) {
    dataSenderIds = new Set();
    const actions = constructActionChannel(screens);
    
    return constructInit(screens, screens[screen].title) + 
`native channel ScreenUpdate {
	in screen(curSc: Json, update(curSc, nextSc)) = nextSc
}

native channel SetLayout {
	in screen.layout(curLayout: Bool, setLayout(nextLayout)) = nextLayout
}

native channel SetVisible(wid: Str) {
	in screen.widgets.{wid}.visible(curVisible: Bool, setVisible(nextVisible)) = nextVisible
}

native channel SetText(wid: Str) {
	in screen.widgets.{wid}.text(curText: Str, setText(nextText)) = nextText
}

native channel SetX(wid: Str) {
	in screen.widgets.{wid}.x(curX: Int, setX(nextX)) = nextX
}

native channel SetY(wid: Str) {
	in screen.widgets.{wid}.y(curY: Int, setY(nextY)) = nextY
}

native channel SetWidth(wid: Str) {
	in screen.widgets.{wid}.width(curWidth: Int, setWidth(nextWidth)) = nextWidth
}

native channel SetHeight(wid: Str) {
	in screen.widgets.{wid}.height(curHeight: Int, setHeight(nextHeight)) = nextHeight
}
    
native channel OnTableChanged(wid: Str) {
	in screen.widgets.{wid}.data(curData: Map, tableChanged(nextData)) = nextData
}

native channel MouseEvent(wid: Str) {
	out screen.widgets.{wid}.state(curState: Int, mouseEvent(nextState)) = nextState
}

native channel TextEvent(wid: Str) {
	out screen.widgets.{wid}.text(curText: Str, textEvent(nextText)) = nextText
}

channel ChangeCurScreen {
	out curScreen(curScId: Str, changeCurScreen(nextScId)) = nextScId
}

channel ScreenTransition {
	in curScreen(curScId: Str, transScreen(nextScId, screen)) = nextScId
	ref screenTemplates.{nextScId}(screen, transScreen(nextScId, screen))
	out screen(curS, transScreen(nextScId, screen)) = screen
}
    
channel EventDispatch(wid: Str) {
	in screen.widgets.{wid}.state(curState: Int, dispatchEvent(curScId, wid, nextState)) = nextState
	ref curScreen(curScId: Str, dispatchEvent(curScId, wid, nextState))
	out screenTemplates.{curScId}.widgets.{wid}.state(curState: Int, dispatchEvent(curScId, wid, nextState)) = nextState
}
    
channel EventDispatch2(wid: Str) {
	in screen.widgets.{wid}.text(curText: Str, dispatchEvent2(curScId, wid, nextText)) = nextText
	ref curScreen(curScId: Str, dispatchEvent2(curScId, wid, nextText))
	out screenTemplates.{curScId}.widgets.{wid}.text(curText: Str, dispatchEvent2(curScId, wid, nextText)) = nextText
}
    
channel OnWidgetUpdata(scId: Str, wid: Str) {
	ref curScreen(curScId: Str, handle(curScId: Str, screen: Json, wid))
	in screenTemplates.{scId=curScId}.widgets.{wid}(curScreen, handle(curScId, nextScreen, wid)) = nextScreen
	out screen.widgets.{wid}(cur, handler(curScId, next, wid)) = next
}

${actions}
`;
}

function constructInit(screens, screenName) {
    const res = []
    for(const screen of screens) {
        res.push(constructScreen(screen));
    }
    const ids = [];
    for(const id of dataSenderIds){
        ids.push(`${id} := "${id}"`)
    } 
    return(
`init {
    screenTemplates := {
        ${res.join(",\n\t\t")}
    }
    curScreen := "${screenName}"
    ${ids.join("\n\t")}
}
`
    )
}

function constructScreen(screen) {
    const widgets = [];
    for(const widget of screen.components) {
        widgets.push(constructWidget(widget));
    }
    return (
`"${screen.title}":{
    "widgets": {
        ${widgets.join(",\n\t\t")}
    },
    "layout": false
}`
)
}

function constructWidget(widget) {
    if(widget.type == "table") {
        console.log(widget)
        const atributes = [
            `"type": "${widget.type}"`,
            `"text": "${widget.data.text.value.replace(/\$\{[^}]*\}/g, '')}"`,
            `"visible": true`,
            `"x": ${Math.round(parseFloat(widget.data.styles.value.left.value) * 1.6)}`,
            `"y": ${Math.round(parseFloat(widget.data.styles.value.top.value)  * 1.6)}`,
            `"width": ${Math.round(parseFloat(widget.data.styles.value.width.value) * 1.6)}`,
            `"height": ${Math.round(parseFloat(widget.data.styles.value.height.value) * 1.6)}`
        ];
        const notPrimaryCols = [];
        const forDataCols = [];
        let primaryKeyname = "";
        for(const col of widget.other.columns) {
            if(col != widget.other.primaryKeyName) {
                const tmp = createRefName(col);
                notPrimaryCols.push(tmp)
                forDataCols.push(`"${tmp}": "_"`);
            } else {
                primaryKeyname = col;
            }
        }
        const data = `{"_": {${forDataCols.join(", ")}}}`;
        const columns = constructColumns(notPrimaryCols, 0);
        atributes.push(`"data": ${data}`)
        atributes.push(`"columns": ${columns}`)
        atributes.push(`"primaryKeyName": "${primaryKeyname}"`)
        
        return `"${widget.data.id.value}": {${atributes.join(", ")}}`
    } else {
        return (
            `"${widget.data.id.value}": {"type": "${widget.type}", "text": "${widget.data.text.value.replace(/\$\{[^}]*\}/g, '')}", "visible": true, "x": ${Math.round(parseFloat(widget.data.styles.value.left.value) * 1.6)}, "y": ${Math.round(parseFloat(widget.data.styles.value.top.value) * 1.6)}, "width": ${Math.round(parseFloat(widget.data.styles.value.width.value) * 1.6)}, "height": ${Math.round(parseFloat(widget.data.styles.value.height.value)  * 1.6)}}`
        )
    }
}
function constructColumns(cols, i) {
    if(i == cols.length - 1) {
        return `append(nil, "${cols[i]}")`
    } else {
        return `append(${constructColumns(cols, i + 1)}, "${cols[i]}")`
    }
}

function constructActionChannel(screens) {
    const res = []
    for(const screen of screens) {
        for(const widget of screen.components) {
            if(widget.type == "button") {
                if(widget.actions.navigation != "") {
                    res.push(constructNavigationChannel(widget, screen.title));
                }
                if(widget.actions.setData.target != "") {
                    res.push(constructSetData(widget, screen.title))
                }
                if((widget.actions.updateData?.target ?? "") != "") {
                    res.push(constructUpdateData(widget, screen.title))
                }
                if((widget.actions.deleteData?.target ?? "") != "") {
                    res.push(constructDeleteData(widget, screen.title))
                }
            }
            if(widget.type == "table") {
                res.push(constructTableChannel(widget, screen.title));
            }
            if(widget.data.text.value.includes("${")) {
                res.push(constructSendTexts(widget, screen.title));
            }
        }
    }
    return res.join("\n")
}

function constructSendTexts(widget, scId) {
    const wid = widget.data.id.value;
    const text = widget.data.text.value;
    const channelName = `${wid}TextSender`;
    const res = [];
    for(const target of extractAllContents(text)) {
        dataSenderIds.add(wid);
        res.push(constructSenderChannel(channelName, wid, target, scId));
    }
    return res.join("\n");
}

function constructSenderChannel(channelName, wid, target, scId) {
    return (
`channel ${channelName}(scId: Str, wid: Str) {
    in screenTemplates.{scId="${scId}"}.widgets.{wid="${target}"}.text(curText: Str, ${channelName}(nextText: Str, target)) = nextText
    ref ${wid}(target, ${channelName}(nextText, target))
    out screen.widgets.{target}.text(curText: Str, ${channelName}(nextText, target)) = nextText
}
`)
}

function extractAllContents(value) {
    const matches = value.match(/\$\{([^}]+)\}/g);  // 全ての${}をマッチ
    return matches ? matches.map(match => match.slice(2, -1)) : [];
}

function constructNavigationChannel(widget, scId) {
    const wid = widget.data.id.value;
    const channelName = wid + "Navigate";
    const targetScreen = widget.actions.navigation;
    return (
`channel ${channelName}(scId: Str, wid: Str){
    in screenTemplates.{scId="${scId}"}.widgets.{wid="${wid}"}.state(curState: Str, ${channelName}(nextState)) = nextState
	out curScreen(curScId: Str, ${channelName}(nextState)) = if(nextState==0, "${targetScreen}", curScId)
}`
    )
}

function constructSetData(widget, scId) {
    const database = widget.actions.setData.target;
    const datas = widget.actions.setData.datas;
    const wid = widget.data.id.value;
    let pkeyCol = widget.actions.setData.pkey;
    const channelName = wid + capitalizeFirstLetter(database) + "SetData";
    const resJson = {};
    const ref = {}
    const args = ["nextState"];
    let isPkeyConst = false;
    const success = widget.actions.setData.success;
    const fail = widget.actions.setData.fail;
    for(let key of Object.keys(datas)) {
        const value = datas[key];
        key = createRefName(key);
        const refTarget = extractAllContents(value);
        if(refTarget.length != 0) {
            dataSenderIds.add(refTarget);
            resJson[key] = key;
            args.push(key);
            args.push(refTarget[0]);
            ref[key] = refTarget[0];
        } else {
            if(key == pkeyCol) {
                pkeyCol = "\"" + value + "\"";
                isPkeyConst = true;
            } else {
                resJson[key] = "\"" + value + "\"";
            }
        }
    }
    args.push(database+"Ref");
    const message = channelName + "(" + args.join(", ") + ")";
    const res = [
        `channel ${channelName}(scId: Str, wid: Str){`,
        `\tin screenTemplates.{scId="${scId}"}.widgets.{wid="${wid}"}.state(curState, ${message}) = nextState`
    ]
    const insertJson = [];
    for(const key of Object.keys(ref)) {
        res.push(
            `\tref ${ref[key]}(${ref[key]}, ${message})`
        )
        res.push(
            `\tref screen.widgets.{${ref[key]}}.text(${key}, ${message})`
        )
    }
    for(const key of Object.keys(resJson)) {
        
        if(key != pkeyCol) {
            insertJson.push(`"${key}": ${resJson[key]}`)
        }
    }
    res.push(
        `\tref ${database}(${database}Ref, ${message})`
    )
    const constraint1 = `(nextState == 0)`
    const constraint2 = `(${widget.actions.setData.pkey} != "") && (!contains(${database}Ref, ${isPkeyConst ? "\"" + pkeyCol + "\"": pkeyCol}))`
    res.push(
        `\tout ${database}(${database}: Map, ${message}) = if(${constraint1} && ${constraint2}, insert(${database}, ${pkeyCol}, {${insertJson.join(", ")}}), ${database})`
    )
    //A == 0 && 
    if(success != "" || fail != "") {
        res.push(`\tout curScreen(curScreen, ${message}) = if(${constraint1}, if(${constraint2}, ${success == "" ? "curScreen" : "\""+success+"\""}, ${fail == "" ? "curScreen" : "\""+fail+"\""}), curScreen)`)
    }
    res.push("}")
    return res.join("\n");
}

function constructUpdateData(widget, scId) {
    const database = widget.actions.updateData.target;
    const datas = widget.actions.updateData.datas;
    const wid = widget.data.id.value;
    let pkeyCol = widget.actions.updateData.pkey;
    const channelName = wid + capitalizeFirstLetter(database) + "UpdateData";
    const resJson = {};
    const ref = {}
    const args = ["nextState"];
    let isPkeyConst = false;
    const success = widget.actions.updateData.success;
    const fail = widget.actions.updateData.fail;
    for(let key of Object.keys(datas)) {
        const value = datas[key];
        key = createRefName(key);
        const refTarget = extractAllContents(value);
        if(refTarget.length != 0) {
            dataSenderIds.add(refTarget);
            resJson[key] = key;
            args.push(key);
            args.push(refTarget[0]);
            ref[key] = refTarget[0];
        } else {
            if(key == pkeyCol) {
                pkeyCol = "\"" + value + "\"";
                isPkeyConst = true;
            } else {
                resJson[key] = "\"" + value + "\"";
            }
        }
    }
    args.push(database+"Ref");
    const message = channelName + "(" + args.join(", ") + ")";
    const res = [
        `channel ${channelName}(scId: Str, wid: Str){`,
        `\tin screenTemplates.{scId="${scId}"}.widgets.{wid="${wid}"}.state(curState, ${message}) = nextState`
    ]
    const insertJson = [];
    for(const key of Object.keys(ref)) {
        res.push(
            `\tref ${ref[key]}(${ref[key]}, ${message})`
        )
        res.push(
            `\tref screen.widgets.{${ref[key]}}.text(${key}, ${message})`
        )
    }
    for(const key of Object.keys(resJson)) {
        
        if(key != pkeyCol) {
            insertJson.push(`"${key}": ${resJson[key]}`)
        }
    }
    res.push(
        `\tref ${database}(${database}Ref, ${message})`
    )
    const constraint1 = `(nextState == 0)`
    const constraint2 = `(${widget.actions.updateData.pkey} != "") && (contains(${database}Ref, ${isPkeyConst ? "\"" + pkeyCol + "\"": pkeyCol}))`
    res.push(
        `\tout ${database}(${database}: Map, ${message}) = if(${constraint1} && ${constraint2}, insert(${database}, ${pkeyCol}, {${insertJson.join(", ")}}), ${database})`
    )
    //A == 0 && 
    if(success != "" || fail != "") {
        res.push(`\tout curScreen(curScreen, ${message}) = if(${constraint1}, if(${constraint2}, ${success == "" ? "curScreen" : "\""+success+"\""}, ${fail == "" ? "curScreen" : "\""+fail+"\""}), curScreen)`)
    }
    res.push("}")
    return res.join("\n");
}

function constructDeleteData(widget, scId) {
    const database = widget.actions.deleteData.target;
    const datas = widget.actions.deleteData.datas;
    const wid = widget.data.id.value;
    let pkeyCol = widget.actions.deleteData.pkey;
    const channelName = wid + capitalizeFirstLetter(database) + "DeleteData";
    const resJson = {};
    const ref = {}
    const args = ["nextState"];
    let isPkeyConst = false;
    const success = widget.actions.deleteData.success;
    const fail = widget.actions.deleteData.fail;
    for(let key of Object.keys(datas)) {
        const value = datas[key];
        key = createRefName(key);
        const refTarget = extractAllContents(value);
        if(refTarget.length != 0) {
            dataSenderIds.add(refTarget);
            resJson[key] = key;
            args.push(key);
            args.push(refTarget[0]);
            ref[key] = refTarget[0];
        } else {
            if(key == pkeyCol) {
                pkeyCol = "\"" + value + "\"";
                isPkeyConst = true;
            } else {
                resJson[key] = "\"" + value + "\"";
            }
        }
    }
    args.push(database+"Ref");
    const message = channelName + "(" + args.join(", ") + ")";
    const res = [
        `channel ${channelName}(scId: Str, wid: Str){`,
        `\tin screenTemplates.{scId="${scId}"}.widgets.{wid="${wid}"}.state(curState, ${message}) = nextState`
    ]
    const insertJson = [];
    for(const key of Object.keys(ref)) {
        res.push(
            `\tref ${ref[key]}(${ref[key]}, ${message})`
        )
        res.push(
            `\tref screen.widgets.{${ref[key]}}.text(${key}, ${message})`
        )
    }
    for(const key of Object.keys(resJson)) {
        
        if(key != pkeyCol) {
            insertJson.push(`"${key}": ${resJson[key]}`)
        }
    }
    res.push(
        `\tref ${database}(${database}Ref, ${message})`
    )
    const constraint1 = `(nextState == 0)`
    const constraint2 = `(${widget.actions.deleteData.pkey} != "") && (contains(${database}Ref, ${isPkeyConst ? "\"" + pkeyCol + "\"": pkeyCol}))`
    res.push(
        `\tout ${database}(${database}: Map, ${message}) = if(${constraint1} && ${constraint2}, delete(${database}, ${pkeyCol}), ${database})`
    )
    //A == 0 && 
    if(success != "" || fail != "") {
        res.push(`\tout curScreen(curScreen, ${message}) = if(${constraint1}, if(${constraint2}, ${success == "" ? "curScreen" : "\""+success+"\""}, ${fail == "" ? "curScreen" : "\""+fail+"\""}), curScreen)`)
    }
    res.push("}")
    return res.join("\n");
}

function constructTableChannel(widget, scId) {
    const source = widget.other.source;
    const wid = widget.data.id.value;
    const channelName = `send${capitalizeFirstLetter(source)}To${capitalizeFirstLetter(wid)}`;
    dataSenderIds.add(scId);
    dataSenderIds.add(wid);
    return (
`channel ${channelName} {
	in ${source}(cur: Map, ${channelName}(next: Map, scId:Str, wid:Str)) = next
	ref ${scId}(scId:Str, ${channelName}(next, scId, wid))
	ref ${wid}(wid: Str, ${channelName}(next, scId, wid))
	out screenTemplates.{scId}.widgets.{wid}.data(cur: Map, ${channelName}(next, scId, wid)) = next 
}
    
`
    )
}

function createRefName(str){
    const splitStr = str.split(".")
    splitStr.reverse();
    for(let i = 1; i < splitStr.length; i++) {
        splitStr[i] = capitalizeFirstLetter(splitStr[i]);
    }
    return splitStr.join("Of")
}
