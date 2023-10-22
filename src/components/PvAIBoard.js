import React, { useState, useEffect } from 'react';
import './Board.css';
import Tile from './Tile';
import PlayerInfo from './PlayerInfo';

const playerRed = 'R';
const playerYellow = 'Y';
const rows = 6;
const cols = 7;
const maxMoves = rows * cols;
const DEPTH = 7;
const INF = 10000000;

const Board = () => {
    const [currPlayer, setCurrPlayer] = useState(playerRed);
    const [gameOver, setGameOver] = useState(false);
    const [board, setBoard] = useState(initializeBoard());
    const [currColumns, setCurrColumns] = useState(
        Array.from({ length: cols }, () => rows - 1)
    );
    const [moves, setMoves] = useState(0);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (gameOver || currPlayer === playerRed) {
            return;
        }

        const timerId = setTimeout(() => {
            const aiColumn = AImove(board, currColumns);
            makeMove(aiColumn);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [currPlayer, gameOver, currColumns]);

    function initializeBoard() {
        return Array.from({ length: rows }, () => Array(cols).fill(' '));
    }

    function checkWin(board, row, col) {
        const directions = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1],
        ];

        for (const [dx, dy] of directions) {
            let count = 1;
            count += countConsecutive(board, row, col, dx, dy);
            count += countConsecutive(board, row, col, -dx, -dy);

            if (count >= 4) {
                return true;
            }
        }
        return false;
    }

    function AImove(board, currColumns) {
        let newBoard = board.map((row) => [...row]);
        let newCurrColumns = [...currColumns];

        return minimax(newBoard, newCurrColumns, DEPTH, -INF, INF, true)[0];
    }

    function handleTileClick(c) {
        if (gameOver || currPlayer === playerYellow) {
            return;
        }

        const r = currColumns[c];
        if (r < 0) {
            alert('Why this error!');
            return;
        }

        makeMove(c);
    }

    function makeMove(c) {
        const r = currColumns[c];

        if (r < 0 || r >= rows || c < 0 || c >= cols) {
            alert('Invalid move!');
            return;
        }

        let newBoard = board.map((row) => [...row]);
        let newColumns = [...currColumns];
        newColumns[c] -= 1;
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

    function countConsecutive(board, row, col, dx, dy) {
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

    function generatePossibleMoves(currColumns) {
        const possibleMoves = [];

        for (let i = 0; i < currColumns.length; i++) {
            if (currColumns[i] >= 0) {
                possibleMoves.push(i);
            }
        }

        return possibleMoves;
    }

    function minimax(board, currColumns, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0) {
            return [-1, scorePosition(board, playerRed)];
        }

        const validLocations = generatePossibleMoves(currColumns);

        if (maximizingPlayer) {
            let value = -INF;
            let column = -1;

            for (const col of validLocations) {
                const row = currColumns[col];
                let newBoard = board.map((row) => [...row]);
                let newCurrColumns = [...currColumns];
                newBoard[row][col] = playerYellow;
                newCurrColumns[col]--;

                let newScore;
                if (checkWin(newBoard, row, col)) {
                    newScore = INF;
                } else {
                    newScore = minimax(
                        newBoard,
                        newCurrColumns,
                        depth - 1,
                        alpha,
                        beta,
                        false
                    )[1];
                }

                if (newScore > value) {
                    value = newScore;
                    column = col;
                }

                alpha = Math.max(alpha, value);

                if (alpha >= beta) {
                    break;
                }
            }

            return [column, value];
        } else {
            let value = INF;
            let column = -1;

            for (const col of validLocations) {
                const row = currColumns[col];
                let newBoard = board.map((row) => [...row]);
                let newCurrColumns = [...currColumns];
                newBoard[row][col] = playerRed;
                newCurrColumns[col]--;

                let newScore;
                if (checkWin(newBoard, row, col)) {
                    newScore = -INF;
                } else {
                    newScore = minimax(
                        newBoard,
                        newCurrColumns,
                        depth - 1,
                        alpha,
                        beta,
                        true
                    )[1];
                }

                if (newScore < value) {
                    value = newScore;
                    column = col;
                }

                beta = Math.min(beta, value);

                if (alpha >= beta) {
                    break;
                }
            }

            return [column, value];
        }
    }

    function scorePosition(board, piece) {
        let score = 0;
        const centerColumn = Math.floor(cols / 2);
        score += 10 * scoreCenterColumn(board, centerColumn, piece);
        score += scoreHorizontal(board, piece);
        score += scoreVertical(board, piece);
        score += scoreDiagonals(board, piece);
        return score;
    }

    function evaluateWindow(window, piece) {
        const oppPiece = piece === playerRed ? playerYellow : playerRed;
        const pieceCount = countPiece(window, piece);
        const oppPieceCount = countPiece(window, oppPiece);

        if (pieceCount === 4) {
            return 10000;
        } else if (pieceCount === 3 && countEmpty(window) === 1) {
            return 500;
        } else if (pieceCount === 2 && countEmpty(window) === 2) {
            return 20;
        } else if (oppPieceCount === 4) {
            return -10000;
        } else if (oppPieceCount === 3 && countEmpty(window) === 1) {
            return -500;
        } else if (oppPieceCount === 2 && countEmpty(window) === 2) {
            return -20;
        }
        return 0;
    }

    function countPiece(window, piece) {
        return window.filter((cell) => cell === piece).length;
    }

    function countEmpty(window) {
        return window.filter((cell) => cell === ' ').length;
    }

    function scoreCenterColumn(board, centerColumn, piece) {
        const centerArray = board.map((row) => row[centerColumn]);
        return countPiece(centerArray, piece);
    }

    function scoreHorizontal(board, piece) {
        let score = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols - 3; c++) {
                const window = board[r].slice(c, c + 4);
                score += evaluateWindow(window, piece);
            }
        }
        return score;
    }

    function scoreVertical(board, piece) {
        let score = 0;
        for (let c = 0; c < cols; c++) {
            const colArray = board.map((row) => row[c]);
            for (let r = 0; r < rows - 3; r++) {
                const window = [];
                for (let i = 0; i < 4; i++) {
                    window.push(colArray[r + i]);
                }
                score += evaluateWindow(window, piece);
            }
        }
        return score;
    }

    function scoreDiagonals(board, piece) {
        let score = 0;
        for (let r = 0; r < rows - 3; r++) {
            for (let c = 0; c < cols - 3; c++) {
                const window = [];
                for (let i = 0; i < 4; i++) {
                    window.push(board[r + i][c + i]);
                }
                score += evaluateWindow(window, piece);
            }
        }

        for (let r = 0; r < rows - 3; r++) {
            for (let c = 0; c < cols - 3; c++) {
                const window = [];
                for (let i = 0; i < 4; i++) {
                    window.push(board[r + 3 - i][c + i]);
                }
                score += evaluateWindow(window, piece);
            }
        }

        return score;
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
            <PlayerInfo
                currentPlayer={currPlayer}
                isDraw={isDraw()}
                winner={winner}
            />
            <div className="m-4" id="board">
                {renderBoard()}
            </div>
        </div>
    );
};

export default React.memo(Board);
