import {sleep, statusLog, asyncGetDom, asyncGetDomAll, regExp} from "../public.js";
export {interparkMacro};

async function interparkMacro(request) {
    console.log("Interpark Macro Start. Status : ",request.status);
    if(request.status == 'Step1') {
        statusLog(request.status,"팝업을 제거하고 날짜를 선택");
        // 팝업 제거
        
        let popup = await asyncGetDom('#popup-prdGuide');
        if(popup) {
            popup.remove();
            statusLog(request.status,"팝업 제거 완료");
        }

        let picker = await asyncGetDom('.datepicker-panel ul[data-view="days"]');
        let pickedDate = picker.querySelector('.picked');
        let changePick = picker.querySelector(':not(.disabled):not(.muted):not(.picked)');
        pickedDate.classList.remove('picked');
        changePick.click();
        let dateList = picker.querySelectorAll(':not(.disabled):not(.muted)');
        // 티켓예약사이트 띄우기
        let sitBtn = document.querySelector('.sideBtn.is-primary');
        if(sitBtn) sitBtn.click();

    }
    else if(request.status == 'Step2') {
        statusLog(request.status," - 좌석 지정 선택");

        let iframe = await asyncGetDom('#ifrmSeat');
        if(iframe) {
            interparkRecapRemove(request.status);
            interparkSeatList(request.status);
            interparkSeatSummit(request.status);
            //let sheetList = iframe.contentDocument.querySelector('#ifrmSeatDetail').contentDocument.querySelectorAll('#TmgsTable img:not(#MainMap)');
            //let sheetNextBtn = iframe.contentDocument.querySelector('#NextStepImage');
            //sheetList[0].click();
            //sheetNextBtn.click();
            //chrome.runtime.sendMessage({site:"Interpark",status:"Step3"});
        } else {
            console.log(request.status," - ifrmSeat None");
        }
    }
    else if(request.status == 'Step3') {
        console.log("Step3 : ticket paid");
        let select = document.querySelector('#ifrmBookStep').contentDocument.querySelector('.Tb_price select');
        let nextBtn = document.querySelector('#SmallNextBtnImage');
        //console.log("Step3 select : ", select,select.onchange);
        select.value = 1;
        let e = new Event('change');
        select.dispatchEvent(e);
        nextBtn.click();

        chrome.runtime.sendMessage({site:"Interpark",status:"Step4"});
    }
    else if(request.status == 'Step4') {
        console.log("Step4 : address selected");
        let ymd = document.querySelector('#ifrmBookStep').contentDocument.querySelector('#YYMMDD');
        let nextBtn = document.querySelector('#SmallNextBtnImage');
        console.log(ymd);
        ymd.value = '931231';
        nextBtn.click();
    }
    //
}

async function interparkRecapRemove() {
    let ifrmSeat = await asyncGetDom("#ifrmSeat");
    if(ifrmSeat) {
        statusLog('Step2',"Recaptcha 제거를 시작합니다.");
        ifrmSeat.contentDocument.querySelector("#divRecaptcha").remove();
        ifrmSeat.contentDocument.querySelector("#divRecaptchaWrap").remove();
        ifrmSeat.contentDocument.querySelector("#rcckYN").value = "Y";
    }
}

async function interparkSeatList() {
    let seatList = await asyncGetDomAll('#TmgsTable img:not(#MainMap)','#ifrmSeat','#ifrmSeatDetail');
    statusLog('Step2',"좌석 정보 저장을 시작합니다.");
    console.log(seatList);
    //document.querySelector('#ifrmSeat').contentDocument.querySelector('#ifrmSeatDetail').contentDocument.querySelectorAll('#TmgsTable img:not(#MainMap)');
    let seatBuffer = {
        seat : new Array(),
        data : new Array(),
    }

    for(let idx=0; idx<1; idx++) {
        let seat = seatList[idx];
        let outerHTML = seat.outerHTML.toString();
        let reg = regExp('(SelectSeat\\()[\\s\\S]+\\)',outerHTML);
        console.log('Step2',"TEST SEAT REGEXP : ",reg);
        let seat_obj = parseSeat(reg[0]);
        seatBuffer.seat.push(seat);

    }
}
function parseSeat(rowdata) {
    rowdata = rowdata.replaceAll('SelectSeat(','');
    rowdata = rowdata.replaceAll(')','');
    return rowdata.split(',');
}

