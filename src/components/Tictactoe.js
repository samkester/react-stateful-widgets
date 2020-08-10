import React, {useState} from 'react';

const spaces = [0, 1, 2, 3, 4, 5, 6, 7, 8]

export default function Tictactoe() {
    const [playerSquares, setPlayerSquares] = useState([]);
    const [CPUSquares, setCPUSquares] = useState([]);

    function textFor(tile){
        if(playerSquares.includes(tile)) return "X";
        if(CPUSquares.includes(tile)) return "O";
        return " ";
    }

    return (
        <div className='widget-squares container'>
            <h2>Tic-Tac-Toe</h2>
            <p>Click on a square to begin.</p>
            <div className="board">
                {
                    spaces.map(tile =>
                    <div
                        id={tile}
                        key={tile}
                        className="square"
                    >{textFor(tile)}
                    </div>
                )
            }
            </div>
            <p>I am the game result text.</p>
            <button>Reset</button>
        </div>
    );
}