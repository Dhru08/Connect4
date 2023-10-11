const playerRed = 'R';
const playerYellow = 'Y';
const rows = 6;
const cols = 7;
const DEPTH = 13;
const INF = 10000000;

export function initializeBoard() {
    return Array.from({ length: rows }, () => Array(cols).fill(' '));
}

export function checkWin(board, row, col) {
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

export function AImove(board, currColumns) {
    // let c = Math.floor(Math.random() * cols);
    // while (currColumns[c] < 0) {
    //     c = Math.floor(Math.random() * cols);
    // }
    // return c;

    const newBoard = board.map(row => [...row]);
    let newCurrColumns = currColumns.map(item => Array.isArray(item) ? [...item] : item);

    return minimax(newBoard, newCurrColumns, DEPTH, -INF, INF, true)[0];
}

function generatePossibleMoves(currColumns) {
    const possibleMoves = [];

    for (let i = 0; i < currColumns.length; i++) {
        if (currColumns[i] > 0) {
            possibleMoves.push(i);
        }
    }

    return possibleMoves;
}

function minimax(board, currColumns, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0) {
        return [-1, scorePosition(board, playerYellow)];
    }

    if (maximizingPlayer) {
        let value = -INF;
        let column = -1;

        const validLocations = generatePossibleMoves(currColumns);

        for (const col of validLocations) {

            const row = currColumns[col];
            const newBoard = board.map(row => [...row]);
            let newCurrColumns = currColumns.map(item => Array.isArray(item) ? [...item] : item);
            newBoard[row][col] = playerYellow;
            newCurrColumns[col]--;

            let newScore;
            if (checkWin(newBoard, row, col)) {
                newScore = INF;
            }
            else {
                newScore = minimax(newBoard, depth - 1, alpha, beta, false)[1];
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

        const validLocations = generatePossibleMoves(currColumns);

        for (const col of validLocations) {

            const row = currColumns[col];
            const newBoard = board.map(row => [...row]);
            let newCurrColumns = currColumns.map(item => Array.isArray(item) ? [...item] : item);
            newBoard[row][col] = playerRed;
            newCurrColumns[col]--;

            let newScore;
            if (checkWin(newBoard, row, col)) {
                newScore = -INF;
            }
            else {
                newScore = minimax(newBoard, depth - 1, alpha, beta, true)[1];
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

    // Score center column
    const centerColumn = Math.floor(cols / 2);
    const centerArray = board.map(row => row[centerColumn]);
    const centerCount = centerArray.filter(cell => cell === piece).length;
    score += centerCount * 3;

    // Score Horizontal
    for (let r = 0; r < rows; r++) {
        const rowArray = board[r];
        for (let c = 0; c < cols - 3; c++) {
            const window = rowArray.slice(c, c + 4);
            score += evaluateWindow(window, piece);
        }
    }

    // Score Vertical
    for (let c = 0; c < cols; c++) {
        const colArray = board.map(row => row[c]);
        for (let r = 0; r < rows - 3; r++) {
            const window = [];
            for (let i = 0; i < 4; i++) {
                window.push(colArray[r + i]); // Corrected this line
            }
            score += evaluateWindow(window, piece);
        }
    }

    // Score positive sloped diagonal
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

function evaluateWindow(window, piece) {
    let score = 0;
    const oppPiece = piece === playerRed ? playerYellow : playerRed;

    if (window.filter(cell => cell === piece).length === 4) {
        score += 100;
    } else if (window.filter(cell => cell === piece).length === 3 && window.filter(cell => cell === ' ').length === 1) {
        score += 5;
    } else if (window.filter(cell => cell === piece).length === 2 && window.filter(cell => cell === ' ').length === 2) {
        score += 2;
    }

    if (window.filter(cell => cell === oppPiece).length === 3 && window.filter(cell => cell === ' ').length === 1) {
        score -= 4;
    }

    return score;
}

