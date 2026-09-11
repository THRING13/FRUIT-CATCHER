// ======================================================
// 🍎 FRUIT CATCHER
// Jeu complet - Version de base
// ======================================================


// ======================================================
// CANVAS
// ======================================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;


// ======================================================
// ÉLÉMENTS HTML
// ======================================================

const scoreElement =
    document.getElementById("score");

const levelElement =
    document.getElementById("level");

const highscoreElement =
    document.getElementById("highscore");

const livesElement =
    document.getElementById("lives");

const overlay =
    document.getElementById("overlay");

const overlayTitle =
    document.getElementById("overlayTitle");

const overlayText =
    document.getElementById("overlayText");

const startButton =
    document.getElementById("startBtn");


// ======================================================
// VARIABLES DU JEU
// ======================================================

let score = 0;

let lives = 3;

let level = 1;

let gameRunning = false;

let animationId = null;


// ======================================================
// MEILLEUR SCORE
// ======================================================

let highscore =
    parseInt(
        localStorage.getItem(
            "fruitCatcherHighscore"
        )
    ) || 0;

highscoreElement.textContent =
    highscore;


// ======================================================
// PANIER
// ======================================================

const basket = {

    width: 90,

    height: 55,

    x:
        W / 2 - 45,

    y:
        H - 90,

    speed: 7,

    moveLeft: false,

    moveRight: false
};


// ======================================================
// FRUITS
// ======================================================

const fruits = [

    {
        emoji: "🍎",
        points: 10
    },

    {
        emoji: "🍊",
        points: 10
    },

    {
        emoji: "🍇",
        points: 15
    },

    {
        emoji: "🍓",
        points: 15
    },

    {
        emoji: "🍌",
        points: 10
    },

    {
        emoji: "🍉",
        points: 20
    },

    {
        emoji: "⭐",
        points: 30
    }

];


// ======================================================
// BOMBES
// ======================================================

const bomb = {

    emoji: "💣",

    bomb: true,

    points: 0

};


// ======================================================
// MAUVAIS OBJETS
// ======================================================

const badObjects = [

    {
        emoji: "🍄",
        bad: true
    },

    {
        emoji: "🐛",
        bad: true
    },

    {
        emoji: "🤢",
        bad: true
    }

];


// ======================================================
// OBJETS QUI TOMBENT
// ======================================================

let fallingItems = [];


// ======================================================
// PARTICULES
// ======================================================

let particles = [];


// ======================================================
// DIFFICULTÉ
// ======================================================

let spawnTimer = 0;

let spawnInterval = 65;

let baseFallSpeed = 2.5;

const pointsPerLevel = 100;

let levelFlash = 0;


// ======================================================
// RÉINITIALISER LE JEU
// ======================================================

function resetGame() {

    score = 0;

    lives = 3;

    level = 1;

    fallingItems = [];

    particles = [];

    spawnTimer = 0;

    spawnInterval = 65;

    baseFallSpeed = 2.5;

    levelFlash = 0;

    basket.x =
        W / 2 -
        basket.width / 2;

    updateUI();
}


// ======================================================
// METTRE À JOUR L'INTERFACE
// ======================================================

function updateUI() {

    scoreElement.textContent =
        score;

    levelElement.textContent =
        level;

    const fullHearts =
        "❤️".repeat(
            Math.max(lives, 0)
        );

    const emptyHearts =
        "🖤".repeat(
            3 -
            Math.max(lives, 0)
        );

    livesElement.textContent =
        fullHearts +
        emptyHearts;
}


// ======================================================
// FOND
// ======================================================

