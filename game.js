const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gold = 0;
let wave = 1;
let castleHealth = 100;
let enemies = [];
let arrows = [];

// Função para desenhar a Arqueira (Sombra Veloz) via Código
function drawHero(x, y) {
    // Corpo/Capa
    ctx.fillStyle = "#6a1b9a"; // Roxo escuro
    ctx.fillRect(x, y, 40, 50);
    // Rosto
    ctx.fillStyle = "#ffccbc"; 
    ctx.fillRect(x + 10, y + 5, 20, 20);
    // Olhos
    ctx.fillStyle = "black";
    ctx.fillRect(x + 15, y + 10, 3, 3);
    ctx.fillRect(x + 22, y + 10, 3, 3);
    // Arco
    ctx.strokeStyle = "#795548";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 45, y + 25, 15, -Math.PI/2, Math.PI/2);
    ctx.stroke();
}

// Função para desenhar o Slime (Inimigo) via Código
function drawSlime(x, y) {
    ctx.fillStyle = "#4caf50"; // Verde vibrante
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 20, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Olhos do Slime
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + 12, y + 15, 4, 0, Math.PI * 2);
    ctx.arc(x + 28, y + 15, 4, 0, Math.PI * 2);
    ctx.fill();
}

function spawnEnemy() {
    enemies.push({
        x: 800,
        y: 300 + (Math.random() * 30),
        hp: 30 + (wave * 5),
        maxHp: 30 + (wave * 5),
        speed: 1.5 + (wave * 0.1)
    });
}

function update() {
    // 1. Desenhar Fundo (Céu e Grama)
    ctx.fillStyle = "#81d4fa"; // Céu azul
    ctx.fillRect(0, 0, 800, 450);
    ctx.fillStyle = "#388e3c"; // Grama
    ctx.fillRect(0, 350, 800, 100);

    // 2. Desenhar a Cidadela (Castelo)
    ctx.fillStyle = "#455a64";
    ctx.fillRect(20, 150, 100, 200); // Torre principal
    ctx.fillStyle = "#263238";
    ctx.fillRect(10, 140, 120, 20); // Topo da torre

    // 3. Desenhar a Nossa Arqueira
    drawHero(80, 250);

    // 4. Lógica e Desenho dos Inimigos
    enemies.forEach((en, i) => {
        en.x -= en.speed;
        drawSlime(en.x, en.y);

        // Barra de Vida
        ctx.fillStyle = "red";
        ctx.fillRect(en.x, en.y - 10, (en.hp/en.maxHp)*40, 5);

        if (en.hp <= 0) {
            enemies.splice(i, 1);
            gold += 10;
        }

        if (en.x < 120) {
            castleHealth -= 0.05;
            if (castleHealth <= 0) {
                alert("A Cidadela caiu na Wave " + wave);
                location.reload();
            }
        }
    });

    // 5. Flechas
    arrows.forEach((ar, i) => {
        ar.x += 10;
        ctx.fillStyle = "#ffeb3b"; // Flecha dourada
        ctx.fillRect(ar.x, ar.y, 15, 4);
        
        if (enemies.length > 0 && ar.x > enemies[0].x) {
            enemies[0].hp -= 15;
            arrows.splice(i, 1);
        }
    });

    // Atirar (Baseado no tempo)
    if (Date.now() % 50 < 10 && enemies.length > 0) {
        arrows.push({x: 130, y: 275});
    }

    // Atualizar UI
    document.getElementById('gold').innerText = gold;
    document.getElementById('health').innerText = Math.floor(castleHealth);

    if (enemies.length < 3) spawnEnemy();

    requestAnimationFrame(update);
}

update();
