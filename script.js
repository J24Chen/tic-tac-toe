const boxArray = document.querySelectorAll('.box');
const player1turn = document.querySelector('.player1-turn');
const player2turn = document.querySelector('.player2-turn');
const gameText = document.querySelector('.game-text');

for (let i = 0; i < boxArray.length;i++){
    boxArray[i].addEventListener("click", (e) => {
        console.log(i);
        
        playerMove(i,e.target);
        
    });
}





const gameBoard = (function () {
    const boardState = [ 
        [null,null,null,],
        [null,null,null,],
        [null,null,null,]
    ]


    const placeItem = (row,col,mark) =>
    {
        if (boardState[row][col] === null) {
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

    return {placeItem, getState, checkRow, checkCol, checkDiagonal, checkWinCon, checkTie}
})();


//TODO: figure out why turn variable doesn't change
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
    return {getTurn, changeTurn}
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
        } else {
            gameText.textContent = "INVALID PLACEMENT: go again!"
        }
            
//Refactor this 
    if((gameBoard.checkWinCon(row,col,mark))){
        disableButtons();
        player2turn.style.visibility = "hidden";
        player1turn.style.visibility = "hidden";
        gameText.textContent = `${mark} has won!`;
    }

    if(gameBoard.checkTie()) {
        disableButtons();
        player2turn.style.visibility = "hidden";
        player1turn.style.visibility = "hidden";
        gameText.textContent = "NO ONE WINS."
    }

    
}

function disableButtons(){
    for (i = 0; i < boxArray.length; i++) {
        boxArray[i].disabled = true;
        boxArray[i].style.backgroundColor = "#DADAD9";
        
    }
}


