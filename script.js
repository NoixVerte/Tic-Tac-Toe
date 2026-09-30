const turnLabel = document.querySelector(".turn-label");

const gameboard = (function () {
    let board = [["", "", ""], 
                ["", "", ""], 
                ["", "", ""]];
    const displayedGameboard = document.querySelector(".gameboard");
    const squares = document.querySelectorAll(".square");

    function updateGameBoard() {
        let iterableBoard = [];
        for (let i = 0; i < 3; i++)  {
            for (let j = 0; j < 3; j++) {
                iterableBoard.push(board[i][j])
            }
        }

        for (let i = 0; i < 9; i++) {
            squares[i].textContent = iterableBoard[i];
        }
    }

    function addMarker(marker, row, column) {
        board[row - 1][column - 1] = marker;
    };

    function wipeGameBoard() {
        gameboard.board = [["", "", ""], 
                        ["", "", ""], 
                        ["", "", ""]];
        for (let i = 0; i < 9; i++) {
            squares.item(i).textContent = "";
        }
    }

    return { board, displayedGameboard, updateGameBoard, wipeGameBoard, addMarker };

})();

const player = (function (marker) {
    let name = marker;
    let playerMarker = marker;
    let score = 0;

    const increaseScore = function () {
        score++;
    }
    
    const showScore = function () {
        return score;
    }

    return { name, playerMarker, increaseScore, showScore };

});

const gameFlow = (function () {
    const scoreboard = document.getElementById("scoreboard");
    const player1 = player("X");
    const player2 = player("O");
    let winner = "";
    let round = 1;
    let finalRound = 10;

    function checkForEnd() {
        //Check for horizontal and vertical matches
        for (let i = 0; i < 3; i++) {
            if (gameboard.board[i][0] != "" && gameboard.board[i][0] === gameboard.board[i][1] && gameboard.board[i][0] === gameboard.board[i][2]) {
                winner = gameboard.board[i][0];
                return true;
            }
            if (gameboard.board[0][i] != "" && gameboard.board[0][i] === gameboard.board[1][i] && gameboard.board[0][i] === gameboard.board[2][i]) {
                winner = gameboard.board[0][i];
                return true;
            }
        }
        //Check the diagonal matches, otherwise give a tie if game is in final round
        if (winner != player1.marker && winner != player2.marker) {
            if (gameboard.board[1][1] != "" && ((gameboard.board[0][0] === gameboard.board[1][1] && gameboard.board[0][0] === gameboard.board[2][2]) || (gameboard.board[0][2] === gameboard.board[1][1] && gameboard.board[0][2] === gameboard.board[2][0]))) {
                winner = gameboard.board[1][1];
                return true;
            } else if (gameFlow.round === gameFlow.finalRound) {
                return true;
            }
        }
        
        return false;
    }

    function manageGameEnd() {
        if (winner === "X") {
            turnLabel.innerText = player1.name + " wins!";
            player1.increaseScore();
            scoreboard.firstElementChild.innerText = "X's score: " + player1.showScore();
        } else if (winner === "O") {
            turnLabel.innerText= player2.name + " wins!";
            player2.increaseScore();
            scoreboard.lastElementChild.innerText = "O's score: " + player2.showScore();
        } else if (gameFlow.round === finalRound) {
            turnLabel.innerText = "It's a tie!";
        }
    }

    function resetGame() {
        winner = "";
        gameboard.wipeGameBoard();
        gameFlow.round = 1;
        turnLabel.textContent = "It is X's turn!";
    }

    return { player1, player2, checkForEnd, manageGameEnd, resetGame, round, finalRound, winner }; 

})();

gameboard.displayedGameboard.addEventListener("click", (event) => {
    if (gameFlow.checkForEnd()) {
        return;
    }
    if (event.target.innerText === "" && !gameFlow.checkForEnd()) {
        event.target.innerText = (gameFlow.round % 2) == 0 ? 'O' : 'X';
        gameFlow.round++;
        let counter = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameboard.board[i][j] = gameboard.displayedGameboard.children[counter].innerText;
                counter++;
            }
        }
    }
    if (gameFlow.checkForEnd()) {
        gameFlow.manageGameEnd();
    } else turnLabel.innerText = (gameFlow.round % 2) === 0 ? "It is O's turn!" : "It is X's turn!";
});

document.getElementById("new-game-btn").addEventListener("click", gameFlow.resetGame);