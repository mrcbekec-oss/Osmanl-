const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const container = document.getElementById('animation-container');
const timerProgress = document.getElementById('timer-progress');

const tr = document.getElementById('turkey');
const aze = document.getElementById('azerbaijan');
const isr = document.getElementById('israel');
const usa = document.getElementById('america');
const ger = document.getElementById('germany');
const clashEffect = document.getElementById('clash-effect');

const dTr = document.getElementById('turkey-dialogue');
const dAze = document.getElementById('aze-dialogue');
const dIsr = document.getElementById('israel-dialogue');
const dUsa = document.getElementById('america-dialogue');
const dGer = document.getElementById('germany-dialogue');

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
    
    [tr, aze, isr, usa, ger].forEach(ball => {
        ball.className = `countryball ${ball.id === 'america' ? 'america' : ball.id === 'azerbaijan' ? 'azerbaijan' : ball.id === 'turkey' ? 'turkey' : ball.id === 'israel' ? 'israel' : 'germany'}`;
        ball.style = '';
    });
    
    [dTr, dAze, dIsr, dUsa, dGer].forEach(d => d.classList.remove('show-dialogue'));
    clashEffect.classList.remove('show-clash');
    
    theEnd.style.opacity = '0';
    theEnd.style.pointerEvents = 'none';
    timerProgress.style.transition = 'none';
    timerProgress.style.width = '0%';
}

async function runTimeline() {
    resetAnimation();
    
    // Timer 35 seconds
    setTimeout(() => {
        timerProgress.style.transition = 'width 35s linear';
        timerProgress.style.width = '100%';
    }, 50);

    blinkInterval = setInterval(() => {
        const balls = [tr, aze, isr, usa, ger];
        const randomBall = balls[Math.floor(Math.random() * balls.length)];
        randomBall.classList.add('blink');
        setTimeout(() => randomBall.classList.remove('blink'), 150);
    }, 1500);

    // 0s: start
    isr.classList.add('roll-in-right');
    setTimeout(() => usa.classList.add('roll-in-right'), 500);
    
    await wait(3000); // 3.0s
    showSay(dIsr, "Buradaki her şey bizim!", 2000);
    isr.classList.add('angry-eyes');
    usa.classList.add('angry-eyes');
    
    await wait(2500); // 5.5s
    tr.classList.add('roll-in-left');
    setTimeout(() => aze.classList.add('roll-in-left'), 500);

    await wait(2500); // 8.0s
    tr.classList.add('angry-eyes');
    aze.classList.add('angry-eyes');
    showSay(dTr, "Haddinizi bilin!", 2000);
    tr.classList.add('jump');
    setTimeout(() => tr.classList.remove('jump'), 600);

    await wait(2500); // 10.5s
    showSay(dUsa, "We have air support!", 2000);
    usa.classList.add('jump');
    setTimeout(() => usa.classList.remove('jump'), 600);
    
    await wait(2500); // 13.0s
    showSay(dAze, "Qardaş, mən buradayam!", 2000);
    aze.classList.add('jump');
    setTimeout(() => aze.classList.remove('jump'), 600);

    await wait(2500); // 15.5s
    isr.classList.add('shake');
    showSay(dIsr, "Sistemler devrede!", 2000);

    await wait(2500); // 18.0s
    // Germany drops in from sky
    ger.style.transition = 'bottom 1s cubic-bezier(0.5, 0, 1, 1)';
    ger.style.bottom = '180px';
    
    await wait(1000); // 19.0s
    ger.classList.add('angry-eyes');
    showSay(dGer, "HALT! Ne yapıyorsunuz?", 2500);
    
    // They all look at germany
    [tr, aze, isr, usa].forEach(b => b.classList.remove('angry-eyes'));

    await wait(3000); // 22.0s
    [tr, aze, isr, usa].forEach(b => b.classList.add('angry-eyes'));
    showSay(dUsa, "Stay out of this, Germany!", 2000);
    
    await wait(2500); // 24.5s
    showSay(dTr, "Bu işe karışma Almanya!", 2000);
    tr.classList.add('jump');

    await wait(2500); // 27.0s
    ger.classList.add('sad-eyes');
    ger.classList.remove('angry-eyes');
    showSay(dGer, "Ach scheiße...", 2000);

    await wait(2500); // 29.5s
    showSay(dTr, "Saldır qardaşım!", 2000);
    showSay(dUsa, "Attack!", 2000);

    await wait(2000); // 31.5s
    tr.classList.add('clash-right');
    aze.classList.add('clash-right');
    isr.classList.add('clash-left');
    usa.classList.add('clash-left');
    
    await wait(300); // 31.8s
    clashEffect.classList.add('show-clash');
    
    // Germany squished
    ger.className = 'countryball germany squish dead-eyes';
    
    await wait(1000); // 32.8s
    clashEffect.classList.remove('show-clash');
    
    tr.classList.remove('clash-right');
    aze.classList.remove('clash-right');
    isr.classList.remove('clash-left');
    usa.classList.remove('clash-left');

    tr.classList.add('retreat-left');
    aze.classList.add('retreat-left');
    isr.classList.add('retreat');
    usa.classList.add('retreat');
    
    await wait(2200); // 35.0s
    clearInterval(blinkInterval);
    theEnd.style.opacity = '1';
    theEnd.style.pointerEvents = 'auto';
}

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    container.style.display = 'block';
    runTimeline();
});

restartBtn.addEventListener('click', () => {
    runTimeline();
});
