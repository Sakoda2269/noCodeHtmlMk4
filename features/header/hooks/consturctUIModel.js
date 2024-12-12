import { capitalizeFirstLetter } from "./useExport";


export default function consturctUIModel(screens) {
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

channel EventDispatch(wid: Str) {
	in screen.widgets.{wid}.state(curState: Int, dispatchEvent(curScId, wid, nextState)) = nextState
	ref curScreen(curScId: Str, dispatchEvent(curScId, wid, nextState))
	out screenTemplates.{curScId}.widgets.{wid}.state(curState: Int, dispatchEvent(curScId, wid, nextState)) = nextState
}

channel EventDispatch2(wid: Str) {
	in screen.widgets.{wid}.text(curText: Str, dispatchEvent(curScId, wid, nextText)) = nextText
	ref curScreen(curScId: Str, dispatchEvent(curScId, wid, nextText))
	out screenTemplates.{curScId}.widgets.{wid}.text(curText: Str, dispatchEvent(curScId, wid, nextText)) = nextText
}

${constructActionChannel(screens)}`;
}

function constructInit(screens) {
    const res = []
    for(const screen of screens) {
        res.push(constructScreen(screen));
    }
    return(
`init {
    screenTemplates := {
        ${res.join(",\n\t\t")}
    }
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
    return (
`"${widget.data.id.value}": {"type": "${widget.type}", "text": "${widget.data.text.value}", "state": 0, "visible": true, "x": ${parseFloat(widget.data.styles.value.left.value)}, "y": ${parseFloat(widget.data.styles.value.top.value)}, "width": ${parseFloat(widget.data.styles.value.width.value)}, "height": ${parseFloat(widget.data.styles.value.height.value)}}`
    )
}

function constructActionChannel(screens) {
    const res = []
    for(const screen of screens) {
        for(const widget of screen.components) {
            if(widget.type == "button") {
                res.push(constructNavigationChannel(widget, screen.title));
            }
        }
    }
    return res.join("\n")
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