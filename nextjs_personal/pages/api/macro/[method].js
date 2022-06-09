import macro from '../../../server/macro'
export default function handler(req, res) {
    let method = req.query.method;
    console.log("api 실행 :"+method);
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
