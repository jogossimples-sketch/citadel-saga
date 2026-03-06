const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Estados do Jogo
let gold = 0;
let wave = 1;
let castleHealth = 100;
let enemies = [];
let arrows = [];

// Configuração do Castelo e Heróis
const castle = { x: 50, y: 150, width: 80, height: 200 };
const heroes = [
    { name: "Sombra Veloz", type: "Archer", damage: 10, cooldown: 60, timer: 0 },
    { name: "Mestre do Gelo", type: "Mage", damage: 5, cooldown: 120, timer: 0 }
];

// Função para criar inimigos por Wave
function spawnEnemy() {
    enemies.push({
        x: 850,
        y: 250 + (Math.random() * 100),
        hp: 20 + (wave * 5),
        speed: 1 + (Math.random() * 0.5)
    });
}

// Loop Principal
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar Castelo (Representando a Cidadela)
    ctx.fillStyle = "#666";
    ctx.fillRect(castle.x, castle.y, castle.width, castle.height);
    
    // Lógica dos Heróis (Atacar automaticamente)
    heroes.forEach(hero => {
        hero.timer++;
        if (hero.timer >= hero.cooldown && enemies.length > 0) {
            arrows.push({ x: castle.x + 80, y: castle.y + 50, target: enemies[0], dmg: hero.damage });
            hero.timer = 0;
        }
    });

    // Mover Flechas
    arrows.forEach((arrow, index) => {
        arrow.x += 5;
        ctx.fillStyle = "yellow";
        ctx.fillRect(arrow.x, arrow.y, 10, 2);
        
        // Colisão com Inimigo
        if (arrow.x > arrow.target.x) {
            arrow.target.hp -= arrow.dmg;
            arrows.splice(index, 1);
        }
    });

    // Mover e Desenhar Inimigos
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y, 30, 30);

        if (enemy.hp <= 0) {
            enemies.splice(index, 1);
            gold += 10;
            document.getElementById('gold').innerText = gold;
        }

        // Dano no Castelo
        if (enemy.x <= castle.x + castle.width) {
            castleHealth -= 0.1;
            document.getElementById('health').innerText = Math.floor(castleHealth);
            if (castleHealth <= 0) alert("GAME OVER! A Cidadela caiu.");
        }
    });

    if (enemies.length === 0 && Math.random() < 0.02) spawnEnemy();

    requestAnimationFrame(update);
}

update();
