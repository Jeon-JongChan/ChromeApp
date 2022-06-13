import macro from '../../../scripts/macro/macro'
import server from '../../../scripts/server'
export default function handler(req, res) {
    let method = req.query.method;
    let url = req.body.url;
    console.log("api 실행 :"+method, req.body);
    /*
    if(!url) {
        res.status(200).json({ status: 'Fail. Undefined URL' });
        return;
    }
    */
    console.log("파일 저장 : ", req.body);
    server.saveJson(req.body);
    res.status(200).json({ status: 'Fail. Undefined URL' });
    

    if(method === 'start') {
        macro.start();
        res.status(200).json({ status: 'John Doe' });
    }
    else if(method === 'close') {
        macro.close();
        res.status(200).json({ status: 'John Doe' });
    }
    else if(method === 'reload') {
        macro.macro();
        res.status(200).json({ status: 'John Doe' });
    }
}
