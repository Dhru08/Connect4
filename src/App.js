import React from 'react';
import Navbar from './components/Navbar';
import PvPBoard from './components/PvPBoard';
import PvAIBoard from './components/PvAIBoard';
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Navbar title="Connect4" />
            <Routes>
                <Route key="home" exact path="/" element={<PvPBoard />} />
                <Route key="PvP" exact path="/PvP" element={<PvPBoard />} />
                <Route key="PvAI" exact path="/PvAI" element={<PvAIBoard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
