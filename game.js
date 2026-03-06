const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuste automático de tamanho
canvas.width = 800;
canvas.height = 450;

let gameData = { gold: 0, wave: 1, archerLvl: 1, castleLvl: 1, currentHealth: 100 };

function loadGame() {
    const saved = localStorage.getItem('citadelSagaSave');
    if (saved) gameData = JSON.parse(saved);
}
loadGame();

let enemies = [];
let arrows = [];
let lastShot = 0;

function drawArcher(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 30, 40); // Corpo
    ctx.fillStyle = "#ffccbc"; ctx.fillRect(x+5, y+5, 20, 15); // Rosto
}

function upgradeArcher() {
    let cost = gameData.archerLvl * 50;
    if (gameData.gold >= cost) {
        gameData.gold -= cost; gameData.archerLvl++; saveGame(); updateUI();
    }
}

function upgradeCastle() {
    let cost = gameData.castleLvl * 100;
    if (gameData.gold >= cost) {
        gameData.gold -= cost; gameData.castleLvl++; 
        gameData.currentHealth = gameData.castleLvl * 100; saveGame(); updateUI();
    }
}

function saveGame() { localStorage.setItem('citadelSagaSave', JSON.stringify(gameData)); }

function updateUI() {
    document.getElementById('gold').innerText = gameData.gold;
    document.getElementById('wave').innerText = gameData.wave;
    document.getElementById('health').innerText = Math.floor(gameData.currentHealth);
    document.getElementById('archerCost').innerText = gameData.archerLvl * 50;
    document.getElementById('castleCost').innerText = gameData.castleLvl * 100;
    document.getElementById('arcLvl').innerText = gameData.archerLvl;
    document.getElementById('casLvl').innerText = gameData.castleLvl;
}

function update() {
    // Fundo
    ctx.fillStyle = "#81d4fa"; ctx.fillRect(0, 0, 800, 450);
    ctx.fillStyle = "#388e3c"; ctx.fillRect(0, 350, 800, 100);

    // Castelo
    ctx.fillStyle = "#455a64"; ctx.fillRect(20, 100, 80, 250);
    
    // TRIO DE ARQUEIRAS (Aparecem conforme o Lvl)
    drawArcher(45, 110, "#6a1b9a"); // Arqueira 1
    if(gameData.archerLvl > 5) drawArcher(45, 160, "#4a148c"); // Arqueira 2 (desbloqueia lvl 5)
    if(gameData.archerLvl > 10) drawArcher(45, 210, "#ffd700"); // Arqueira 3 (desbloqueia lvl 10)

    // Inimigos e Flechas
    enemies.forEach((en, i) => {
        en.x -= en.speed;
        ctx.fillStyle = "red"; ctx.beginPath(); ctx.arc(en.x, en.y, 20, 0, Math.PI*2); ctx.fill();
        if (en.hp <= 0) { enemies.splice(i, 1); gameData.gold += 10; updateUI(); }
        if (en.x < 100) { gameData.currentHealth -= 0.5; updateUI(); }
    });

    arrows.forEach((ar, i) => {
        ar.x += 15;
        ctx.fillStyle = "yellow"; ctx.fillRect(ar.x, ar.y, 10, 4);
        if (enemies[0] && ar.x > enemies[0].x) { enemies[0].hp -= (10 + gameData.archerLvl); arrows.splice(i, 1); }
    });

    if (Date.now() - lastShot > 600 && enemies.length > 0) {
        arrows.push({x: 100, y: 130});
        if(gameData.archerLvl > 5) arrows.push({x: 100, y: 180});
        lastShot = Date.now();
    }

    if (enemies.length === 0) {
        gameData.wave++; updateUI();
        for(let i=0; i<3 + (gameData.wave/2); i++) 
            enemies.push({x: 800 + (i*60), y: 320, hp: 20 + (gameData.wave*5), speed: 2});
    }

    requestAnimationFrame(update);
}
updateUI(); update();
