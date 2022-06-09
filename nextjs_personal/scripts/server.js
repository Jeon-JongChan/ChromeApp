// 서버에서만 사용되는 js 파일
const fs = require('fs');
const server = {
    readJson : () => {
        fs.readFile('')
    },
    saveJson : (json) => {
        fs.writeFileSync("../temp/data.json", JSON.stringify(json));
    }
};
export default server;