function drawBackground() {

    // Ciel

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        "#87CEEB"
    );

    gradient.addColorStop(
        0.7,
        "#CDEFFF"
    );

    gradient.addColorStop(
        1,
        "#E8F9D8"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    // Soleil

    ctx.beginPath();

    ctx.arc(
        510,
        65,
        38,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#FFD93D";

    ctx.fill();


    // Nuages

    drawCloud(
        80,
        70,
        0.9
    );

    drawCloud(
        330,
        110,
        0.7
    );

    drawCloud(
        470,
        170,
        0.5
    );


    // Sol

    ctx.fillStyle =
        "#69B34C";

    ctx.fillRect(
        0,
        H - 55,
        W,
        55
    );
}


// ======================================================
// NUAGE
// ======================================================

function drawCloud(
    x,
    y,
    scale
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.scale(
        scale,
        scale
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.7)";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        20,
        0,
        Math.PI * 2
    );

    ctx.arc(
        25,
        -10,
        28,
        0,
        Math.PI * 2
    );

    ctx.arc(
        50,
        0,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


// ======================================================
// PANIER
// ======================================================

function drawBasket() {

    const x =
        basket.x;

    const y =
        basket.y;


    ctx.save();


    // Ombre

    ctx.beginPath();

    ctx.ellipse(
        x + basket.width / 2,
        y + basket.height + 5,
        basket.width / 2,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(0,0,0,0.2)";

    ctx.fill();


    // Corps

    ctx.beginPath();

    ctx.moveTo(
        x,
        y + 8
    );

    ctx.lineTo(
        x + basket.width,
        y + 8
    );

    ctx.lineTo(
        x + basket.width - 10,
        y + basket.height
    );

    ctx.lineTo(
        x + 10,
        y + basket.height
    );

    ctx.closePath();


    const basketGradient =
        ctx.createLinearGradient(
            0,
            y,
            0,
            y + basket.height
        );

    basketGradient.addColorStop(
        0,
        "#A1887F"
    );

    basketGradient.addColorStop(
        1,
        "#5D4037"
    );

    ctx.fillStyle =
        basketGradient;

    ctx.fill();


    // Contour

    ctx.strokeStyle =
        "#3E2723";

    ctx.lineWidth = 3;

    ctx.stroke();


    // Bord supérieur

    ctx.fillStyle =
        "#8D6E63";

    ctx.fillRect(
        x - 4,
        y,
        basket.width + 8,
        12
    );


    // Poignée

    ctx.strokeStyle =
        "#5D4037";

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.arc(
        x + basket.width / 2,
        y + 5,
        30,
        Math.PI,
        0
    );

    ctx.stroke();


    ctx.restore();
}


// ======================================================
// CRÉER UN OBJET QUI TOMBE
// ======================================================

function spawnItem() {

    const random =
        Math.random();

    let type;


    // 12% bombe

    if (random < 0.12) {

        type = bomb;

    }

    // 18% mauvais objet

    else if (random < 0.30) {

        type =
            badObjects[
                Math.floor(
                    Math.random() *
                    badObjects.length
                )
            ];

    }

    // 70% bon fruit

    else {

        type =
            fruits[
                Math.floor(
                    Math.random() *
                    fruits.length
                )
            ];
    }


    const size = 42;


    fallingItems.push({

        x:
            Math.random() *
            (W - size),

        y:
            -size,

        size:

            size,

        speed:

            baseFallSpeed +
            Math.random() * 1.5,

        type:

            type,

        rotation: 0,

        rotationSpeed:

            (Math.random() - 0.5) *
            0.08
    });
}


// ======================================================
// DESSINER UN OBJET
// ======================================================

function drawItem(item) {

    ctx.save();


    ctx.translate(

        item.x +
        item.size / 2,

        item.y +
        item.size / 2

    );


    ctx.rotate(
        item.rotation
    );


    ctx.font =
        `${item.size}px Arial`;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.fillText(
        item.type.emoji,
        0,
        0
    );


    ctx.restore();
}


// ======================================================
// COLLISION
// ======================================================

function checkCollision(item) {

    return (

        item.x <
        basket.x +
        basket.width -

        10

        &&

        item.x +
        item.size >

        basket.x +
        10

        &&

        item.y +
        item.size >

        basket.y

        &&

        item.y <

        basket.y +
        basket.height

    );
}


// ======================================================
// PARTICULES
// ======================================================

function createParticles(
    x,
    y,
    amount = 10
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        particles.push({

            x: x,

            y: y,

            vx:
                (Math.random() - 0.5)
                * 6,

            vy:
                (Math.random() - 0.5)
                * 6
                - 2,

            life: 30,

            size:
                Math.random() * 4 + 2

        });
    }
}


// ======================================================
// METTRE À JOUR PARTICULES
// ======================================================

function updateParticles() {

    particles.forEach(
        particle => {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;

            particle.vy +=
                0.2;

            particle.life--;

        }
    );


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );
}


// ======================================================
// DESSINER PARTICULES
// ======================================================

function drawParticles() {

    particles.forEach(
        particle => {

            ctx.globalAlpha =
                particle.life / 30;

            ctx.fillStyle =
                "#FFD93D";

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.globalAlpha = 1;

        }
    );
}


// ======================================================
// LEVEL UP
// ======================================================

function checkLevel() {

    const newLevel =
        Math.floor(
            score /
            pointsPerLevel
        ) + 1;


    if (
        newLevel >
        level
    ) {

        level =
            newLevel;


        // Fruits plus rapides

        baseFallSpeed +=
            0.5;


        // Spawn plus rapide

        spawnInterval =
            Math.max(
                25,
                spawnInterval - 5
            );


        levelFlash = 45;


        updateUI();
    }
}


// ======================================================
// BOUCLE PRINCIPALE
// ======================================================

function gameLoop() {

    if (!gameRunning) {

        return;
    }


    // Nettoyer

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    // Fond

    drawBackground();


    // ======================================
    // PANIER
    // ======================================

    if (
        basket.moveLeft
    ) {

        basket.x -=
            basket.speed;
    }


    if (
        basket.moveRight
    ) {

        basket.x +=
            basket.speed;
    }


    // Empêcher le panier de sortir

    basket.x =
        Math.max(
            0,
            Math.min(
                W - basket.width,
                basket.x
            )
        );


    // ======================================
    // CRÉER DES FRUITS
    // ======================================

    spawnTimer++;


    if (
        spawnTimer >=
        spawnInterval
    ) {

        spawnItem();

        spawnTimer = 0;
    }


    // ======================================
    // NIVEAU
    // ======================================

    checkLevel();


    if (
        levelFlash > 0
    ) {

        levelFlash--;
    }


    // ======================================
    // OBJETS
    // ======================================

    for (
        let i =
            fallingItems.length - 1;

        i >= 0;

        i--
    ) {

        const item =
            fallingItems[i];


        // Faire tomber

        item.y +=
            item.speed;


        // Rotation

        item.rotation +=
            item.rotationSpeed;


        // ==================================
        // COLLISION
        // ==================================

        if (
            checkCollision(item)
        ) {

            const centerX =
                item.x +
                item.size / 2;

            const centerY =
                item.y +
                item.size / 2;


            // Bombe / mauvais objet

            if (
                item.type.bomb ||
                item.type.bad
            ) {

                lives--;


                createParticles(
                    centerX,
                    centerY,
                    15
                );


                updateUI();


                if (
                    lives <= 0
                ) {

                    endGame();
                }

            }


            // Bon fruit

            else {

                score +=
                    item.type.points;


                createParticles(
                    centerX,
                    centerY,
                    10
                );


                updateUI();
            }


            // Supprimer

            fallingItems.splice(
                i,
                1
            );


            continue;
        }


        // ==================================
        // OBJET SORTI DE L'ÉCRAN
        // ==================================

        if (
            item.y > H
        ) {

            // Si c'est un bon fruit
            // qu'on n'a pas attrapé

            if (
                !item.type.bomb &&
                !item.type.bad
            ) {

                lives--;


                updateUI();


                if (
                    lives <= 0
                ) {

                    endGame();
                }
            }


            fallingItems.splice(
                i,
                1
            );
        }
    }


    // ======================================
    // PARTICULES
    // ======================================

    updateParticles();


    // ======================================
    // DESSIN
    // ======================================

    fallingItems.forEach(
        drawItem
    );


    drawParticles();


    drawBasket();


    // ======================================
    // MESSAGE LEVEL UP
    // ======================================

    if (
        levelFlash > 0
    ) {

        ctx.save();


        ctx.globalAlpha =
            Math.min(
                1,
                levelFlash / 20
            );


        ctx.font =
            "bold 42px Arial";

        ctx.textAlign =
            "center";


        ctx.lineWidth = 5;


        ctx.strokeStyle =
            "#E67E22";


        ctx.fillStyle =
            "white";


        ctx.strokeText(
            `Niveau ${level} !`,
            W / 2,
            H / 2
        );


        ctx.fillText(
            `Niveau ${level} !`,
            W / 2,
            H / 2
        );


        ctx.restore();
    }


    // ======================================
    // PROCHAINE FRAME
    // ======================================

    if (gameRunning) {

        animationId =
            requestAnimationFrame(
                gameLoop
            );
    }
}


// ======================================================
// GAME OVER
// ======================================================

function endGame() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    // Nouveau record

    if (
        score >
        highscore
    ) {

        highscore =
            score;


        localStorage.setItem(
            "fruitCatcherHighscore",
            highscore
        );


        highscoreElement.textContent =
            highscore;


        overlayTitle.textContent =
            "🏆 Nouveau record !";

    }

    else {

        overlayTitle.textContent =
            "💀 Partie terminée";
    }


    overlayText.textContent =
        `Ton score final est : ${score}`;


    startButton.textContent =
        "🔄 Rejouer";


    overlay.style.display =
        "flex";
}


