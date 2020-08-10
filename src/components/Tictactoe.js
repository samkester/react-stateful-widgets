import React, {useState} from 'react';

const spaces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const gameStateReady = "";
const gameStatePlayerWin = "You won!";
const gameStatCPUWin = "You lost!";

export default function Tictactoe() {
    const [playerSquares, setPlayerSquares] = useState([]);
    const [CPUSquares, setCPUSquares] = useState([]);
    const [gameState, setGameState] = useState(gameStateReady);

    function textFor(tile){
        if(playerSquares.includes(tile)) return "X";
        if(CPUSquares.includes(tile)) return "O";
        return " ";
    }

    function resetGame(){
        setPlayerSquares([]);
        setCPUSquares([]);
        setGameState(gameStateReady);
    }

    function clickable(tile){
        if(playerSquares.includes(tile)) return false;
        if(CPUSquares.includes(tile)) return false;
        return gameState === gameStateReady;
    }

    function checkGameState(newPlayerSquares){
        // there are 8 winning combinations: 3 rows, 3 columns, and 2 diagonals
        const wins = [0, 0, 0, 0, 0, 0, 0, 0]

        //console.log(newPlayerSquares);
        newPlayerSquares.forEach(tile => {
            wins[Math.floor(tile/3)] += 1; // 0-2 = row 0, 3-5 = row 1, 6-8 = row 2
            wins[tile % 3 + 3] += 1; // 0/3/6 = column 0, 1/4/7 = column 1, 2/5/8 = column 2
            if(tile % 4 === 0) wins[6] += 1; // tiles 0, 4, 8
            if(tile === 2 || tile === 4 || tile === 6) wins[7] += 1; // I couldn't come up with a clever pattern for this one
        });

        //console.log(wins);
        for(let i = 0; i < wins.length; i++){
            if(wins[i] === 3){
                //console.log("player wins");
                setGameState(gameStatePlayerWin);
            }
        }
    }

    function playerClickOn(tile){
        if(!clickable(tile)) return;
        const newPlayerSquares = [...playerSquares, tile];  // according to my research (=5 minutes on google) setState is asynchronous,
        setPlayerSquares(newPlayerSquares);                 // so it's not guaranteed to be updated when we call checkGameState later on
        // CPU turn...

        // check gamestate
        checkGameState(newPlayerSquares);
        // explicitly sending the updated, non-stateful list of squares to checkGameState makes sure it accounts for this turn
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
                        onClick = {clickable ? () => playerClickOn(tile) : undefined}
                    >{textFor(tile)}
                    </div>
                )
            }
            </div>
            <p>{gameState}</p>
            <button onClick = {resetGame}>Reset</button>
        </div>
    );
}