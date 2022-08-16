import { useState } from "react";
import Link from "next/link"
import api from "../scripts/common"

export default function Test(props) {
    let [url, setUrl] = useState('');
    const testMacro = async (method) => {
        let inputUrl = document.querySelector('#macro-url').value;
        setUrl(inputUrl);
        if(method == 'test') {
            await api.fetchPostJson('/api/macro/test',{url : url,test1:'test', test2:['3333','1111'], test3 : {test11:'11'}});
        }
    }

    const getInitdata = async () => {
        await fetch('/api/macro/test');
    }
    
    return (
        <>
        <div>
            <pre>
                test 화면입니다.
                헬로~~~~~~~~~~~~~~~~~~~~~~~~~ 넥스트
                {props?props.id:'b'}
            </pre>
            <input id='macro-url'></input>
            <button onClick={()=>testMacro('start')}>
                매크로 시작
            </button>
            <button onClick={()=>testMacro('close')}>
                매크로 종료
            </button>
            <button onClick={()=>testMacro('reload')}>
                매크로 리로드
            </button>
            <button onClick={()=>testMacro('test')}>
                클라이언트 함수 테스트
            </button>
            <button onClick={()=>getInitdata()}>
                init 함수 호출
            </button>
            <div><span>{url ? '매크로에 지정된 url : '+url : '매크로 작동 x'}</span></div>
        </div>
        <style jsx>{`
        
        `}</style>
        </>
    )
}
