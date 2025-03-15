const gameboard = (function () {
    let board = [["X", "X", "O"], 
                ["O", "O", "X"], 
                ["X", "O", "O"]];

    function drawGameboard() {
        let drawnBoard = "";
        for (let i = 0; i < 3; i++) {
            drawnBoard += "+-----------+\n|";
            for (let j = 0; j < 3;  j++) {
                drawnBoard += " " + board[i][j] + " |";
            }
            drawnBoard += "\n";
        }
        drawnBoard += "+-----------+\n";
        console.log(drawnBoard);
    };

    function addMarker(marker, row, column) {
        board[row - 1][column - 1] = marker;
    };

    return { board, drawGameboard, addMarker };

})();

const player = (function (marker) {
    let playerMarker = marker;
    let score = 0;

    const increaseScore = function () {
        score++;
    }
    
    const showScore = function () {
        console.log(score);
    }

    return { playerMarker, increaseScore, showScore };

});

const gameFlow = (function () {
    const player1 = player("X");
    const player2 = player("O");
    let round = 0;

    function checkForWin() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (gameboard.board[i][j] != " ") {
                    round++;
                }
            }
        }
        let winner = "";
        for (let i = 0; i < 3; i++) {
            if (gameboard.board[i][0] != " " && gameboard.board[i][0] === gameboard.board[i][1] && gameboard.board[i][0] === gameboard.board[i][2]) {
                winner = gameboard.board[i][0];
            }
            if (gameboard.board[0][i] != " " && gameboard.board[0][i] === gameboard.board[1][i] && gameboard.board[0][i] === gameboard.board[2][i]) {
                winner = gameboard.board[0][i];
            }
        }
        if (!winner) {
            if ( (gameboard.board[0][0] == gameboard.board[1][1] && gameboard.board[0][0] == gameboard.board[2][2]) || (gameboard.board[0][2] == gameboard.board[1][1] && gameboard.board[0][2] == gameboard.board[2][0]) ) {
                winner = gameboard.board[1][1];
            }
        }

        if (winner == "X") {
            console.log("Player 1 wins!");
            player1.increaseScore();
        } else if (winner == "O") {
            console.log("Player 2 wins!");
            player2.increaseScore();
        } else if (round == 9) {
            console.log("It's a tie!");
            round = 0;
        }
    }

    return { player1, player2, checkForWin, round }; 

})();

gameboard.drawGameboard();