// 서버에서만 사용되는 js 파일
const fs = require('fs');
const filePath='./temp/data.json';
const server = {
    readJson : () => {
        fs.readFile('')
    },
    saveJson : (json) => {
        if(!fs.existsSync(filePath)) {
            fs.writeFile(filePath, '', (err)=>console.log(err));
        }
        console.log(Object.keys(json), Object.values(json))
        fs.writeFileSync(filePath, JSON.stringify(json));
    }
};
export default server;