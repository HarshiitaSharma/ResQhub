// app.js (Avatar shifted higher)
import Avatar from './Avatar.js';

let cards = [];
let dropSlots = [];
let canvasW = 800, canvasH = 420;
let score = 0, xp = 0;
let correctSequence = [];
let currentScenario;
let originalCardPositions = new Map();

let scenariosData;
let avatar;
let avatarSheet;

window.preload = function() {
  scenariosData = loadJSON('scenarios.json');
  avatarSheet = loadImage('llama.png');
}

window.setup = function() {
  const container = document.getElementById('p5-container');
  canvasW = container.offsetWidth;
  const oldCanvas = container.querySelector('canvas');
  if (oldCanvas) oldCanvas.remove();
  
  const cnv = createCanvas(canvasW, canvasH);
  cnv.parent(container);
  pixelDensity(1);

  const selector = document.getElementById('scenarioSelector');
  selector.innerHTML = '';
  for (const key in scenariosData) {
    const option = document.createElement('option');
    option.value = key;
    option.innerText = scenariosData[key].title;
    selector.appendChild(option);
  }
  
  selector.addEventListener('change', (e) => loadScenario(e.target.value));
  document.getElementById('hintBtn').addEventListener('click', useHint);
  document.getElementById('resetBtn').addEventListener('click', () => loadScenario(selector.value));

  loadScenario(selector.value);
  updateBadges();
}

function loadScenario(scenarioKey) {
  currentScenario = scenariosData[scenarioKey];
  correctSequence = currentScenario.steps.slice();
  document.getElementById('scenarioDescription').innerText = currentScenario.description;
  initGame();
  updateLog(`🔄 ${currentScenario.title}: Order the steps!`, '#0e7490');
}

function initGame() {
  dropSlots = [];
  const slotCount = currentScenario.steps.length;
  const slotWidth = 110;
  const totalWidth = slotCount * slotWidth;
  const startX = (width - totalWidth) / 2;
  
  for (let i = 0; i < slotCount; i++) {
    dropSlots.push({ x: startX + i * slotWidth, y: height / 2 - 40, w: 100, h: 60, card: null });
  }

  const firstSlot = dropSlots[0];
  // MODIFIED: Avatar's initial Y position adjusted higher
  avatar = new Avatar(avatarSheet, firstSlot.x + firstSlot.w / 2, firstSlot.y - 35); 

  const shuffled = shuffleArray([...currentScenario.steps]);
  cards = [];
  originalCardPositions.clear();
  const cardWidth = 120;
  const startCardX = (width - (shuffled.length * cardWidth)) / 2;

  for (let i = 0; i < shuffled.length; i++) {
    const x = startCardX + i * cardWidth + 10;
    const y = height - 90;
    const newCard = new Card(shuffled[i], x, y, 110, 60);
    cards.push(newCard);
    originalCardPositions.set(newCard.id, { x, y });
  }
}

window.draw = function() {
  background('#f1f5f9');
  drawStretcher();

  dropSlots.forEach(s => {
    stroke('#94a3b8');
    fill('#dbeafe');
    rect(s.x, s.y, s.w, s.h, 8);
    if (s.card) {
      s.card.x = s.x + (s.w - s.card.w) / 2;
      s.card.y = s.y + (s.h - s.card.h) / 2;
      s.card.display();
    }
  });

  cards.forEach(c => {
    c.update();
    if (!c.inSlot) c.display();
  });

  if (avatar) {
    avatar.update();
    avatar.display();
  }
}

window.mousePressed = function() {
  for (let i = cards.length - 1; i >= 0; i--) {
    if (cards[i].contains(mouseX, mouseY) && !cards[i].inSlot) {
      cards[i].grabbed = true;
      const c = cards.splice(i, 1)[0];
      cards.push(c);
      break;
    }
  }
}

window.mouseDragged = function() {
  for (let c of cards) {
    if (c.grabbed) {
      c.x = mouseX - c.w / 2;
      c.y = mouseY - c.h / 2;
      c.targetX = c.x; 
      c.targetY = c.y;
    }
  }
}

