import React, {useState} from 'react';

const gameStateReady = "";
const gameStatePlayerWin = "You won!";
const gameStateCPUWin = "You lost!";
const gameStateTied = "A tie...";

const tilesInWin = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

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
        // according to my research (=5 minutes on google) setState is asynchronous, so gameSpaces will not update instantly
        //   the non-stateful currentSpaces list is a workaround for this
        // since the whole sequence of player turn -> win check -> CPU turn -> win check appears atomic to the player,
        //   it doesn't necessarily matter, as long as setGameSpaces is called before the end of the turn

        if(checkPlayerWin(currentSpaces)){
            setGameSpaces(currentSpaces);
            return; // if the player wins, skip running the CPU turn
        }

        strategicCPUMove(currentSpaces);
        setGameSpaces(currentSpaces);
        checkCPUWin(currentSpaces);
        checkTies(currentSpaces);
    }

    function checkPlayerWin(currentSpaces){
        const wins = winProgress(currentSpaces);

        //console.log(wins);
        for(let i = 0; i < wins.length; i++){
            if(wins[i] === 3){
                //console.log("player wins");
                setGameState(gameStatePlayerWin);
                return true;
            }
        }
        return false;
    }

    function checkCPUWin(currentSpaces){
        const wins = winProgress(currentSpaces);

        //console.log(wins);
        for(let i = 0; i < wins.length; i++){
            if(wins[i] === -3){
                setGameState(gameStateCPUWin);
                return true;
            }
        }
        return false;
    }

    function checkTies(currentSpaces){
        // each turn consists of a player turn adding +1 to a tile, and a CPU turn adding -1
        // therefore, the only way a turn can end with a non-zero total is if the player moved
        // and the CPU didn't - at the end of the game
        if(currentSpaces.reduce((total, item) => total + item) % 2 === 1) {
            setGameState(gameStateTied);
            return true;
        }
        return false;
    }

    // this function returns TRUE if it was able to make a move, FALSE otherwise
    function strategicCPUMove(currentSpaces){
        const wins = winProgress(currentSpaces);

        const canInterruptPlayerWin = [];

        for(let i = 0; i < wins.length; i++){
            if(wins[i] === -2){
                playUnclaimedCPUMoveInWin(i, currentSpaces); // CPU can win with this move; play it immediately
                return;
            }
            else if(wins[i] === 2){
                canInterruptPlayerWin.push(i); // player can win with this move; interrupt it if CPU can't win with any other move
            }
        }
        if(canInterruptPlayerWin.length > 0)
        {
            // interrupt the first imminent player win, if any
            // if there is more than one, CPU loses to perfect play anyway so don't worry about which one
            playUnclaimedCPUMoveInWin(canInterruptPlayerWin[0], currentSpaces);
            return;
        }

        randomCPUMove(currentSpaces);
    }

    function playUnclaimedCPUMoveInWin(win, currentSpaces){
        // we have a number representing one of eight wins
        // two of the three squares in that win are claimed and it's imperative we claim the last
        for(let i = 0; i < 3; i++){
            if(currentSpaces[tilesInWin[win][i]] === 0){
                //if the ith space in the win we're examining is unclaimed...
                currentSpaces[tilesInWin[win][i]] = -1; // claim it for the CPU
            }
        }
        // by the rules of tic-tac-toe, it should be impossible for us to end up here without a third open spot to claim
        // since that would require the sum of the win to be an odd number, but we got here by it being 2 or -2
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