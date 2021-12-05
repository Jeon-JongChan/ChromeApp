  async function initAdminPage() {
    getJsonData();
    await sleep(2000);
    let template = document.querySelector("template").content;
    initPoketAdmin(template);
    initLocalAdmin(template);
    initSpecAdmin(template);
  }

  async function initPoketAdmin(template=null) {
    if(!template) template=document.querySelector("template").content;
    /*포켓몬 리스트 초기화*/
    let list = document.querySelector(".poketmon-list");
    let dom_template = template.querySelector(".poketmon");
    console.log("포켓몬 리스트 초기화 시작", json);
    for(var i=0; i<json.poketmon.length; i++) {
      list.appendChild(await nodePoketmon(json.poketmon[i], dom_template));
    }
  }
  async function nodePoketmon(poketmon, templateNode=null) {
    if(!templateNode) {
      templateNode = document.querySelector("template").content.querySelector(".poketmon");
    }
    let dom = templateNode.cloneNode(true);
    dom.querySelector(".poket-img").style.backgroundImage= "url('"+await firebaseGetFileUrl(poketmon.image)+"')";
    dom.querySelector(".poket-name").innerText = poketmon.name;
    dom.querySelector(".poket-local").innerText = poketmon.local;
    dom.querySelector(".poket-rare").innerText = poketmon.rare;
    dom.querySelector(".poket-type").innerText = poketmon.type;
    dom.querySelector(".poket-personal").innerText = poketmon.personal[0]+","+poketmon.personal[1];
    dom.querySelector(".poket-personal-hidden").innerText = poketmon.personal[2];
    return dom;
  }
  function initLocalAdmin(template=null) {
    if(!template) template=document.querySelector("template").content;
    list = document.querySelector(".local-list");
    dom_template = template.querySelector(".local");
    console.log("지역 리스트 초기화 시작");//, list, dom_template, json.local);
    
    for(var i=0; i<json.local.length; i++) {    
      list.appendChild(nodeLocal(json.local[i],dom_template));
    }
  }
  function nodeLocal(local, templateNode=null) {
    if(!templateNode) {
      templateNode = document.querySelector("template").content.querySelector(".local");
    }
    let dom = templateNode.cloneNode(true);
    let name = local.name;
    let poketCount = localPoketCount(name);
    dom.querySelector(".local-name").innerText = name;
    if(poketCount !== 0) dom.querySelector(".local-count").innerText = "( "+poketCount+" )";
    return dom;
  }
  function initSpecAdmin(template=null) {
    if(!template) template=document.querySelector("template").content;
    list = document.querySelector(".spec-list");
    dom_template = template.querySelector(".spec");
    console.log("성격 리스트 초기화 시작");//, list, dom_template, json.spec);
    
    for(var i=0; i<json.spec.length; i++) {
      list.appendChild(nodeSpec(json.spec[i],dom_template));
    }
  }
  function nodeSpec(spec, templateNode=null) {
    if(!templateNode) {
      templateNode = document.querySelector("template").content.querySelector(".spec");
    }
    let dom = templateNode.cloneNode(true);
    let name = spec.name;
    dom.querySelector(".spec-name").innerText = name;
    return dom;
  }
  async function beforeAddData() {
    if(json == null) {
      console.log("화면로딩에 필요한 데이터가 존재하지 않습니다.");
    }
    getJsonData();
    await sleep(1000);
  }
  async function addPoketmon() {
    await beforeAddData();
    
    let file = document.querySelector('#image-poketmon');
    let name = document.querySelector('.add-poketname .input-text');
    let local = document.querySelector('.add-local .input-text');
    let rare = document.querySelector('.add-rare .input-text');
    let type = document.querySelector('.add-poket-type .input-text');
    let personal = document.querySelectorAll('.add-poketmon .add-personal input');

    let imgPath = 'image/'+name.value;
    firebaseSaveFile(imgPath, file.files[0]);

    let poketmon = {
      name : name.value,
      image : imgPath,
      local : local.value,
      rare : rare.value,
      type : type.value,
      personal : [personal[0].value, personal[1].value, personal[2].value]
    }
    
    json.poketmon.push(poketmon);
    firebaseSaveJson(json);

    name.value='';
    console.log("포켓몬 추가 완료",json);
    refreshAdmin("poketmon");
    rewriteLocalCount(poketmon.local);
  }

  async function addLocal() {
    await beforeAddData();
    
    let name = document.querySelector('add-local-name .input-text');
    let local = {
      name : name.value
    }
    json.local.push(local);
    firebaseSaveJson(json);

    name.value='';
    console.log("특성 추가 완료",json);
    refreshAdmin("personal");
  }
  async function addSpec() {
    await beforeAddData();
    
    let name = document.querySelector('.add-spec-name .input-text');
    let spec = {
      name : name.value
    }
    json.spec.push(spec);
    firebaseSaveJson(json);

    name.value='';
    console.log("특성 추가 완료",json);
    refreshAdmin("spec");
  }
  
  function deletePoketData(type) {
    getJsonData();
    let target = event.target.parentNode;
    let idx = getDomIndex(target)-1;
    target.remove();
    
    if(type=="poketmon") {
      let poketmon = json.poketmon.splice(idx,1);
      if(poketmon.length > 0) rewriteLocalCount(poketmon[0].local);
    }
    else if(type=="spec") {
      json.spec.splice(idx,1);
    }
    else if(type=="local") {
      json.local.splice(idx,1);
    }
    console.log("deletePoketData 완료 : ",json);
    firebaseSaveJson(json);
  }

  async function refreshAdmin(type) {
    getJsonData();
    await sleep(1000);
    console.log("refreshAdmin - ",type," : 다시그리기 시작");
    if(type=="poketmon") {
        let parentNode = document.querySelector(".poketmon-list");
        let childLen = parentNode.childElementCount;
        for(let i=childLen; i<json.poketmon.length; i++) {
            let dom = await nodePoketmon(json.poketmon[i]);
            parentNode.appendChild(dom);
        }
    }
    else if(type=="spec") {
        let parentNode = document.querySelector(".spec-list");
        let childLen = parentNode.childElementCount;
        for(let i=childLen; i<json.spec.length; i++) {
            let dom = nodeSpec(json.spec[i]);
            parentNode.appendChild(dom);
        }
    }
    else if(type=="local") {
        let parentNode = document.querySelector(".local-list");
        let childLen = parentNode.childElementCount;
        for(let i=childLen; i<json.local.length; i++) {
            let dom = nodeLocal(json.local[i]);
            parentNode.appendChild(dom);
        }
    }
}
function localPoketCount(localName) {
    let ret = 0;
    for(let i=0; i<json.poketmon.length; i++) {
        let poketmon = json.poketmon[i];
        if(poketmon.local===localName) ret += 1
    }
    return ret;
}
function rewriteLocalCount(localName) {
    let idx = getNameIdx(json.local, localName);
    console.log("rewriteLocalCount - ",localName," 카운트 수정중... idx : ", idx);
    let localNode = document.querySelectorAll(".local-list .local")[idx];
    if(localNode)
    {
      let poketCount = localPoketCount(localName);
      localNode.querySelector(".local-count").innerText = "( "+poketCount+" )";
    }
}