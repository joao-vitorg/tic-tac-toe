let playerTurn = 0,
    round = 0,
    board = [[], [], []],
    scores = [0, 0]

let boardElement, restartElement, squaresElement, playersElement, mainElement

function loadGame() {
    // Get users
    let users = new URLSearchParams(window.location.search).getAll("user")
    if (!users || users.length !== 2) users = ["player 1", "player 2"]

    // Load elements
    boardElement = document.getElementById("board")
    mainElement = document.querySelector("main")
    restartElement = document.getElementById("restart")
    squaresElement = Array.from(document.getElementsByClassName("square"))
    playersElement = Array.from(document.querySelectorAll("#player1, #player2"))

    // Read the username
    playersElement.map((player, index) => {
        player.children[0].innerHTML = users[index]
    })

    // Reset button
    restartElement.addEventListener("click", resetGame)

    // Map the board
    squaresElement.map((square, index) => {
        const x = Math.floor(index / 3)
        const y = index % 3

        square.addEventListener("click", () => play(x, y))
        board[x][y] = { classList: square.classList, player: 0 }
    })
}

function resetGame() {
    board.map((row) => {
        row.map((square) => {
            square.player = 0
            square.classList.remove("o", "x", "clicked", "win", "tie")
        })
    })

    boardElement.classList.remove("reset")
    restartElement.style.display = "none"
    round = 0
}

function play(x, y) {
    const target = board[x][y]
    if (target.player !== 0) return

    target.player = [-1, 1][playerTurn]
    target.classList.add(["o", "x"][playerTurn], "clicked")

    round++
    verifyBoard(x, y)

    playerTurn = ++playerTurn % 2
    mainElement.classList.toggle("oturn")
    mainElement.classList.toggle("xturn")
}

function verifyBoard(x, y) {
    const verifyLines = [
        board[x].reduce((acc, curr) => acc + curr.player, 0),
        board.reduce((acc, curr) => acc + curr[y].player, 0),
        board.reduce((acc, curr, index) => acc + curr[index].player, 0),
        board.reduce((acc, curr, index) => acc + curr[2 - index].player, 0),
    ].some((sum, type) => checkLine(sum, type, x, y))

    if (!verifyLines && round === 9) tie()
}

function checkLine(sum, type, x, y) {
    if (sum === 3 || sum === -3) {
        win(type, x, y)
        return true
    }

    return false
}

function win(type, x, y) {
    const addWin = (value) => value.classList.add("win")

    ;[
        () => board[x].map(addWin),
        () => board.map((value) => addWin(value[y])),
        () => board.map((value, index) => addWin(value[index])),
        () => board.map((value, index) => addWin(value[2 - index])),
    ][type]()

    playersElement[playerTurn].children[1].innerHTML = ++scores[playerTurn]

    gameOver()
}

function tie() {
    squaresElement.map((border) => border.classList.add("tie"))
    gameOver()
}

function gameOver() {
    boardElement.classList.add("reset")
    restartElement.style.display = "block"
}

loadGame()
