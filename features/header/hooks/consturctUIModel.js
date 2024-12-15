import { capitalizeFirstLetter } from "./useExport";


const dataSenderIds = new Set()

export default function consturctUIModel(screens) {
    
    const actions = constructActionChannel(screens);
    
    return constructInit(screens) + 
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

${actions}
`;
}

function constructInit(screens) {
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
    if(widget.type == "textInput") {
        return (
            `"${widget.data.id.value}": {"type": "${widget.type}", "visible": true, "x": ${parseFloat(widget.data.styles.value.left.value)}, "y": ${parseFloat(widget.data.styles.value.top.value)}, "width": ${parseFloat(widget.data.styles.value.width.value)}, "height": ${parseFloat(widget.data.styles.value.height.value)}}`
        )
    }
    return (
`"${widget.data.id.value}": {"type": "${widget.type}", "text": "${widget.data.text.value.replace(/\$\{[^}]*\}/g, '')}", "visible": true, "x": ${parseFloat(widget.data.styles.value.left.value)}, "y": ${parseFloat(widget.data.styles.value.top.value)}, "width": ${parseFloat(widget.data.styles.value.width.value)}, "height": ${parseFloat(widget.data.styles.value.height.value)}}`
    )
}

function constructActionChannel(screens) {
    const res = []
    for(const screen of screens) {
        for(const widget of screen.components) {
            if(widget.type == "button") {
                if(widget.actions.navigation != "") {
                    res.push(constructNavigationChannel(widget));
                }
                if(widget.actions.setData.target != "") {
                    res.push(constructSetData(widget))
                }
            }
            if(widget.data.text.value.includes("${")) {
                res.push(constructSendTexts(widget, screen.title));
            }
        }
    }
    return res.join("\n")
}

function constructSendTexts(widget) {
    const wid = widget.data.id.value;
    const text = widget.data.text.value;
    const channelName = `${wid}TextSender`;
    const res = [];
    for(const target of extractAllContents(text)) {
        dataSenderIds.add(wid);
        res.push(constructSenderChannel(channelName, wid, target));
    }
    return res.join("\n");
}

function constructSenderChannel(channelName, wid, target) {
    return (
`channel ${channelName}(wid: Str) {
    in screen.widgets.{wid="${target}"}.text(curText: Str, ${channelName}(nextText: Str, target)) = nextText
    ref ${wid}(target, ${channelName}(nextText, target))
    out screen.widgets.{target}.text(curText: Str, ${channelName}(nextText, target)) = nextText
}
`)
}

function extractAllContents(value) {
    const matches = value.match(/\$\{([^}]+)\}/g);  // 全ての${}をマッチ
    return matches ? matches.map(match => match.slice(2, -1)) : [];
  }
  

function constructNavigationChannel(widget) {
    const wid = widget.data.id.value;
    const channelName = wid + "Navigate";
    const targetScreen = widget.actions.navigation;
    return (
`channel ${channelName}(wid: Str){
    in screen.widgets.{wid="${wid}"}.state(curState: Str, ${channelName}(nextState)) = nextState
	out curScreen(curScId: Str, ${channelName}(nextState)) = if(nextState==0, "${targetScreen}", curScId)
}`
    )
}

function constructSetData(widget) {
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
    for(const key of Object.keys(datas)) {
        const value = datas[key];
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
        `channel ${channelName}(wid: Str){`,
        `\tin screen.widgets.{wid="${wid}"}.state(curState, ${message}) = nextState`
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

