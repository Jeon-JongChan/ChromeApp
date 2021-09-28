
let _dom=null;
chrome.runtime.onMessage.addListener(async function (request,sender,sendRespone) {
    console.log("background - is message : ",request," sender : ",sender);
    if(request.greeting=='Interpark') {
        console.log("인터파크 매크로 메세지 수신")
        if(request.status=='Start') {
            console.log("인터파크 메세지 첫 시작");
            changeUrl(request.url);
            let dom_popup = await getDom("#popup-prdGuide");
            if(dom_popup) {
                domClassRemove("#popup-prdGuide","is-visible");
                console.log("classlist : ",dom_popup.classList);
            }
        }

        if(request.status=='Test') {
            console.log("TEST : ",_dom);
            getDom("#popup-prdGuide");
        }
    }

})

async function getDom(id) {
    let ret = await syncExecScript("document.querySelector('"+id+"')")
    //console.log("getDom : ",_dom," ret : ",ret);
    return ret;
}
async function domClassRemove(id,className) {
    console.log("document.querySelector('"+id+"').remove()");
    //let ret = await syncExecScript("document.querySelector('"+id+"').classList.remove('"+className+"')");
    let ret = await syncExecScript("document.querySelector('"+id+"').remove(); document.querySelector('"+id+"')");
    return true;
}
function syncExecScript(codeString) {
    return new Promise ((resolve) => {    
        chrome.tabs.executeScript({code: codeString,}, closureReturnDom);
        setTimeout(()=>{resolve(_dom); _dom = null;},100);
        
    })
}
function closureReturnDom(domObject) {
    console.log("전달받은 결과값 : ",domObject);
    _dom = domObject[0];
}
function changeUrl (target_url, tab_id=undefined) {
    chrome.tabs.update(tab_id,{url:target_url});
}
/*
function (result) {
        console.log("내부 클로져 결과값 : ",result);
        ret = result;
    }
// 일반 메세지 전달 
chrome.runtime.sendMessage({greeting:"HiTest"}, function(respone) {
    chrome.tabs.executeScript({
        code: "console.log('background message respone');",
    });
})
    
// 포트를 사용한 메세지 전달
chrome.runtime.onConnect.addListener(function(port) {
    //console.log("background - is port : ",port);
    port.onMessage.addListener(function(msg){
        //console.log("HiBackTest : ",msg);
    });
    
    port.onDisconnect.addListener(function(){
        console.log("Back :Port Disconnect");
    });
    
})
*/
/* 외부연결
function handleExternalConnection(port) {

  port.postMessge({ settings: gSettings });

  port.onDisconnect.addListener(() => {
    console.log("ExternalConnection");
  });
}
chrome.runtime.onConnectExternal.addListener(port => {
    console.log("Back is External");
    console.log(port);
    handleExternalConnection(port);
  });

let p = chrome.runtime.connect({name:"popupTest"});
p.postMessaage({respone:"HiBackTest"});
*/