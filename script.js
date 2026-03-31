const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const container = document.getElementById('animation-container');
const timerProgress = document.getElementById('timer-progress');

const turkey = document.getElementById('turkey');
const germany = document.getElementById('germany');
const poland = document.getElementById('poland');

const dTurkey = document.getElementById('turkey-dialogue');
const dGermany = document.getElementById('germany-dialogue');
const dPoland = document.getElementById('poland-dialogue');

const theEnd = document.getElementById('the-end');

let blinkInterval = null;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function showSay(element, text, duration) {
    element.textContent = text;
    element.classList.add('show-dialogue');
    setTimeout(() => {
        element.classList.remove('show-dialogue');
    }, duration);
}

function resetAnimation() {
    if (blinkInterval) clearInterval(blinkInterval);
    
    turkey.className = 'countryball turkey';
    germany.className = 'countryball germany';
    poland.className = 'countryball poland';
    
    turkey.style = '';
    germany.style = '';
    poland.style = '';
    
    dTurkey.classList.remove('show-dialogue');
    dGermany.classList.remove('show-dialogue');
    dPoland.classList.remove('show-dialogue');
    
    theEnd.style.opacity = '0';
    theEnd.style.pointerEvents = 'none';
    
    timerProgress.style.transition = 'none';
    timerProgress.style.width = '0%';
}

async function runAnimationSequence() {
    resetAnimation();
    
    setTimeout(() => {
        timerProgress.style.transition = 'width 20s linear';
        timerProgress.style.width = '100%';
    }, 50);

    germany.classList.add('roll-in');
    
    await wait(2000); 
    showSay(dGermany, "Hmm... Çok sıkıcı.", 2000);
    
    blinkInterval = setInterval(() => {
        const balls = [turkey, germany, poland];
        const randomBall = balls[Math.floor(Math.random() * balls.length)];
        randomBall.classList.add('blink');
        setTimeout(() => randomBall.classList.remove('blink'), 150);
    }, 2500);

    await wait(2500); 
    
    turkey.classList.add('roll-in-t');
    
    await wait(1000); 
    
    germany.classList.add('jump');
    showSay(dGermany, "Oha!", 1000);
    setTimeout(() => germany.classList.remove('jump'), 600);
    
    await wait(1000);
    
    turkey.classList.add('jump');
    showSay(dTurkey, "Selamün Aleyküm, Almanya!", 2500);
    setTimeout(() => turkey.classList.remove('jump'), 600);
    
    await wait(3000);
    
    showSay(dGermany, "Guten Tag, Türkiye! Ne haber?", 2500);
    
    await wait(3000);
    
    poland.style.transition = 'bottom 1s cubic-bezier(0.5, 0, 1, 1)';
    poland.style.bottom = '180px'; 
    showSay(dTurkey, "İyidir... O ses ne?", 1500);
    turkey.classList.add('sad-eyes');
    germany.classList.add('sad-eyes');
    
    await wait(1000);
    
    poland.classList.add('shake');
    showSay(dPoland, "Kurwa!", 1500);
    
    turkey.classList.remove('sad-eyes');
    germany.classList.remove('sad-eyes');
    turkey.classList.add('angry-eyes');
    germany.classList.add('angry-eyes');
    
    await wait(1500);
    
    showSay(dGermany, "Polonya! Yine mi gökten düştün?", 2000);
    
    await wait(2000);
    
    turkey.classList.remove('angry-eyes');
    germany.classList.remove('angry-eyes');
    
    turkey.classList.add('happy-eyes');
    germany.classList.add('happy-eyes');
    poland.classList.add('happy-eyes');
    
    showSay(dTurkey, "Hadi parti yapalım!", 2000);
    
    turkey.classList.add('bounce');
    germany.classList.add('bounce');
    poland.classList.add('bounce');
    
    await wait(2800);
    
    clearInterval(blinkInterval);
    theEnd.style.opacity = '1';
    theEnd.style.pointerEvents = 'auto';
}

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    container.style.display = 'block';
    runAnimationSequence();
});

restartBtn.addEventListener('click', () => {
    runAnimationSequence();
});
