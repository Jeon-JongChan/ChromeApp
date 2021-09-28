
//alert("content script!");
console.log("content scripts!");
//document.body.style.backgroundColor='orange';
function macro_start() {
    console.log("Macro START!");
}

chrome.runtime.sendMessage({greeting:"HiTest"}, function(respone) {
    console.log("content-message in",respone);
});

// "content_scripts": [{
//     "matches": ["http://*/*", "https://*/*"],
//     "js": ["content.js"]
//   }],
/*
//콘텐츠에 해당 스크립트 동적삽입 -> 함수호출이 컨텐츠에서 가능해짐
function make_script() {
    s = document.createElement('script');
    s.src = chrome.runtime.getURL('content.js');
    console.log(s.src);
    document.head.appendChild(s);
    s.remove();
}
*/