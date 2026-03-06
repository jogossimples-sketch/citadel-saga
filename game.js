const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Estados do Jogo
let gold = 0;
let wave = 1;
let castleHealth = 100;
let enemies = [];
let arrows = [];

// --- CARREGAMENTO DE IMAGENS ---
const images = {
    bg: new Image(),
    archer: new Image(),
    enemy: new Image()
};

// Substitua as URLs abaixo pelos caminhos reais das suas imagens
images.bg.src = 'background.png'; 
images.archer.src = 'hero_archer.png'; 
images.enemy.src = 'enemy_slime.png'; 

// Configuração do Castelo e Heróis
const castle = { x: 50, y: 150, width: 80, height: 200 };
const heroes = [
    { name: "Sombra Veloz", type: "Archer", damage: 15, cooldown: 50, timer: 0, x: castle.x + 20, y: castle.y + 40 }
];

function spawnEnemy() {
    enemies.push({
        x: 850,
        y: 280 + (Math.random() * 60), // Ajustado para o caminho do novo background
        hp: 30 + (wave * 8),
        speed: 1.2 + (Math.random() * 0.4),
        width: 40, height: 40 // Tamanho visual do slime
    });
}

function update() {
    // 1. Desenhar o Cenário (Substituindo o fundo cinza)
    ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height);

    // 2. Lógica dos Heróis e Desenhar Personagens
    heroes.forEach(hero => {
        hero.timer++;
        
        // Desenhar a Arqueira (Substituindo o castelo cinza por um ponto)
        // No futuro, desenharemos a cidadela e os heróis EM CIMA dela.
        ctx.drawImage(images.archer, hero.x, hero.y, 50, 60);

        if (hero.timer >= hero.cooldown && enemies.length > 0) {
            // Atirar no inimigo mais próximo
            arrows.push({ x: hero.x + 30, y: hero.y + 20, target: enemies[0], dmg: hero.damage });
            hero.timer = 0;
        }
    });

    // 3. Lógica e Desenho das Flechas
    arrows.forEach((arrow, index) => {
        arrow.x += 7; // Flechas mais rápidas
        
        // Desenhar Flecha (Podemos usar uma imagem de flecha depois)
        ctx.fillStyle = "#FFD700"; // Dourado
        ctx.fillRect(arrow.x, arrow.y, 12, 3);
        
        if (arrow.x > arrow.target.x + 10) { // Colisão ajustada
            arrow.target.hp -= arrow.dmg;
            arrows.splice(index, 1);
        }
    });

    // 4. Mover e Desenhar Inimigos (Substituindo o quadrado vermelho)
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        
        // Desenhar o Slime
        ctx.drawImage(images.enemy, enemy.x, enemy.y, enemy.width, enemy.height);

        // Barra de Vida do Inimigo
        ctx.fillStyle = "black"; ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
        ctx.fillStyle = "red"; ctx.fillRect(enemy.x, enemy.y - 10, (enemy.hp / (30 + (wave * 8))) * enemy.width, 5);

        if (enemy.hp <= 0) {
            enemies.splice(index, 1);
            gold += 15;
            document.getElementById('gold').innerText = gold;
        }

        if (enemy.x <= castle.x + castle.width) {
            castleHealth -= 0.2;
            document.getElementById('health').innerText = Math.floor(castleHealth);
            if (castleHealth <= 0) {
                alert("A Cidadela de Aethelgard caiu! Sobrevivemos até a Wave " + wave);
                location.reload(); // Recomeçar
            }
        }
    });

    // Spawn automático
    if (enemies.length < 3 && Math.random() < 0.01) spawnEnemy();

    requestAnimationFrame(update);
}

// Iniciar após carregar as imagens
images.bg.onload = () => {
    update();
};