async function interparkSeatSummit() {
    let iframe = (await asyncGetDom('#ifrmSeat')).contentDocument;
    let ifrmSeatDetail = (await asyncGetDom('#ifrmSeatDetail','#ifrmSeat')).contentDocument;
    if(iframe && ifrmSeatDetail) {
        statusLog('Step2',"좌석 정보를 업그레이드 합니다.");
        let playseq = iframe.querySelector('#PlaySeq');
        let seatList = ifrmSeatDetail.querySelectorAll('#TmgsTable img:not(#MainMap)');
        console.log(seatList[0]);
    }
}
//콘텐츠에 해당 스크립트 동적삽입 -> 함수호출이 컨텐츠에서 가능해짐
function make_script() {
    s = document.createElement('script');
    s.src = chrome.runtime.getURL('content.js');
    console.log(s.src);
    document.head.appendChild(s);
    s.remove();
}

/*
document.querySelector("#ifrmSeat").contentDocument.querySelector("#rcckYN")
document.querySelector("#ifrmSeat").contentDocument.querySelector(".btnWrap a").addEventListener("click",()=>{ 
    console.log(fnSetPointDiscount.toString());
    if(SeatBuffer.index==0){
        alert("좌석을 선택하세요.");
        return;
    }
    if(IsHanwhaCouple){
        if (SeatBuffer.index%2!= 0){
            alert("커플석은 짝수로 구입하셔야 합니다");
            return;
        }
    }
    if(CaptchaYN=="Y") {
        var rcckYN = document.getElementById("rcckYN").value;
        if(rcckYN!="Y") {
            capchaShowSeat();
            return;
        }
    }
    if(SelectAble){
        fnSetPointDiscount();
    }
})
interparkRecapRemove() {
    document.querySelector("#ifrmSeat").contentDocument.querySelector("#divRecaptcha").remove();
    document.querySelector("#ifrmSeat").contentDocument.querySelector("#divRecaptchaWrap").remove();
}
capchaShowSeat(){
	j$("#divRecaptcha").show();
	j$("#divRecaptchaWrap").show();
	j$("#divCaptchaFolding").hide();
	j$(".capchaFloating").hide();
	j$(".capchaBtns a").eq(0).text("좌석 다시 선택");
}
function fnCheckOK() {
	capchaHide();
	j$(".capchaFloating").hide();
	vCaptchaFailCnt=0;
	document.getElementById("rcckYN").value="Y";
	//j$(".validationTxt").removeClass("setTxt").addClass("ok");
	if(SeatBuffer.index>0) {
		fnSelect();
	}
}
function fnCheckOK() {
	capchaHide();
	j$(".capchaFloating").hide();
	vCaptchaFailCnt=0;
	document.getElementById("rcckYN").value="Y";
	//j$(".validationTxt").removeClass("setTxt").addClass("ok");
	if(SeatBuffer.index>0) {
		fnSelect();
	}
}
*/
/*
function fnSelect(){
    console.log(fnSetPointDiscount);
    if(SeatBuffer.index==0){
        alert("좌석을 선택하세요.");
        return;
    }
    if(IsHanwhaCouple){
        if (SeatBuffer.index%2!= 0){
            alert("커플석은 짝수로 구입하셔야 합니다");
            return;
        }
    }
    if(CaptchaYN=="Y") {
        var rcckYN = document.getElementById("rcckYN").value;
        if(rcckYN!="Y") {
            capchaShowSeat();
            return;
        }
    }
    if(SelectAble){
        console.log(fnSetPointDiscount);
    }
}
function fnSetPointDiscount(){
    SelectAble = false;
        //선블럭킹 확인

    var SeatGrade = "";
    var Floor = "";
    var RowNo = "";
    var SeatNo = "";

    for(i=0;i<SeatBuffer.index;i++){
        o = SeatBuffer.pop(i);
        SeatGrade = SeatGrade + "" + o.SeatGrade + "^";
        Floor = Floor + "" + o.Floor + "^";
        RowNo = RowNo + "" + o.RowNo + "^";
        SeatNo = SeatNo + "" + o.SeatNo + "^";
    }
    $("frmInfo").Flag.value = "Blocking";
    $("frmInfo").PlaySeq.value = $F("PlaySeq");
    $("frmInfo").SeatCnt.value = SeatBuffer.index;
    $("frmInfo").SeatGrade.value = SeatGrade;
    $("frmInfo").Floor.value = Floor;
    $("frmInfo").RowNo.value = RowNo;
    $("frmInfo").SeatNo.value = SeatNo;
    $("frmInfo").submit();

}
*/