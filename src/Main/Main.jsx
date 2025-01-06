import Input from '../Input/Input.jsx';
import {useEffect, useRef} from 'react';

function Main() {

    const delay = 3000;

    function callbackFn() {
        return console.log('call');
    }

    const cbRef = useRef(callbackFn);
    cbRef.current = callbackFn;

    useEffect(
        () => {
            setTimeout(callbackFn, 2000)
        }, [delay]
    )

    return(
        <main>
            Main content
            <Input />
        </main>
    )
}

export default Main;