import React, {useState} from 'react';

const gameStateReady = "";
const gameStatePlayerWin = "You won!";
const gameStatCPUWin = "You lost!";

export default function Tictactoe() {
    const [gameSpaces, setGameSpaces] = useState([0,0,0,0,0,0,0,0,0]);
    const [gameState, setGameState] = useState(gameStateReady);

    function textFor(tile){
        if(gameSpaces[tile] > 0) return "X"; // player space
        if(gameSpaces[tile] < 0) return "O"; // CPU space
        return " "; // unclaimed space
    }

    function resetGame(){
        setGameSpaces([0,0,0,0,0,0,0,0,0]);
        setGameState(gameStateReady);
    }

    function clickable(tile, currentSpaces = gameSpaces){
        if(currentSpaces[tile] !== 0) return false;
        return gameState === gameStateReady;
    }

    function checkGameState(currentSpaces){
        const wins = winProgress(currentSpaces);

        //console.log(wins);
        for(let i = 0; i < wins.length; i++){
            if(wins[i] === 3){
                //console.log("player wins");
                setGameState(gameStatePlayerWin);
            }
            else if(wins[i] === -3){
                setGameState(gameStatCPUWin);
            }
        }
    }

    function winProgress(currentSpaces){
        // there are 8 winning combinations: 3 rows, 3 columns, and 2 diagonals
        const wins = [0, 0, 0, 0, 0, 0, 0, 0];
        
        // for each space, adds 1 to the wins that contain that space if player-claimed, -1 if CPU-claimed, 0 if unclaimed
        currentSpaces.forEach((value, tile) => {
            wins[Math.floor(tile/3)] += value; // 0-2 = row 0, 3-5 = row 1, 6-8 = row 2
            wins[tile % 3 + 3] += value; // 0/3/6 = column 0, 1/4/7 = column 1, 2/5/8 = column 2
            if(tile % 4 === 0) wins[6] += value; // tiles 0, 4, 8
            if(tile === 2 || tile === 4 || tile === 6) wins[7] += value; // I couldn't come up with a clever pattern for this one
        });

        return wins;
    }

    function playerClickOn(tile){
        if(!clickable(tile)) return;
        const currentSpaces = [...gameSpaces]; // be sure to make a copy via spreading, very important
        currentSpaces[tile] = 1;
        // according to my research (=5 minutes on google) setState is asynchronous, so an updated gameSpaces
        //   is not guaranteed to be updated when we call checkGameState later on. Sending the updated, 
        //   non-stateful list to checkGameState makes sure that it's up to date.

        // CPU turn...
        randomCPUMove(currentSpaces);
        // end CPU turn
        console.log(currentSpaces);

        setGameSpaces(currentSpaces);
        checkGameState(currentSpaces);
    }

    function randomCPUMove(currentSpaces){
        const available = currentSpaces.reduce(((prev, item, index) => {
            if(item === 0) {prev.push(index)} return prev;
        }), []); // returns an array of only spaces that are available

        currentSpaces[available[Math.floor(Math.random() * available.length)]] -= 1;
        //            ^ this whole mess = "random element in 'available'" ^

        //console.log(available);
    }

    return (
        <div className='widget-squares container'>
            <h2>Tic-Tac-Toe</h2>
            <p>Click on a square to begin.</p>
            <div className="board">
                {
                    gameSpaces.map((value, tile) =>
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