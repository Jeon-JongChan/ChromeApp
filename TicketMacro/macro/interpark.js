import {sleep, statusLog, asyncGetDom, asyncGetDomAll, regExp, multiRemoveTxt} from "../public.js";
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
            let data = await interparkSeatList();
            console.log(data);
            interparkSeatSummit(data);
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
    //img:not(#MainMap)
    let seatList = await asyncGetDomAll('#TmgsTable .stySelectSeat','#ifrmSeat','#ifrmSeatDetail');
    statusLog('Step2',"좌석 정보 저장을 시작합니다.");
    //console.log(seatList);
    //document.querySelector('#ifrmSeat').contentDocument.querySelector('#ifrmSeatDetail').contentDocument.querySelectorAll('#TmgsTable img:not(#MainMap)');
    let seatBuffer = {
        seat : new Array(),
        data : new Array(),
        detail : new Array()
    }

    for(let idx=0; idx<10; idx++) {
        let seat = seatList[idx];
        let outerHTML = seat.outerHTML.toString();
        let reg = regExp('(SelectSeat\\()[\\s\\S]+\\)',outerHTML);
        let seatData = parseSeat(reg);
        let seatDetail = [];
        seatDetail.push(seatData[2].replace('층',''));
        seatDetail.push(seatData[3].replace('열','').split('구역'));
        seatBuffer.seat.push(seat);
        seatBuffer.data.push(seatData);
        seatBuffer.detail.push(seatDetail);
        //console.log('Step2',"TEST SEAT REGEXP : ",reg);
        //console.log(seatData,seatDetail);
    }
    return seatBuffer;
}
function parseSeat(rowdata) {
    rowdata = multiRemoveTxt(rowdata,'SelectSeat(',')',"'");
    rowdata = multiRemoveTxt(rowdata,' ');
    rowdata = rowdata.split(',');
    return rowdata;
}
async function interparkSeatPriority(data) {
    let seatLimit = 1;
    let ret = new Array();

    for(let i=0; i < data.length; i++) {
        if(ret.length >= seatLimit) break;
        let detail = data[i].detail;
        if(detail[0] == 1) {
            if(seatPriorityCheck(detail[1])) ret.push(data[i].data);
        }
        else if(detail[0] == 2) {
            if(seatPriorityCheck(detail[1],1)) ret.push(data[i].data);
        }
    }
    return ret;
}
function seatPriorityCheck(pos, checkCnt=6) {
    let prioriy = [['B',3],['C',3],['A',3],['B',6],['C',6],['A',6]];

    for(let i=0; i<checkCnt; i++) {
        let startCol = prioriy[i][1]-2;
        if(pos[0] === prioriy[i][0]) {
            if(pos[1] >= startCol && pos[1] <= prioriy[i][1]) {
                return true;
            }
        }
    }
    return false;
}
async function interparkSeatSummit(data) {
    let iframe = (await asyncGetDom('#ifrmSeat')).contentDocument;
    let ifrmSeatDetail = (await asyncGetDom('#ifrmSeatDetail','#ifrmSeat')).contentDocument;

    let selectSeats = await interparkSeatPriority(data);
    console.log("PlaySeq data : ",document.querySelector('#PlaySeq').value);
    if(selectSeats.length == 0) {
        alert("선택할 좌석이 존재하지 않습니다");
        return null;
    }
    if(iframe && ifrmSeatDetail) {
        statusLog('Step2',"좌석 정보를 업그레이드 합니다.");
        let playseq = iframe.querySelector('#PlaySeq');
        let seatList = ifrmSeatDetail.querySelectorAll('#TmgsTable img:not(#MainMap)');
        //console.log(seatList[0]);
    }
}
function fnSetPointDiscount(SeatBuffer){
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