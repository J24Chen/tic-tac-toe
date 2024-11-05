const boxArray = document.querySelectorAll('.box');
const player1turn = document.querySelector('.player1-turn');
const player2turn = document.querySelector('.player2-turn');
const gameText = document.querySelector('.game-text');
const restartButton = document.querySelector('.reset');
const dialog = document.querySelector("dialog");
const submitButton = document.querySelector(".submit-button");

const player1Input = document.querySelector("#player1-name");
const player2Input = document.querySelector("#player2-name");

/*Player function isn't needed to be an IIFE due to limited functions, 
but for the spirit of this practice project, we'll make it
*/
const playerHandler = function () {
    let player1 = 'player 1';
    let player2 = 'player 2';

    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    const setPlayer1 = (str) => { player1 = str };
    const setPlayer2 = (str) => { player2 = str };
    return {getPlayer1, getPlayer2, setPlayer1, setPlayer2}
}();


dialog.showModal();

submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    playerHandler.setPlayer1(player1Input.value);
    playerHandler.setPlayer2(player2Input.value);  
    player1turn.textContent = (`${playerHandler.getPlayer1()}'s turn`)
    player2turn.textContent = (`${playerHandler.getPlayer2()}'s turn`)
    dialog.close();
});

//TODO: Make input from player1 and player2 accepted, then integrate it into the code.


for (let i = 0; i < boxArray.length;i++){
    boxArray[i].addEventListener("click", (e) => {
        playerMove(i,e.target);
    });
}   


/* 
GameBoard is an object that handles the events that occur on the board. 
This includes adding moves, resetting board, legal moves, winning moves and ties.
*/
const gameBoard = (function () {
    let boardState = [ 
        [null,null,null,],
        [null,null,null,],
        [null,null,null,]
    ]

    const resetBoard = () => {
        boardState = [ 
            [null,null,null,],
            [null,null,null,],
            [null,null,null,]
        ]
    }


    const placeItem = (row,col,mark) =>
    {
        if (boardState[row][col] == null) {
            boardState[row][col] = mark;
            return true;
        } else {
            return false;
        }  
    }
       
    

    const getState = () => boardState; 
    const checkRow = (row, mark) => 

        ((boardState[row][0] == boardState[row][1]) &&  (boardState[row][1] == boardState[row][2]) &&  (boardState[row][2] == mark))

    const checkCol = (col, mark) => 
        ((boardState[0][col] == boardState[1][col]) &&  (boardState[1][col] == boardState[2][col]) &&  (boardState[2][col] == mark))

    const checkDiagonal = (mark) => 
        ((boardState[0][0] == boardState[1][1]) &&(boardState[1][1] === boardState[2][2]) && (boardState[2][2] === mark) ) ||
        ((boardState[0][2] === boardState[1][1]) && (boardState[1][1] === boardState[2][0]) && (boardState[2][0] === mark));

    /* For efficiency, we will check the Win Con based on the most recent 
    X or O placed, which means we do not need to account for diagonals IF it is 
    placed on the middle top, middle left, middle right or middle bottom.*/
    const checkWinCon = ( row,col,mark ) => {

        if (mark == undefined) return false;

        //Checks if it is placed in a middle column/row but not the center.
        if ( (row === 1 && col !== 1) || (col === 1 && row !== 1)){
            return (checkRow(row,mark) || checkCol(col,mark));
        } 

        return (checkRow(row,mark) || checkCol(col,mark) || checkDiagonal(mark));
        
        
    }

    const checkTie = () => {
        let check = gameBoard.getState().find( arr => arr.includes(null));

        return (check === undefined) ?  true:  false;

    }

    return {placeItem, resetBoard, getState, checkRow, checkCol, checkDiagonal, checkWinCon, checkTie}
})();



const turnHandler = (function () {
    let turn = 'x';

    const getTurn = () => turn;
    const changeTurn = () => {
        if (turn == 'x') {
            turn = 'o'
            player2turn.style.visibility = "visible";
            player1turn.style.visibility = "hidden";
        } else {
            turn = 'x';
            player2turn.style.visibility = "hidden";
            player1turn.style.visibility = "visible";
        }   
    }
    const setTurn = (str) => {
            turn = str
        };
    return {getTurn, changeTurn,setTurn}
})();


function playerMove(placement,box) {

    let mark, row, col;

        mark = turnHandler.getTurn();

        
        row = Math.floor(placement/ 3) ;
        col = placement % 3;
        let checkValidPlacement = gameBoard.placeItem(row,col,mark);

        if (checkValidPlacement) {
            box.textContent = mark;
            turnHandler.changeTurn();
            gameText.style.visibility = "hidden";
        } else {
            gameText.style.visibility = "visible";
            gameText.textContent = "INVALID PLACEMENT: go again!";
        }
            
//Refactor this 
    if((gameBoard.checkWinCon(row,col,mark))){
        toggleButtons(false);
        player2turn.style.visibility = "hidden";
        player1turn.style.visibility = "hidden";
        gameText.style.visibility = "visible";

        if (mark == 'x') {
            gameText.textContent = `${playerHandler.getPlayer1()} has won!`;
        }
        else {
            gameText.textContent = `${playerHandler.getPlayer2()} has won!`;
        }
    }

    if(gameBoard.checkTie()) {
        toggleButtons(false);
        player2turn.style.visibility = "hidden";
        player1turn.style.visibility = "hidden";
        gameText.style.visibility = "visible";
        gameText.textContent = "NO ONE WINS."
    }

    
}

function toggleButtons(bool){
    if(bool) { 
        for (i = 0; i < boxArray.length; i++) {
            boxArray[i].disabled = false;
            boxArray[i].style.backgroundColor = "#fff;";
        }
    } else {
        for (i = 0; i < boxArray.length; i++) {
            boxArray[i].disabled = true;
            boxArray[i].style.backgroundColor = "#afeed456;";
        }
    }
        
}

function resetBoxes() {
    for (let i = 0; i < boxArray.length;i++){
        boxArray[i].textContent = "";
    }   
}


restartButton.addEventListener("click", () => {
    turnHandler.setTurn('x');
    gameBoard.resetBoard();
    resetBoxes();
    toggleButtons(true);
    player2turn.style.visibility = "hidden";
    player1turn.style.visibility = "visible";
    gameText.style.visibility = "hidden";
});