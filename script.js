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
            squares.item(i).textContent = iterableBoard[i];
        }
    }

    function addMarker(marker, row, column) {
        board[row - 1][column - 1] = marker;
    };

    return { board, displayedGameboard, updateGameBoard, addMarker };

})();

const player = (function (marker) {
    let name;
    let playerMarker = marker;
    let score = 0;

    const increaseScore = function () {
        score++;
    }
    
    const showScore = function () {
        console.log(score);
        return score;
    }

    return { name, playerMarker, increaseScore, showScore };

});

const gameFlow = (function () {
    const player1 = player("X");
    const player2 = player("O");
    let round = 1;

    function checkForEnd() {
        let winner = "";
        for (let i = 0; i < 3; i++) {
            if (gameboard.board[i][0] != "" && gameboard.board[i][0] === gameboard.board[i][1] && gameboard.board[i][0] === gameboard.board[i][2]) {
                winner = gameboard.board[i][0];
            }
            if (gameboard.board[0][i] != "" && gameboard.board[0][i] === gameboard.board[1][i] && gameboard.board[0][i] === gameboard.board[2][i]) {
                winner = gameboard.board[0][i];
            }
        }
        if (!winner) {
            if ( (gameboard.board[0][0] == gameboard.board[1][1] && gameboard.board[0][0] == gameboard.board[2][2]) || (gameboard.board[0][2] == gameboard.board[1][1] && gameboard.board[0][2] == gameboard.board[2][0]) ) {
                winner = gameboard.board[1][1];
            }
        }

        if (winner == "X") {
            turnLabel.innerText = "X wins!";
            player1.increaseScore();
            gameFlow.round = 1;
            return true;
        } else if (winner == "O") {
            turnLabel.innerText= "O wins!";
            player2.increaseScore();
            gameFlow.round = 1;
            return true;
        } else if (gameFlow.round == 10) {
            turnLabel.innerText = "It's a tie!";
            gameFlow.round = 1;
            return true;
        }

        return false;
    }

    return { player1, player2, checkForEnd, round }; 

})();

gameboard.displayedGameboard.addEventListener("click", (event) => {
    if (event.target.innerText == "" && !gameFlow.checkForEnd()) {
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
    turnLabel.innerText = (gameFlow.round % 2) == 0 ? "It is O's turn!" : "It is X's turn!";
    gameFlow.checkForEnd(); 
});

gameboard.updateGameBoard();