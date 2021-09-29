console.log("content scripts!");
waitContent();

async function waitContent() {
    if(location.host=="poticket.interpark.com") {
        chrome.runtime.sendMessage({site:"Interpark",status:"Step2"});
    }
}


chrome.runtime.onMessage.addListener(function (request,sender,sendRespone) {
    console.log("Content Message Receive. request",request);
    if(request.site=='Interpark') {
        document.addEventListener('DOMContentLoaded',interparkMacro(request));
    }
})

async function interparkMacro(request) {
    console.log("Interpark Macro Start. Status : ",request.status);
    if(request.status == 'Step1') {
        console.log("Step1 : ", document.querySelector('#popup-prdGuide'));
        // 팝업 제거
        await sleep(1000);
        
        let popup = document.querySelector('#popup-prdGuide');
        if(popup) popup.remove();

        let picker = document.querySelector('.datepicker-panel ul[data-view="days"]');
        let pickedDate = picker.querySelector('.picked');
        let changePick = picker.querySelector(':not(.disabled):not(.muted):not(.picked)');
        pickedDate.classList.remove('picked');
        changePick.click();
        let dateList = picker.querySelectorAll(':not(.disabled):not(.muted)');
        // 티켓예약사이트 띄우기
        let sitBtn = document.querySelector('.sideBtn.is-primary');
        if(sitBtn) sitBtn.click();

    }
    if(request.status == 'Step2') {
        console.log("Step2 : sheet select progress");
        let iframe = document.querySelector('#ifrmSeat').contentDocument;
        let sheetList = iframe.querySelector('#ifrmSeatDetail').contentDocument.querySelectorAll('#TmgsTable img:not(#MainMap)');
        let sheetNextBtn = iframe.querySelector('#NextStepImage');
        console.log(iframe, sheetNextBtn);
        //console.log(iframe," --- ", iframe.contentDocument.querySelectorAll('#TmgsTable img:not(#MainMap)'));
        sheetList[0].click();
        sheetNextBtn.click();

        chrome.runtime.sendMessage({site:"Interpark",status:"Step3"});
    }
    if(request.status == 'Step3') {
        console.log("Step3 : ticket paid");
        let select = document.querySelector('#ifrmBookStep').contentDocument.querySelector('.Tb_price select');
        let nextBtn = document.querySelector('#SmallNextBtnImage');
        console.log("Step3 select : ", select,select.onchange);
        select.value = 1;
        let e = new Event('change');
        select.dispatchEvent(e);
        nextBtn.click();

        chrome.runtime.sendMessage({site:"Interpark",status:"Step4"});
    }
    if(request.status == 'Step4') {
        console.log("Step4 : address selected");
        let ymd = document.querySelector('#ifrmBookStep').contentDocument.querySelector('#YYMMDD');
        let nextBtn = document.querySelector('#SmallNextBtnImage');
        console.log(ymd);
        ymd.value = '931231';
        nextBtn.click();
    }
    //
}
function macro_start() {
    console.log("Macro START!");
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

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