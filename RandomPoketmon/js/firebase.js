function firebaseSaveFile(path, file) {
    let storeRef = storage.ref();
    let storePath = storeRef.child(path);
    let storeUpload = storePath.put(file);

    console.log("firebase 파일 업로드 : ",storeUpload);
}

function firebaseGetFileUrl(path) {
    var storeRef = storage.ref();
    var item = storeRef.child(path);
    return item.getDownloadURL()
}

function firebaseSaveJson(json) {
    var ret = database.ref('json/').set(JSON.stringify(json))
    .then((value)=>{console.log("data 추가 완료 : ",value)})
    .catch((error)=>{console.log("data 추가 실패 : ",error)});
    //console.log("json data를 추가합니다", json, ret);
}
