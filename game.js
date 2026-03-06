const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- VARIÁVEIS DE ESTADO (PROGRESSO) ---
let gameData = {
    gold: 0,
    wave: 1,
    archerLvl: 1,
    castleLvl: 1,
    currentHealth: 100
};

// --- CARREGAR JOGO ---
function loadGame() {
    const savedData = localStorage.getItem('citadelSagaSave');
    if (savedData) {
        gameData = JSON.parse(savedData);
    }
}

// --- SALVAR JOGO ---
function saveGame() {
    localStorage.setItem('citadelSagaSave', JSON.stringify(gameData));
}

loadGame(); // Executa ao abrir o jogo

let enemies = [];
let arrows = [];
let lastShot = 0;

// --- FUNÇÕES DE DESENHO ---
function drawHero(x, y, lvl) {
    ctx.fillStyle = lvl > 5 ? "#ffd700" : "#6a1b9a"; // Fica dourada no lvl 5+
    ctx.fillRect(x, y, 40, 50);
    ctx.fillStyle = "#ffccbc"; ctx.fillRect(x + 10, y + 5, 20, 20);
    ctx.fillStyle = "black"; ctx.fillRect(x + 15, y + 10, 3, 3); ctx.fillRect(x + 22, y + 10, 3, 3);
}

function drawSlime(x, y) {
    ctx.fillStyle = "#4caf50";
    ctx.beginPath(); ctx.ellipse(x + 20, y + 20, 20, 15, 0, 0, Math.PI * 2); ctx.fill();
}

// --- UPGRADES ---
function upgradeArcher() {
    let cost = gameData.archerLvl * 50;
    if (gameData.gold >= cost) {
        gameData.gold -= cost;
        gameData.archerLvl++;
        saveGame();
        updateUI();
    } else { alert("Ouro insuficiente!"); }
}

function upgradeCastle() {
    let cost = gameData.castleLvl * 100;
    if (gameData.gold >= cost) {
        gameData.gold -= cost;
        gameData.castleLvl++;
        gameData.currentHealth = gameData.castleLvl * 100;
        saveGame();
        updateUI();
    } else { alert("Ouro insuficiente!"); }
}

function resetGame() {
    if(confirm("Deseja resetar todo seu progresso?")) {
        localStorage.removeItem('citadelSagaSave');
        location.reload();
    }
}

function updateUI() {
    document.getElementById('gold').innerText = gameData.gold;
    document.getElementById('wave').innerText = gameData.wave;
    document.getElementById('health').innerText = Math.floor(gameData.currentHealth);
    document.getElementById('maxHealth').innerText = gameData.castleLvl * 100;
    document.getElementById('archerCost').innerText = gameData.archerLvl * 50;
    document.getElementById('castleCost').innerText = gameData.castleLvl * 100;
}

function spawnEnemy() {
    let hpBase = 20 + (gameData.wave * 10);
    enemies.push({
        x: 800,
        y: 300 + (Math.random() * 30),
        hp: hpBase,
        maxHp: hpBase,
        speed: 1.2 + (gameData.wave * 0.1)
    });
}

function update() {
    ctx.fillStyle = "#81d4fa"; ctx.fillRect(0, 0, 800, 450); // Céu
    ctx.fillStyle = "#388e3c"; ctx.fillRect(0, 350, 800, 100); // Grama

    // Castelo
    ctx.fillStyle = "#455a64"; ctx.fillRect(20, 150, 100, 200);
    drawHero(80, 250, gameData.archerLvl);

    // Lógica de Inimigos
    enemies.forEach((en, i) => {
        en.x -= en.speed;
        drawSlime(en.x, en.y);
        ctx.fillStyle = "red"; ctx.fillRect(en.x, en.y - 10, (en.hp/en.maxHp)*40, 5);

        if (en.hp <= 0) {
            enemies.splice(i, 1);
            gameData.gold += 10 + gameData.wave;
            updateUI();
            saveGame(); // Salva o ouro ganho
        }

        if (en.x < 120) {
            gameData.currentHealth -= 0.1;
            updateUI();
            if (gameData.currentHealth <= 0) {
                alert("Derrota! Voltando uma Wave.");
                gameData.wave = Math.max(1, gameData.wave - 1);
                gameData.currentHealth = gameData.castleLvl * 100;
                enemies = [];
                saveGame();
            }
        }
    });

    // Flechas (Dano baseado no Lvl da Arqueira)
    arrows.forEach((ar, i) => {
        ar.x += 12;
        ctx.fillStyle = "yellow"; ctx.fillRect(ar.x, ar.y, 15, 4);
        if (enemies.length > 0 && ar.x > enemies[0].x) {
            enemies[0].hp -= (5 + (gameData.archerLvl * 5));
            arrows.splice(i, 1);
        }
    });

    // Atirar
    if (Date.now() - lastShot > 800 && enemies.length > 0) {
        arrows.push({x: 130, y: 275});
        lastShot = Date.now();
    }

    // Passar de Wave
    if (enemies.length === 0) {
        gameData.wave++;
        saveGame();
        updateUI();
        for(let i=0; i < 3 + Math.floor(gameData.wave/5); i++) spawnEnemy();
    }

    requestAnimationFrame(update);
}

updateUI();
update();
