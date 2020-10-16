const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
let counter = document.querySelector('.counter')

const ball = {              //Мячик
    x: canvas.width / 2,
    y: canvas.height - 20,
    width: 10,
    height: 10,
    speed: 300,
    angle: Math.PI / 4 + Math.random() * Math.PI / 2
}

const platforma = {         //Платформа
    x: (canvas.width - 150) / 2,
    y: canvas.height - 20,
    width: 150,
    height: 15,
    speed: 200,
    leftKey: false,
    rightKey: false
}

const blocks = [             //Блоки
    { x: 20, y: 20, width: 50, height: 20 },
    { x: 90, y: 20, width: 50, height: 20 },
    { x: 160, y: 20, width: 50, height: 20 },
    { x: 230, y: 20, width: 50, height: 20 },
    { x: 300, y: 20, width: 50, height: 20 },
    { x: 370, y: 20, width: 50, height: 20 },
    { x: 440, y: 20, width: 50, height: 20 },
    { x: 20, y: 60, width: 50, height: 20 },
    { x: 90, y: 60, width: 50, height: 20 },
    { x: 160, y: 60, width: 50, height: 20 },
    { x: 230, y: 60, width: 50, height: 20 },
    { x: 300, y: 60, width: 50, height: 20 },
    { x: 370, y: 60, width: 50, height: 20 },
    { x: 440, y: 60, width: 50, height: 20 },
    { x: 20, y: 100, width: 50, height: 20 },
    { x: 90, y: 100, width: 50, height: 20 },
    { x: 160, y: 100, width: 50, height: 20 },
    { x: 230, y: 100, width: 50, height: 20 },
    { x: 300, y: 100, width: 50, height: 20 },
    { x: 370, y: 100, width: 50, height: 20 },
    { x: 440, y: 100, width: 50, height: 20 },
    { x: 20, y: 140, width: 50, height: 20 },
    { x: 90, y: 140, width: 50, height: 20 },
    { x: 160, y: 140, width: 50, height: 20 },
    { x: 230, y: 140, width: 50, height: 20 },
    { x: 300, y: 140, width: 50, height: 20 },
    { x: 370, y: 140, width: 50, height: 20 },
    { x: 440, y: 140, width: 50, height: 20 },

]

const limits = [
    { x: 0, y: -20, width: canvas.width, height: 20 },
    { x: canvas.width, y: 0, width: 20, height: canvas.height },
    { x: 0, y: canvas.height, width: canvas.width, height: 20 },
    { x: -20, y: 0, width: 20, height: canvas.height },
]

document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowLeft") {
        platforma.leftKey = true
    }
    if (e.key === "ArrowRight") {
        platforma.rightKey = true
    }
})

document.addEventListener('keyup', function (e) {
    if (e.key === "ArrowLeft") {
        platforma.leftKey = false
    }
    if (e.key === "ArrowRight") {
        platforma.rightKey = false
    }
})

function gameOver() {
    if (ball.y > canvas.height - 20) {
        return true
    }
}

requestAnimationFrame(loop) //Анимация Зависящая не от взаданого времени, а от частоты экрана
let count = 0;
let pTimestamp = 0
function loop(timestamp) {

    const dTimestamp = timestamp - pTimestamp
    const secondPart = dTimestamp / 1000 // Кол-во секунд
    pTimestamp = timestamp
    if (!gameOver()) {
        requestAnimationFrame(loop)
    }
    else {
        ball.width = 0
        ball.height = 0
        alert('Проиграли')
        count = 0;
        pTimestamp = 0
        location.reload()
    }

    clearCanvas()

    ball.x += secondPart * ball.speed * Math.cos(ball.angle) //Движение мячика
    ball.y -= secondPart * ball.speed * Math.sin(ball.angle)

    if (platforma.leftKey) {// Движение платформы
        platforma.x = Math.max(0, platforma.x - secondPart * platforma.speed)
    }
    if (platforma.rightKey) {// Движение платформы
        platforma.x = Math.min(canvas.width - platforma.width, platforma.x + secondPart * platforma.speed)
    }

    for (let block of blocks) { // Проверка столкновений
        if (isIntersection(block, ball)) {
            toggleItem(blocks, block)

            let ctrl1 = { x: block.x - 10, y: block.y - 10, width: 10 + block.width, height: 10 }
            let ctrl2 = { x: block.x + block.width, y: block.y - 10, width: 10, height: 10 + block.height }
            let ctrl3 = { x: block.x, y: block.y + block.height, width: 10 + block.width, height: 10 }
            let ctrl4 = { x: block.x - 10, y: block.y, width: 10, height: 10 + block.height }

            if (isIntersection(ctrl1, ball) || isIntersection(ctrl3, ball)) {
                ball.angle = Math.PI * 2 - ball.angle
            }
            if (isIntersection(ctrl2, ball) || isIntersection(ctrl4, ball)) {
                ball.angle = Math.PI - ball.angle
            }
        }
    }

    if (isIntersection(limits[0], ball) || isIntersection(limits[2], ball)) {
        ball.angle = Math.PI * 2 - ball.angle
    }
    if (isIntersection(limits[1], ball) || isIntersection(limits[3], ball)) {
        ball.angle = Math.PI - ball.angle
    }

    drawRect(ball)
    for (let i of blocks) {
        drawRect(i)
    }

    drawRect(platforma)
    if (isIntersection(platforma, ball)) {
        ball.angle = Math.PI * 2 - ball.angle
    }
}

function clearCanvas() {
    canvas.width |= 0
    canvas.height |= 0
}

function drawRect(param) {
    ctx.beginPath()
    ctx.rect(param.x, param.y, param.width, param.height)
    ctx.strokeStyle = 'blue'
    ctx.stroke()
}

function isIntersection(blockA, blockB) { // Столкновение 
    const pointsA = [
        { x: blockA.x, y: blockA.y },
        { x: blockA.x + blockA.width, y: blockA.y },
        { x: blockA.x, y: blockA.y + blockA.height },
        { x: blockA.x + blockA.width, y: blockA.y + blockA.height },
    ]

    for (let pointA of pointsA) {
        if (blockB.x <= pointA.x && pointA.x <= blockB.x + blockB.width && blockB.y <= pointA.y && pointA.y <= blockB.y + blockB.height) {
            return true
        }
    }

    const pointsB = [
        { x: blockB.x, y: blockB.y },
        { x: blockB.x + blockB.width, y: blockB.y },
        { x: blockB.x, y: blockB.y + blockB.height },
        { x: blockB.x + blockB.width, y: blockB.y + blockB.height },
    ]

    for (let pointB of pointsB) {
        if (blockA.x <= pointB.x && pointB.x <= blockA.x + blockA.width && blockA.y <= pointB.y && pointB.y <= blockA.y + blockA.height) {
            return true
        }
    }

    return false
}

function toggleItem(array, item) { // Удаление блоков при столкновении
    if (array.includes(item)) {
        let index = array.indexOf(item)
        array.splice(index, 1)
        count++
        counter.textContent = count
    }
    else {
        array.push(item)
    }
}