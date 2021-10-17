export {asyncGetDom, asyncGetDomAll, regExp, sleep, statusLog, multiRemoveTxt};

function statusLog(status, msg) {
    console.log(status," - ",msg);
}
// let reg = new RegExp("(SelectSeat\()[\s\S]+\)", "g");
function regExp(exp, str) {
    let reg = new RegExp(exp, "g");
    let reg_result = reg.exec(str);
    console.log("regExp : ",reg_result);
    return reg_result[0];
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

function multiRemoveTxt(string, txt1, txt2=null, txt3=null) {
    string = string.replaceAll(txt1,'');
    if(txt2) string = string.replaceAll(txt2,'');
    if(txt3) string = string.replaceAll(txt3,'');
    return string;
}

async function asyncGetDom(id, iframe1=undefined, iframe2=undefined, iframe3=undefined) {
    let ret = null;
    let retry = 3;
    let type = 0;
    if(id && iframe1 && !iframe2 && !iframe3) type=1;
    else if(id && iframe1 && iframe2 && !iframe3) type=2;
    else if(id && iframe1 && iframe2 && iframe3) type=3;

    try {
        for(let i=0; i<retry; i++) {
            switch(type) {
                case 0:
                    ret = document.querySelector(id);
                    break;
                case 1:
                    ret = document.querySelector(iframe1).contentDocument.querySelector(id);
                    break;
                case 2:
                    ret = document.querySelector(iframe1).contentDocument.querySelector(iframe2).contentDocument.querySelector(id);
                    break;
                case 3:
                    ret = document.querySelector(iframe1).contentDocument.querySelector(iframe2).contentDocument.querySelector(iframe3).contentDocument.querySelector(id);
                    break;
            }
            if(ret) break;
            else {
                console.log("[",id,"] get Dom Fail. retry count : ",i+1);
                await sleep(500);
            }
        }
    } catch(error) {
        console.log("[",id,"] getDom Error : ",error);
    }
    return ret;
}

async function asyncGetDomAll(id, iframe1=undefined, iframe2=undefined, iframe3=undefined) {
    let ret = null;
    let retry = 3;
    let type = 0;
    if(id && iframe1 && !iframe2 && !iframe3) type=1;
    else if(id && iframe1 && iframe2 && !iframe3) type=2;
    else if(id && iframe1 && iframe2 && iframe3) type=3;

    try {
        for(let i=0; i<retry; i++) {
            switch(type) {
                case 0:
                    ret = document.querySelectorAll(id);
                    break;
                case 1:
                    ret = document.querySelector(iframe1).contentDocument.querySelectorAll(id);
                    break;
                case 2:
                    ret = document.querySelector(iframe1).contentDocument.querySelector(iframe2).contentDocument.querySelectorAll(id);
                    break;
                case 3:
                    ret = document.querySelector(iframe1).contentDocument.querySelector(iframe2).contentDocument.querySelector(iframe3).contentDocument.querySelectorAll(id);
                    break;
            }
            if(ret) break;
            else {
                console.log("get Dom Fail. retry count : ",i+1);
                await sleep(500);
            }
        }
    } catch(error) {
        console.log("getDom Error : ",error);
    }
    return ret;
}