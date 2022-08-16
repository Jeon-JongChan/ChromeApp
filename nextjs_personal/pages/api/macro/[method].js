import macro from '../../../scripts/macro/macro'
import server from '../../../scripts/server'
export default function handler(req, res) {
    let method = req.query.method;
    let url = req.body.url;
    console.log("api 실행 :"+method, req.body,req);
    /*
    if(!url) {
        res.status(200).json({ status: 'Fail. Undefined URL' });
        return;
    }
    */
    //console.log("파일 저장 : ", req.body);
    if(req.body?.id) server.saveJson(req.body, req.body.id);
    else server.saveJson(req.body);
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
    else if(method === 'test') {
        if(req.body?.id) server.saveJson(req.body, req.body.id);
        else server.saveJson(req.body);
    }
    else if(method === 'getinit') {
        //let initdata = server
        //res.status(200).json();
    }
    res.status(200).json({ status: 'Fail. Undefined URL' });
}
