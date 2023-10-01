import React from 'react';
import Board from './components/Board';
import Navbar from './components/Navbar';

function App() {
    return (
        <>
            <Navbar title="Connect4"/>
            <Board />
        </>
    );
}

export default App;
