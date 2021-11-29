function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}
function getDomIndex(dom) {
    var elem = dom.parentNode;
    var idx = null;
    for(var i = 0; i < elem.childNodes.length; i++) {
      if (elem.parentNode.childNodes[i] === dom) {
        console.log('elemIndex = ' + i);
        idx = i;
        break;
      }
    }
    return idx;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값도 포함, 최솟값도 포함
}

function getRandomValue(values) {
    let idx = getRandomInt(0, values.length);
    return values[idx];
}