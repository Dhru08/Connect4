import React from 'react';

const PlayerInfo = ({ currentPlayer, isDraw, winner }) => {
    return (
        <div className="mt-4">
            <div className="d-flex justify-content-around align-items-center" style={{ width: "630px" }}>
                {(isDraw) ? (
                    <>
                        {isDraw && <h1 className="text-center">It's a draw!</h1>}
                    </>
                ) : (
                    <>
                        {(!winner || winner === 'R') && <h1 className="text-center text-danger">Player 1</h1>}
                        {(!winner || winner === 'Y') && <h1 className="text-center text-warning">Player 2</h1>}
                    </>
                )}
            </div>
        </div>
    );
};

export default PlayerInfo;