window.mouseReleased = function() {
  for (let c of cards) {
    if (c.grabbed) {
      c.grabbed = false;
      let placedCorrectly = false;
      
      for (let i = 0; i < dropSlots.length; i++) {
        let s = dropSlots[i];
        if (!s.card && c.collidesWith(s.x, s.y, s.w, s.h)) {
          if (c.label === correctSequence[i]) {
            s.card = c;
            c.inSlot = true;
            placedCorrectly = true;
            
            const nextSlotIndex = i + 1;
            if (nextSlotIndex < dropSlots.length) {
              // MODIFIED: Avatar's Y position adjusted higher when jumping
              avatar.jumpTo(dropSlots[nextSlotIndex].x + dropSlots[nextSlotIndex].w / 2, dropSlots[nextSlotIndex].y - 35);
            } else {
              avatar.setState('idle');
            }
          }
          break;
        }
      }

      if (!placedCorrectly) {
        const originalPos = originalCardPositions.get(c.id);
        if (originalPos) {
          c.targetX = originalPos.x;
          c.targetY = originalPos.y;
        }
        document.getElementById('p5-container').classList.add('shake');
        setTimeout(() => document.getElementById('p5-container').classList.remove('shake'), 400);
        avatar.setState('fail');
        setTimeout(() => avatar.setState('idle'), 500);
      }
      
      checkSequenceComplete();
    }
  }
}

function checkSequenceComplete() {
  if (dropSlots.every(s => s.card !== null)) {
    onSuccess();
  }
}

function onSuccess() {
  score += 15;
  xp = Math.min(100, xp + 20);
  updateLog('✅ LIFE SAVED! +15 points.', '#16a34a');
  document.getElementById('p5-container').classList.add('pulse-success');
  setTimeout(() => document.getElementById('p5-container').classList.remove('pulse-success'), 500);
  updateBadges();
  avatar.setState('success');
  if (window.saveScore) saveScore('anon', { game: 'rescue_puzzle', score, scenario: currentScenario.title });
  
  setTimeout(() => loadScenario(document.getElementById('scenarioSelector').value), 2500);
}

function useHint() {
  const firstUnfilledSlotIndex = dropSlots.findIndex(s => s.card === null);
  if (firstUnfilledSlotIndex === -1) return;

  const correctStep = correctSequence[firstUnfilledSlotIndex];
  for (let c of cards) {
    if (c.label === correctStep && !c.inSlot) {
      c.flash = 60;
      break;
    }
  }
  updateLog('💡 Hint used!', '#d97706');
}

function updateBadges() {
  document.getElementById('scoreBadge').innerText = `Score: ${score}`;
  document.getElementById('xpBar').style.width = `${xp}%`;
}

function updateLog(message, color) {
  const logEl = document.getElementById('log');
  logEl.innerText = message;
  logEl.style.color = color;
}

class Card {
  constructor(label, x, y, w, h) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.label = label;
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.targetX = x; this.targetY = y;
    this.grabbed = false; this.inSlot = false;
    this.flash = 0;
  }

  update() {
    if (!this.grabbed) {
      this.x = lerp(this.x, this.targetX, 0.1);
      this.y = lerp(this.y, this.targetY, 0.1);
    }
  }

  display() {
    push();
    rectMode(CORNER);
    strokeWeight(2);
    stroke('#cbd5e1');
    fill('#f8fafc');
    rect(this.x, this.y, this.w, this.h, 8);
    
    noStroke();
    fill('#334155');
    textSize(10);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);

    if (this.flash > 0) {
      noFill();
      stroke(250, 204, 21, this.flash * 4);
      strokeWeight(4);
      rect(this.x - 2, this.y - 2, this.w + 4, this.h + 4, 10);
      this.flash--;
    }
    pop();
  }

  contains(px, py) { return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h; }
  collidesWith(x2, y2, w2, h2) {
    return !(this.x + this.w < x2 || this.x > x2 + w2 || this.y + this.h < y2 || this.y > y2 + h2);
  }
}

function drawStretcher() {
  push();
  fill(0, 0, 0, 10);
  noStroke();
  rect(width/2 - 280, height/2 - 60, 560, 120, 10);
  fill('#e2e8f0');
  rect(width/2 - 275, height/2 - 55, 550, 110, 10);
  pop();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

window.windowResized = function() {
  const container = document.getElementById('p5-container');
  canvasW = container.offsetWidth;
  resizeCanvas(canvasW, canvasH);
  initGame();
}