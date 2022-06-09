import Link from "next/link"

export default function Test(props) {
    const testMacro = async (method) => {
        await fetch('/api/macro/'+method);
    }
    return (
        <div>
            <pre>
                test 화면입니다.
                헬로~~~~~~~~~~~~~~~~~~~~~~~~~ 넥스트
                {props?props.id:'b'}
            </pre>
            <button onClick={()=>testMacro('start')}>
                매크로 시작
            </button>
            <button onClick={()=>testMacro('close')}>
                매크로 종료
            </button>
            <button onClick={()=>testMacro('reload')}>
                매크로 리로드
            </button>
        </div>
    )
}
