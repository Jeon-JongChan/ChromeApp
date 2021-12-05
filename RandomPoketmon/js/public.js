function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}
function getDomIndex(dom, elem=null) {
    if(!elem) elem = dom.parentNode;
    var idx = null;
    for(var i = 1; i < elem.childNodes.length; i++) {
      if (elem.childNodes[i] === dom) {
        //console.log(elem, elem.childNodes[i],dom,'elemIndex = ', i);
        idx = i;
        break;
      }
    }
    return idx;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값도 미포함, 최솟값만 포함
}

function getRandomValue(values) {
    let idx = getRandomInt(0, values.length);
    return values[idx];
}
function getNameIdx(objArr, name) 
{
    for(let i=0; i<objArr.length; i++) {
      if(objArr[i].name===name) {
        return i;
      }
    }
    return -1;
}
function copyToClipBoard(query) {
    var content = document.querySelector(query).innerText;

    navigator.clipboard.writeText(content)
        .then(() => {
        alert("텍스트만 복사되었습니다.");
        console.log("Text copied to clipboard...")
    })
        .catch(err => {
        console.log('Something went wrong', err);
    })
}