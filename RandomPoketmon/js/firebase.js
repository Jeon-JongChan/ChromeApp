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
const firebaseConfig = {
    apiKey: "AIzaSyCLo_Cace8XvBb2CdLGzG3ESbxIQ3Lvv6Y",
    authDomain: "temp-c63a4.firebaseapp.com",
    databaseURL: "https://temp-c63a4-default-rtdb.firebaseio.com",
    projectId: "temp-c63a4",
    storageBucket: "temp-c63a4.appspot.com",
    messagingSenderId: "625744818131",
    appId: "1:625744818131:web:900cf6b91b366e68b30926"
};