// ======================================================
// DÉMARRER LE JEU
// ======================================================

function startGame() {

    resetGame();


    overlay.style.display =
        "none";


    gameRunning =
        true;


    gameLoop();
}


// ======================================================
// BOUTON JOUER
// ======================================================

startButton.addEventListener(
    "click",
    startGame
);


// ======================================================
// CLAVIER
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            basket.moveLeft =
                true;

            event.preventDefault();
        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            basket.moveRight =
                true;

            event.preventDefault();
        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            basket.moveLeft =
                false;
        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            basket.moveRight =
                false;
        }

    }
);


// ======================================================
// SOURIS
// ======================================================

canvas.addEventListener(
    "mousemove",
    function(event) {

        if (!gameRunning) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const mouseX =
            (
                event.clientX -
                rect.left
            )
            *
            (
                W /
                rect.width
            );


        basket.x =
            mouseX -
            basket.width / 2;


        basket.x =
            Math.max(
                0,
                Math.min(
                    W -
                    basket.width,
                    basket.x
                )
            );
    }
);


// ======================================================
// TACTILE
// ======================================================

canvas.addEventListener(
    "touchmove",
    function(event) {

        if (!gameRunning) {
            return;
        }


        event.preventDefault();


        const rect =
            canvas.getBoundingClientRect();


        const touchX =
            (
                event.touches[0].clientX -
                rect.left
            )
            *
            (
                W /
                rect.width
            );


        basket.x =
            touchX -
            basket.width / 2;


        basket.x =
            Math.max(
                0,
                Math.min(
                    W -
                    basket.width,
                    basket.x
                )
            );

    },
    {
        passive: false
    }
);


// ======================================================
// ÉCRAN INITIAL
// ======================================================

function drawInitialScreen() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    drawBackground();


    drawBasket();
}


drawInitialScreen();

updateUI();