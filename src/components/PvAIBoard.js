import React, { useState, useEffect } from 'react';
import './Board.css';
import Tile from './Tile';
import PlayerInfo from './PlayerInfo';
import { initializeBoard, checkWin, AImove } from './BoardUtils';

const playerRed = 'R';
const playerYellow = 'Y';
const rows = 6;
const cols = 7;
const maxMoves = rows * cols;

const Board = () => {
    const [currPlayer, setCurrPlayer] = useState(playerRed);
    const [gameOver, setGameOver] = useState(false);
    const [board, setBoard] = useState(initializeBoard());
    const [currColumns, setCurrColumns] = useState(Array.from({ length: cols }, () => rows - 1));
    const [moves, setMoves] = useState(0);
    const [winner, setWinner] = useState(null);

    /* eslint-disable */
    useEffect(() => {
        if (gameOver || currPlayer === playerRed) {
            return;
        }

        const timerId = setTimeout(() => {
            const aiColumn = AImove(board,currColumns);
            makeMove(aiColumn);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [currPlayer, gameOver, currColumns]);
    /* eslint-enable */

    function handleTileClick(c) {
        if (gameOver || currPlayer === playerYellow) {
            return;
        }

        const r = currColumns[c];
        if (r < 0) {
            // show some kind of alert message
            return;
        }

        makeMove(c);
    }

    function makeMove(c) {

        console.log(c);
        console.log(currColumns);

        if(typeof c === 'undefined'){
            console.log("Why c?");
            return;
        }

        const r = currColumns[c];

        if(typeof r === 'undefined'){
            console.log("Why r?");
            return;
        }

        const newColumns = [...currColumns];
        newColumns[c] -= 1;
        const newBoard = [...board];
        newBoard[r][c] = currPlayer;

        setBoard(newBoard);
        setCurrColumns(newColumns);
        setMoves((prevMoves) => prevMoves + 1);

        if (checkWin(newBoard, r, c)) {
            setGameOver(true);
            setWinner(currPlayer);
        } else {
            setCurrPlayer(currPlayer === playerRed ? playerYellow : playerRed);
        }
    }

    function isDraw() {
        return moves === maxMoves;
    }

    function renderBoard() {
        return board.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
                <Tile
                    key={cols * rowIndex + colIndex}
                    tile={tile}
                    onClick={() => handleTileClick(colIndex)}
                    playerRed={playerRed}
                    playerYellow={playerYellow}
                />
            ))
        );
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <PlayerInfo currentPlayer={currPlayer} isDraw={isDraw()} winner={winner} />
            <div className="m-4" id="board">
                {renderBoard()}
            </div>
        </div>
    );
};

export default React.memo(Board);