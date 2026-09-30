const turnLabel = document.querySelector(".turn-label");
const scoreboard = document.getElementById("scoreboard");

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
    const player1 = player("X");
    const player2 = player("O");
    let winner = "";
    let round = 1;
    let finalRound = 10;

    function checkForEnd() {
        //Check for horizontal and vertical matches
        for (let i = 0; i < 3; i++) {
            if (gameboard.board[i][0] != "" && gameboard.board[i][0] === gameboard.board[i][1] && gameboard.board[i][0] === gameboard.board[i][2]) {
                gameFlow.winner = gameboard.board[i][0];
                return true;
            }
            if (gameboard.board[0][i] != "" && gameboard.board[0][i] === gameboard.board[1][i] && gameboard.board[0][i] === gameboard.board[2][i]) {
                gameFlow.winner = gameboard.board[0][i];
                return true;
            }
        }
        //Check the diagonal matches, otherwise give a tie if game is in final round
        if (gameFlow.winner != player1.marker && gameFlow.winner != player2.marker) {
            if (gameboard.board[1][1] != "" && ((gameboard.board[0][0] === gameboard.board[1][1] && gameboard.board[0][0] === gameboard.board[2][2]) || (gameboard.board[0][2] === gameboard.board[1][1] && gameboard.board[0][2] === gameboard.board[2][0]))) {
                gameFlow.winner = gameboard.board[1][1];
                return true;
            } else if (gameFlow.round === gameFlow.finalRound) {
                return true;
            }
        }
        
        return false;
    }

    function manageGameEnd() {
        if (gameFlow.winner === "X") {
            turnLabel.innerText = player1.name + " wins!";
            player1.increaseScore();
            scoreboard.firstElementChild.innerText = gameFlow.player1.name  +  "'s score: " + player1.showScore();
        } else if (gameFlow.winner === "O") {
            turnLabel.innerText= player2.name + " wins!";
            player2.increaseScore();
            scoreboard.lastElementChild.innerText = gameFlow.player2.name + "'s score: " + player2.showScore();
        } else if (gameFlow.round === finalRound) {
            turnLabel.innerText = "It's a tie!";
        }
    }

    function resetGame() {
        gameFlow.winner = "";
        gameboard.wipeGameBoard();
        gameFlow.round = 1;
        turnLabel.textContent = "It is " +  gameFlow.player1.name + "'s turn!";
    }

    return { player1, player2, checkForEnd, manageGameEnd, resetGame, round, winner }; 

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
    } else turnLabel.innerText = (gameFlow.round % 2) === 0 ? "It is " + gameFlow.player2.name + "'s turn!" : "It is " + gameFlow.player1.name + "'s turn!";
});

document.getElementById("new-game-btn").addEventListener("click", gameFlow.resetGame);

const change_names_popup = document.getElementById("change-names-popup");
const change_names_popup_backgrnd = document.getElementById("change-names-popup-bckrgnd");
const change_names_popup_forms = document.getElementsByClassName("change-name-form-wrapper");
document.getElementById("change-names-btn").addEventListener("click", () => {
    change_names_popup.style.visibility = "visible";
    change_names_popup_backgrnd.style.visibility = "visible";
    change_names_popup_forms[0].querySelector("span").innerText = gameFlow.player1.name  + "'s new name:"
    change_names_popup_forms[1].querySelector("span").innerText = gameFlow.player2.name  + "'s new name:"
});

document.getElementById("cancel-names-popup-btn").addEventListener("click", () => {
    change_names_popup.style.visibility = "hidden";
    change_names_popup_backgrnd.style.visibility = "hidden";
    change_names_popup_forms[0].querySelector("input").value = "";
    change_names_popup_forms[1].querySelector("input").value = "";
});

document.getElementById("confirm-names-popup-btn").addEventListener("click", () => {
    change_names_popup.style.visibility = "hidden";
    change_names_popup_backgrnd.style.visibility = "hidden";
    if (change_names_popup_forms[0].querySelector("input").value !== "") {
        gameFlow.player1.name = change_names_popup_forms[0].querySelector("input").value;
    }
    if (change_names_popup_forms[1].querySelector("input").value !== "") {
        gameFlow.player2.name = change_names_popup_forms[1].querySelector("input").value;
    }
    if (!gameFlow.checkForEnd())  {
        turnLabel.innerText = (gameFlow.round % 2) === 0 ? "It is " + gameFlow.player2.name + "'s turn!" : "It is " + gameFlow.player1.name + "'s turn!";
    } else {
        if (gameFlow.winner === "X") turnLabel.innerText = gameFlow.player1.name + " wins!"
        if (gameFlow.winner === "O") turnLabel.innerText = gameFlow.player2.name + " wins!"
    }
    scoreboard.firstElementChild.innerText = gameFlow.player1.name  +  "'s score: " + gameFlow.player1.showScore();
    scoreboard.lastElementChild.innerText = gameFlow.player2.name + "'s score: " + gameFlow.player2.showScore();
    change_names_popup_forms[0].querySelector("input").value = "";
    change_names_popup_forms[1].querySelector("input").value = "";
});