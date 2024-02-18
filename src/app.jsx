import { useState } from 'react';
import Main from './Main/Main.jsx';

const App = () => {
    const [count, setCount] = useState(0);

    return (
        <>
            <Main />
        </>
    );
};

export default App;