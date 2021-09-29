let button = document.querySelector('#start');
let url_dom = document.querySelector('#target-url');
let test = document.querySelector('#test');

url_dom.value = localStorage.getItem('target_url');

button.addEventListener("click", content_start);
url_dom.addEventListener("change", onChangeUrl);
test.addEventListener("click", macroTest);

function content_start() {
    target_url = url_dom.value;
    chrome.runtime.sendMessage({site:"Interpark",status:"Start",url:target_url});
}

function macroTest() {
    chrome.runtime.sendMessage({site:"Interpark",status:"Test"});
    /*
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id,{site:"Interpark",status:"Test"});
    });
    */
}

chrome.runtime.onMessage.addListener(function (request,sender,sendRespone) {
    chrome.tabs.executeScript({
        code: "console.log('popup message :',"+request.toString()+");",
    });
})

function onChangeUrl(event) {
    localStorage.setItem('target_url',event.target.value);
}
/*
chrome.runtime.sendMessage({greeting:"HiTest"}, function(respone) {
    console.log(respone);
    chrome.tabs.executeScript({
        code: "console.log('popup message :',"+respone.toString()+");",
    });
})

let port = chrome.runtime.connect({name:"popupTest"});
port.postMessage({send:"popup"});

chrome.tabs.executeScript({
    file: "content.js",
});

let tabId = getTabId();
chrome.tabs.executeScript({
    target: {tabId: tabId},
    func: ()=>{console.log('scripting')},
})

chrome.tabs.query({active:true,currentWindow:true},function(tab) {    
    chrome.tabs.executeScript({
        code: "console.log('scripting');",
    });
    //chrome.tabs.update(tab.id,{url:"http://ticket.interpark.com/"});

    chrome.tabs.executeScript({
        file: "content.js",
    });
});
*/