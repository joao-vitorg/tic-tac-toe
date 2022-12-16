let playerTurn = 0,
    round = 0,
    board = [[], [], []],
    scores = [0, 0],
    lineSum = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0],
    ]

let boardElement, restartElement, squaresElement, playersElement, mainElement

function loadGame() {
    // Load elements
    boardElement = document.getElementById("board")
    mainElement = document.querySelector("main")
    restartElement = document.getElementById("restart")
    squaresElement = Array.from(document.getElementsByClassName("square"))
    playersElement = Array.from(document.querySelectorAll("#user, #pc"))

    // Set the username
    playersElement[0].children[0].innerHTML = new URLSearchParams(window.location.search).get("user") || "Player"

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
    lineSum = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0],
    ]
    round = 0

    if (playerTurn === 1) pcPlay()
}

function play(x, y) {
    const target = board[x][y]
    if (target.player !== 0) return false

    target.player = [-1, 1][playerTurn]
    target.classList.add(["o", "x"][playerTurn], "clicked")

    round++
    const win = verifyBoard(x, y)

    playerTurn = ++playerTurn % 2
    mainElement.classList.toggle("userTurn")
    mainElement.classList.toggle("pcTurn")

    if (!win && playerTurn === 1) pcPlay()
    return true
}

function sumBoard(x, y) {
    lineSum[0][x] = board[x].reduce((acc, curr) => acc + curr.player, 0)
    lineSum[1][y] = board.reduce((acc, curr) => acc + curr[y].player, 0)
    lineSum[2][0] = board.reduce((acc, curr, index) => acc + curr[index].player, 0)
    lineSum[2][1] = board.reduce((acc, curr, index) => acc + curr[2 - index].player, 0)
}

function verifyBoard(x, y) {
    sumBoard(x, y)

    const win = [
        [0, x],
        [1, y],
        [2, 0],
        [2, 1],
    ].some(([a, b], type) => checkLine(lineSum[a][b], type, x, y))

    if (win) return true
    if (round === 9) return tie()
    return false
}

function checkLine(sum, type, x, y) {
    if (sum === 3 || sum === -3) return win(type, x, y)
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

    return gameOver()
}

function tie() {
    squaresElement.map((border) => border.classList.add("tie"))
    return gameOver()
}

function gameOver() {
    boardElement.classList.add("reset")
    restartElement.style.display = "block"
    return true
}

function pcPlay() {
    if (pcVerifyBoard()) return
    if (play(1, 1)) return

    let x, y
    do {
        x = Math.floor(Math.random() * 3)
        y = Math.floor(Math.random() * 3)
    } while (!play(x, y))
}

function pcVerifyBoard() {
    for (let op = 2; op >= -2; op -= 4) {
        for (let i = 0; i < 3; i++) {
            if (lineSum[0][i] === op) {
                return play(i, 0) || play(i, 1) || play(i, 2)
            }
        }

        for (let j = 0; j < 3; j++) {
            if (lineSum[1][j] === op) {
                return play(0, j) || play(1, j) || play(2, j)
            }
        }

        if (lineSum[2][0] === op) {
            return play(0, 0) || play(1, 1) || play(2, 2)
        }

        if (lineSum[2][1] === op) {
            return play(2, 0) || play(1, 1) || play(0, 2)
        }
    }

    return false
}

loadGame()
