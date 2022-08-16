// 서버에서만 사용되는 js 파일
const fs = require('fs');
const db = require('better-sqlite3')('temp/macro.db',  { verbose: console.log });

const filePath='./temp/data.json';
const server = {
    json : {
        read : (key,id='root') => {
            if(!fs.existsSync(filePath)) {
                return null;
            }
            else {
                data = JSON.parse(fs.readFileSync(filePath));
                if(!data[id]) {
                    console.log("readJson > 해당 id로 저장된 데이터가 없습니다.");
                    return null;
                }
                if(key) return data[id][key];
            }
            return null;
        },
        save : (json, id='root') => {
            let data;
            if(!fs.existsSync(filePath)) {
                if(!fs.existsSync('./temp')) fs.mkdirSync('./temp');
                fs.writeFile(filePath, '', (err)=> {if(err) console.log('err : ',err)});
                data = {};

            }
            else data = JSON.parse(fs.readFileSync(filePath));
            if(!data[id]) data[id] = {};
            console.log("saveJson",json, Object.keys(json));
            for(var v of Object.keys(json)) {
                console.log(id, Object.keys(json), v,json[v],data[id]);
                data[id][v] = json[v];
            }
            //console.log("data 읽음 : ",data, "json data : ", json);
            fs.writeFileSync(filePath, JSON.stringify(data));
        },
        remove : (key, id='root') => {
            if(!key) {
                console.log('removeJson > key is undefined');
                return null;
            }
            let json = server.readJson();
            let data = {};
            if(!json[id]) {
                console.log("removeJson > 해당 id로 저장된 데이터가 없습니다.");
                return null;
            }
            for(var v of Object.keys(json[id])) {
                if(v == key) {
                    console.log(key+' is delete');
                    continue;
                }
                data[id][v] = json[id][v];
            }
            fs.writeFileSync(filePath, JSON.stringify(data));
        }
    },
    db : db
};

// function initDB() {
//     server.db.exec("CREATE TABLE IF NOT EXISTS users('ID' varchar(20), PASSWORD VARCHAR(64))");
//     console.log('init db process');
// }
//initDB();
export default server;