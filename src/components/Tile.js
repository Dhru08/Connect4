import React from 'react';

const Tile = React.memo(({ tile, onClick, playerRed, playerYellow }) => (
    <div
        className={`tile ${tile === playerRed ? 'bg-danger' : tile === playerYellow ? 'bg-warning' : ''}`}
        onClick={onClick}
    >
    </div>
));

export default Tile;
