
let _dom=null;
console.log("Background 메세지 작동");
chrome.runtime.onMessage.addListener(async function (request,sender,sendRespone) {
    console.log("background - is message : ",request," sender : ",sender);
    if(request.site=='Interpark') {
        if(request.status==='Start') {
            changeUrl(request.url);
            await sleep(2000);
            sendStatusMessage("Interpark","Step1");
        } else if (request.status==='Step2') {
            console.log("Background - Step2 : sheet select");
            await sleep(2000);
            sendStatusMessage("Interpark","Step2");
        } else if (request.status==='Step3') {
            console.log("Background - Step3 : pay select");
            await sleep(2000);
            sendStatusMessage("Interpark","Step3");
        } else if (request.status==='Step4') {
            console.log("Background - Step4 : address select");
            await sleep(2000);
            sendStatusMessage("Interpark","Step4");
        }
        if(request.status=='Test') {
            sendStatusMessage("Interpark","Func Test");
        }
    }
})

function sendStatusMessage(site,status) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("sendStatusMessage tab :",tabs);
        chrome.tabs.sendMessage(tabs[0].id,{site:site,status:status});
    });
}

function changeUrl (target_url, tab_id=undefined) {
    chrome.tabs.update(tab_id,{url:target_url});
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

/* 일단 사용 안함
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
*/ 

/* 사용안하는 함수
async function getDom(id) {
    let ret = await syncExecScript("document.querySelector('"+id+"')")
    //console.log("getDom : ",_dom," ret : ",ret);????????
    return ret;
}
async function domClassRemove(id,className) {
    console.log("document.querySelector('"+id+"').remove()");
    //let ret = await syncExecScript("document.querySelector('"+id+"').classList.remove('"+className+"')");
    let ret = await syncExecScript("document.querySelector('"+id+"').remove(); document.querySelector('"+id+"')");
    return true;
}
*/

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