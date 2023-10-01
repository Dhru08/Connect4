import React, { useState, useEffect } from 'react';
import './Board.css';
import Tile from './Tile';
import PlayerInfo from './PlayerInfo';

const Board = () => {
    const playerRed = "R";
    const playerYellow = "Y";
    const rows = 6;
    const cols = 7;
    const maxMoves = rows * cols;

    const [currPlayer, setCurrPlayer] = useState(playerRed);
    const [gameOver, setGameOver] = useState(false);
    const [board, setBoard] = useState([]);
    const [currColumns, setCurrColumns] = useState(Array.from({ length: cols }, () => rows - 1));
    const [moves, setMoves] = useState(0);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        initializeBoard();
    }, []);

    function initializeBoard() {
        const newBoard = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                row.push(' ');
            }
            newBoard.push(row);
        }
        setBoard(newBoard);
    }

    function checkWin(row, col) {
        const directions = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1]
        ];

        for (const [dx, dy] of directions) {
            let count = 1;
            count += countConsecutive(row, col, dx, dy);
            count += countConsecutive(row, col, -dx, -dy);

            if (count >= 4) {
                setGameOver(true);
                setWinner(currPlayer);
                return;
            }
        }
    }

    function countConsecutive(row, col, dx, dy) {
        let count = 0;
        let r = row + dx;
        let c = col + dy;

        while (isValid(r, c) && board[r][c] === board[row][col]) {
            count++;
            r += dx;
            c += dy;
        }

        return count;
    }

    function isValid(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    function handleTileClick(c) {
        if (gameOver) {
            return;
        }

        let r = currColumns[c];
        if (r < 0) {
            console.log("Out of Board");
            return;
        }

        const newColumns = [...currColumns];
        newColumns[c] -= 1;

        if (board[r][c] === ' ') {
            board[r][c] = currPlayer;
            checkWin(r, c);
            setCurrColumns(newColumns);
            setCurrPlayer(currPlayer === playerRed ? playerYellow : playerRed);
            setMoves(moves + 1);
        }
    }

    function isDraw() {
        return moves === maxMoves;
    }

    function renderBoard() {
        return board.map((row, rowIndex) => (
            row.map((tile, colIndex) => (
                <Tile
                    key={cols * rowIndex + colIndex}
                    tile={tile}
                    onClick={() => handleTileClick(colIndex)}
                    playerRed={playerRed}
                    playerYellow={playerYellow}
                />
            ))
        ));
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <PlayerInfo currentPlayer={currPlayer} isDraw={isDraw()} winner={winner} /> {/* Include PlayerInfo component */}
            <div className="m-4" id="board">
                {renderBoard()}
            </div>
        </div>
    );
}

export default React.memo(Board);