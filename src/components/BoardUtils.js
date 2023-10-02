const rows = 6;
const cols = 7;

export function initializeBoard() {
    return Array.from({ length: rows }, () => Array(cols).fill(' '));
}

export function checkWin(board, row, col, currPlayer) {
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

export function countConsecutive(board, row, col, dx, dy) {
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

export function isValid(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
}

export function AImove(currColumns) {
    let c = Math.floor(Math.random() * cols);
    while (currColumns[c] < 0) {
        c = Math.floor(Math.random() * cols);
    }
    return c;
}