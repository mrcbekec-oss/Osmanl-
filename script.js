const startBtn = document.getElementById('start-btn');
const shortsContainer = document.getElementById('shorts-container');
const sceneLayer = document.getElementById('scene-layer');
const startScreen = document.getElementById('start-screen');

// Karakter Tanımlamaları ve Başlangıç Koordinatları
const templates = {
    turkey: { 
        id: 'turkey', type: 'turkey', initX: 160, initY: 400, 
        html: `<div class="eyes"><div class="eye left"></div><div class="eye right"></div></div>
               <div class="dialogue"></div><span class="turkey-star">★</span>` 
    },
    georgia: { 
        id: 'georgia', type: 'georgia', initX: 300, initY: 260, 
        html: `<div class="eyes"><div class="eye left"></div><div class="eye right"></div></div>
               <div class="dialogue"></div>
               <div class="geo-cross c1"></div><div class="geo-cross c2"></div><div class="geo-cross c3"></div><div class="geo-cross c4"></div>` 
    },
    azerbaijan: { 
        id: 'azerbaijan', type: 'azerbaijan', initX: 360, initY: 480, 
        html: `<div class="eyes"><div class="eye left"></div><div class="eye right"></div></div>
               <div class="dialogue"></div>` 
    }
};

let actors = {};

// Sahneler ve Diyaloglar (Görseldeki Formata Uygun Meme Konuşmaları)
const scenarios = [
    {
        actors: ['georgia', 'turkey'],
        lines: [
            { a: 'georgia', t: "Gürcistan bir günlüğüne yerlerimizi değiştirelim mi?" },
            { a: 'turkey', t: "Sen ciddi misin? Ne işin var denizle?" },
            { a: 'georgia', t: "Hadi ama, Karadeniz bana da lazım!" },
            { a: 'turkey', t: "Sınır ihlali yapma da canını yakmayayım!", angry: true }
        ]
    },
    {
        actors: ['turkey', 'azerbaijan'],
        lines: [
            { a: 'turkey', t: "Nasılsın qardaşım?" },
            { a: 'azerbaijan', t: "Yaxşıyam! Kafkaslar güvendedir." },
            { a: 'turkey', t: "Bölgede sıkıntı çıkaran var mı?" },
            { a: 'azerbaijan', t: "Biz buradayken kimse ses çıkaramaz." }
        ]
    },
    {
        actors: ['georgia', 'azerbaijan'],
        lines: [
            { a: 'georgia', t: "Buralarda havalar iyice soğudu." },
            { a: 'azerbaijan', t: "Bizde petrol var qonşu, ısınırız dert etme!" }
        ]
    }
];

function createActor(tmpl) {
    const ball = document.createElement('div');
    ball.className = `countryball ${tmpl.type}`;
    ball.style.left = tmpl.initX + 'px';
    ball.style.top = tmpl.initY + 'px';
    ball.innerHTML = tmpl.html;
    
    sceneLayer.appendChild(ball);

    return { 
        id: tmpl.id, el: ball, 
        dlg: ball.querySelector('.dialogue'),
        x: tmpl.initX, y: tmpl.initY
    };
}

function initScene() {
    sceneLayer.innerHTML = '';
    actors = {};
    for(let k in templates) {
        actors[k] = createActor(templates[k]);
    }
}

// Yardımcı bekleme fonksiyonu
const wait = ms => new Promise(res => setTimeout(res, ms));

async function playScenario(scene) {
    // Aktif oyuncuları ön plana al
    scene.actors.forEach(id => {
        actors[id].el.style.zIndex = "40";
    });

    for (let line of scene.lines) {
        const actor = actors[line.a];
        
        if (line.angry) actor.el.classList.add('angry');
        
        // Konuşurken yukarı zıplama animasyonu (Meme Style)
        actor.el.classList.add('talking');
        
        // Metni uzunsa HTML tagları ile kırp, max karakter sınırlaması
        let words = line.t.split(' ');
        let formattedText = '';
        for (let i = 0; i < words.length; i++) {
            formattedText += words[i] + ' ';
            if ((i+1) % 4 === 0) formattedText += '<br>';
        }
        
        actor.dlg.innerHTML = formattedText;
        actor.dlg.classList.add('show');
        
        // Okuma süresi (karakter bazlı dinamik bekleme)
        const readTime = Math.max(2500, line.t.length * 80);
        await wait(readTime);
        
        // Metni kapat ve eski duruma dön
        actor.dlg.classList.remove('show');
        actor.el.classList.remove('talking');
        if (line.angry) actor.el.classList.remove('angry');
        
        await wait(800); // Satırlar arası nefes alma süresi
    }
    
    // Z-indexleri sıfırla
    scene.actors.forEach(id => {
        actors[id].el.style.zIndex = "20";
    });
}

function startEngine() {
    startScreen.style.display = 'none';
    shortsContainer.style.display = 'block';
    
    initScene();
    runLoop();
}

async function runLoop() {
    const endTime = Date.now() + (20 * 60 * 1000); // 20 Dakikalık döngü
    
    while(Date.now() < endTime) {
        // Rastgele bir skeç/bölüm seç
        const randomScene = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        // Oynat
        await playScenario(randomScene);
        
        // Skeçler arası 2-5 saniye sessizlik/bekleme
        await wait(2000 + Math.random() * 3000);
    }
    
    // Simülasyon sonu
    alert("20 Dakikalık Otomatik Çatışma ve Diyalog Hikayesi Sona Erdi.");
}

// Event Listeners
startBtn.addEventListener('click', startEngine);
