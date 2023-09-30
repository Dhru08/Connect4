import React, { useState } from 'react';

function App() {
    const numRows = 6;
    const numCols = 7;
    const cellSize = 50;

    const [selectedColumn, setSelectedColumn] = useState(null);

    const handleColumnClick = (columnIndex) => {
        setSelectedColumn(columnIndex);
        console.log(`Selected column: ${columnIndex}`);
    };

    const renderTableRows = () => {
        const rows = [];

        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < numCols; j++) {
                row.push(
                    <td
                        key={`${i}-${j}`}
                        style={{ width: cellSize, height: cellSize, cursor: 'pointer' }}
                        onClick={() => handleColumnClick(j)}
                    >
                        
                    </td>
                );
            }
            rows.push(
                <tr key={i} style={{ height: cellSize }}>
                    {row}
                </tr>
            );
        }

        return rows;
    };

    return (
        <>
            <div className="container" style={{ width: "500px", height: "500px" }}>
                <table className="table table-bordered mt-5">
                    <tbody>{renderTableRows()}</tbody>
                </table>
            </div>
            <p>Selected column: {selectedColumn !== null ? selectedColumn : 'None'}</p>
        </>
    );
}

export default App;
