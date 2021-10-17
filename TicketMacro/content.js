let public, interpark;

let progressStatus = 'interactive';
async function srcImport(srcStr) {
    const src = chrome.extension.getURL(srcStr); 
    const ret = await import(src);
    return ret;
}
async function saveSrc(site) {
    public = await srcImport('public.js');
    if(site == 'Interpark') interpark = await srcImport('macro/interpark.js');
    //console.log("Module : ",public, interpark);
}


console.log("content scripts!");
waitContent();

async function waitContent() {
    if(location.host=="poticket.interpark.com") {
        chrome.runtime.sendMessage({site:"Interpark",status:"Step2"});
    }
}


chrome.runtime.onMessage.addListener(async function (request,sender,sendRespone) {
    console.log("Content Message Receive. request",request);
    if(request.site=='Interpark') {
        await saveSrc('Interpark');
        macro_start(request);
    }
})
// loading, interactive, complete
function macro_start(request) {
    console.log("dom status :",document.readyState);
    if(document.readyState == 'interactive' || document.readyState == 'complete') {
        interpark.interparkMacro(request);
    }
    else (
        document.addEventListener('readystatechange', async event => {
            if (event.target.readyState === 'interactive') {
                interpark.interparkMacro(request);
            }
        })
    )
    
}



// "content_scripts": [{
//     "matches": ["http://*/*", "https://*/*"],
//     "js": ["content.js"]
//   }],
// document.addEventListener('DOMContentLoaded',);


