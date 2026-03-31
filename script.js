const SIMULATION_TIME_SECONDS = 20 * 60; // 20 minutes
let remainingSeconds = SIMULATION_TIME_SECONDS;
let isSimulationRunning = false;
let entities = [];
let simInterval;

const startBtn = document.getElementById('start-btn');
const uiLayer = document.getElementById('ui-layer');
const timerSpan = document.querySelector('#timer-box span');
const warLog = document.getElementById('war-log');
const entitiesLayer = document.getElementById('entities-layer');
const projectilesLayer = document.getElementById('projectiles-layer');

// Using the requested 5 countries
const countryTypes = ['turkey', 'azerbaijan', 'israel', 'america', 'germany'];

// Faction Dialogues
const dialogues = {
    'turkey': ['Hücum!', 'İleri!', 'Siper al!', 'Hedefi vurun!', 'Asla pes etme!'],
    'azerbaijan': ['Qardaşlar irəli!', 'Dayanmayın!', 'Atəş!', 'Hədəf vuruldu!'],
    'america': ['Freedom!', 'Air strike incoming!', 'Cover me!', 'Target locked!'],
    'israel': ['Iron Dome active!', 'Defend the position!', 'Fire!', 'Engaging target!'],
    'germany': ['Achtung!', 'Vorwärts!', 'Feuer!', 'Deckung!']
};

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function logCombat(msg) {
    const p = document.createElement('p');
    p.textContent = `[${formatTime(remainingSeconds)}] ${msg}`;
    warLog.appendChild(p);
    warLog.scrollTop = warLog.scrollHeight;
    
    // Limits log size
    if (warLog.childElementCount > 50) {
        warLog.removeChild(warLog.firstChild);
    }
}

function createUnit(type, x, y) {
    const ball = document.createElement('div');
    ball.className = `countryball ${type}`;
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    
    // Eyes
    const eyesContainer = document.createElement('div');
    eyesContainer.className = 'eyes';
    const eye1 = document.createElement('div'); eye1.className = 'eye';
    const eye2 = document.createElement('div'); eye2.className = 'eye';
    eyesContainer.appendChild(eye1);
    eyesContainer.appendChild(eye2);
    ball.appendChild(eyesContainer);
    
    entitiesLayer.appendChild(ball);
    
    return { 
        id: Math.random().toString(36).substr(2, 9),
        el: ball, 
        type: type, 
        x: x, 
        y: y, 
        hp: 100, 
        isDead: false 
    };
}

function spawnArmies() {
    entitiesLayer.innerHTML = ''; 
    entities = [];
    
    const cw = window.innerWidth;
    const ch = window.innerHeight;

    // Spawn 10 units per faction globally
    for(let c of countryTypes) {
        for(let i=0; i<10; i++) {
            // Keep them slightly away from screen edges
            const rx = Math.random() * (cw - 150) + 75;
            const ry = Math.random() * (ch - 150) + 75;
            entities.push(createUnit(c, rx, ry));
        }
    }
}

function showDialogue(unit, text) {
    if (unit.isDead) return;
    const bubble = document.createElement('div');
    bubble.className = 'dialogue';
    bubble.textContent = text;
    unit.el.appendChild(bubble);
    
    setTimeout(() => {
        if (unit.el.contains(bubble)) {
            unit.el.removeChild(bubble);
        }
    }, 2500);
}

function createExplosion(x, y) {
    const exp = document.createElement('div');
    exp.className = 'explosion';
    exp.style.left = `${x}px`;
    exp.style.top = `${y}px`;
    projectilesLayer.appendChild(exp); // Put explosions in projectile layer above entities
    setTimeout(() => exp.remove(), 500);
}

function fireWeapon(attacker, target) {
    const proj = document.createElement('div');
    proj.className = Math.random() > 0.5 ? 'projectile missile' : 'projectile';
    proj.style.left = `${attacker.x}px`;
    proj.style.top = `${attacker.y}px`;
    
    const angle = Math.atan2(target.y - attacker.y, target.x - attacker.x);
    proj.style.transform = `rotate(${angle}rad)`;
    
    projectilesLayer.appendChild(proj);

    // CSS Transition handles the animation
    setTimeout(() => {
        proj.style.left = `${target.x}px`;
        proj.style.top = `${target.y}px`;
    }, 20);

    // Hit registration
    setTimeout(() => {
        proj.remove();
        if (!target.isDead) {
            target.hp -= 25; // 4 hits to kill
            createExplosion(target.x, target.y);
            
            target.el.classList.add('angry');
            setTimeout(() => target.el.classList.remove('angry'), 400);

            if (target.hp <= 0) {
                target.isDead = true;
                target.el.classList.add('dead');
                // Target sinks/stays dead
                logCombat(`${attacker.type.toUpperCase()} birim, ${target.type.toUpperCase()} birimi yok etti!`);
            }
        }
    }, 300); // Must match CSS transition time approx
}

function engineTick() {
    const aliveUnits = entities.filter(e => !e.isDead);
    if (aliveUnits.length <= 1) {
        if (aliveUnits.length === 1 && remainingSeconds > 0) {
            logCombat(`${aliveUnits[0].type.toUpperCase()} DÜNYA HAKİMİYETİNİ SAĞLADI!`);
            endSimulation();
        }
        return; 
    }
    
    // Give 3 random alive units a chance to act per second
    for(let i=0; i<3; i++) {
        const actor = aliveUnits[Math.floor(Math.random() * aliveUnits.length)];
        if (!actor) continue;
        
        // Find targets (different teams)
        const enemies = aliveUnits.filter(e => e.type !== actor.type);
        if (enemies.length === 0) continue; 
        
        const target = enemies[Math.floor(Math.random() * enemies.length)];

        const actionRoll = Math.random();

        if (actionRoll < 0.35) {
            // 35% Chance to Attack
            actor.el.classList.add('angry');
            setTimeout(() => actor.el.classList.remove('angry'), 500);
            fireWeapon(actor, target);
        } else if (actionRoll < 0.75) {
            // 40% Chance to Move Randomly within a radius
            const moveDist = 150;
            let nx = actor.x + (Math.random() * moveDist * 2 - moveDist);
            let ny = actor.y + (Math.random() * moveDist * 2 - moveDist);
            
            // Keep in bounds
            nx = Math.max(50, Math.min(window.innerWidth - 50, nx));
            ny = Math.max(50, Math.min(window.innerHeight - 50, ny));
            
            actor.x = nx;
            actor.y = ny;
            actor.el.style.left = `${nx}px`;
            actor.el.style.top = `${ny}px`;
        } else {
            // 25% Chance to speak
            const texts = dialogues[actor.type];
            showDialogue(actor, texts[Math.floor(Math.random() * texts.length)]);
        }
    }
}

function runSimulation() {
    remainingSeconds--;
    timerSpan.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
        endSimulation();
        return;
    }

    engineTick();
}

function endSimulation() {
    clearInterval(simInterval);
    isSimulationRunning = false;
    document.getElementById('the-end').style.opacity = '1';
    document.getElementById('the-end').style.pointerEvents = 'auto';
    logCombat("SİMÜLASYON TAMAMLANDI VEYA DÜNYA HAKİMİYETİ SAĞLANDI.");
}

startBtn.addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('simulation-container').style.display = 'block';
    
    spawnArmies();
    logCombat("Savaş simülasyonu başlatıldı. Harita taraması devrede.");
    
    simInterval = setInterval(runSimulation, 1000);
    isSimulationRunning = true;
});
