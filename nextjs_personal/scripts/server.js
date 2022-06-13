// 서버에서만 사용되는 js 파일
const fs = require('fs');
const filePath='./temp/data.json';
const server = {
    readJson : () => {
        fs.readFile('')
    },
    saveJson : (json) => {
        let data;
        if(!fs.existsSync(filePath)) {
            if(!fs.existsSync('./temp')) fs.mkdirSync('./temp');
            fs.writeFile(filePath, '', (err)=> {if(err) console.log('err : ',err)});
            data = {};
        }
        else data = JSON.parse(fs.readFileSync(filePath));
        for(var v of Object.keys(json)) {
            // console.log(Object.keys(json), v);
            data[v] = json[v];
        }
        console.log("data 읽음 : ",data, "json data : ", json);
        fs.writeFileSync(filePath, JSON.stringify(data));
    }
};
export default server;