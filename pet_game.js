// pet_game.js

// --- CONFIGURATION ---
const correctSequence = ['Clean', 'Disinfect', 'Bandage'];
let currentStep = 0;
let items = [];
let gameWon = false;

// A single cat object to hold its position
let cat = { x: 0, y: 0 };

// --- p5.js LIFECYCLE FUNCTIONS ---

window.preload = function() {
  // No image to load!
}

window.setup = function() {
  const container = document.getElementById('p5-container');
  const canvas = createCanvas(container.offsetWidth, 450);
  canvas.parent(container);
  
  initializeGame();

  document.getElementById('resetBtn').addEventListener('click', initializeGame);
}

window.draw = function() {
  background('#f0fdf4');

  // Draw the cat using code
  drawCat();

  // Draw the scrape on the cat, or the bandage if healed
  if (!gameWon) {
    drawScrape();
  } else {
    drawBandageOnCat();
  }
  
  // Draw the draggable first aid items
  items.forEach(item => {
    item.update();
    item.display();
  });

  if (gameWon) {
    drawWinMessage();
  }
}

window.mousePressed = function() {
  if (gameWon) return;
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].contains(mouseX, mouseY)) {
      items[i].startDrag();
      const item = items.splice(i, 1)[0];
      items.push(item);
      break;
    }
  }
}

window.mouseDragged = function() {
  items.forEach(item => {
    if (item.isDragging) {
      item.x = mouseX;
      item.y = mouseY;
    }
  });
}

window.mouseReleased = function() {
  items.forEach(item => {
    if (item.isDragging) {
      item.stopDrag();
      checkDrop(item);
    }
  });
}

// --- GAME LOGIC FUNCTIONS ---

function initializeGame() {
  gameWon = false;
  currentStep = 0;
  updateLog('Drag the first item to the scrape.');
  
  // Position the cat in the middle top area
  cat.x = width / 2;
  cat.y = 150;

  // Define the first aid items at the bottom
  const itemY = height - 60;
  items = [
    new DraggableItem('Clean', width * 0.2, itemY),
    new DraggableItem('Disinfect', width * 0.4, itemY),
    new DraggableItem('Bandage', width * 0.6, itemY),
    new DraggableItem('Treat', width * 0.8, itemY)
  ];
}

function checkDrop(item) {
  // Define the "scrape zone" on the cat's leg
  const scrapeZone = { x: cat.x + 20, y: cat.y + 70, w: 40, h: 40 };

  if (item.x > scrapeZone.x - scrapeZone.w/2 && item.x < scrapeZone.x + scrapeZone.w/2 &&
      item.y > scrapeZone.y - scrapeZone.h/2 && item.y < scrapeZone.y + scrapeZone.h/2) {
    
    if (item.id === correctSequence[currentStep]) {
      currentStep++;
      item.isUsed = true;
      if (currentStep === correctSequence.length) {
        gameWon = true;
        updateLog('You did it! Patches is all better!', '💖');
        document.getElementById('p5-container').classList.add('pulse-success');
      } else {
        updateLog(`Great! Now for the next step.`, '✅');
      }
    } else {
      item.returnToStart();
      updateLog('That\'s not the right item!', '❌');
      document.getElementById('p5-container').classList.add('shake');
    }
  } else {
    item.returnToStart();
  }

  setTimeout(() => {
    document.getElementById('p5-container').classList.remove('shake', 'pulse-success');
  }, 500);
}

// --- DRAWING FUNCTIONS ---

function drawCat() {
    push();
    translate(cat.x, cat.y);
    noStroke();

    // Body
    fill(50); // Dark gray
    ellipse(0, 50, 80, 90);

    // Head
    ellipse(0, 0, 70, 65);

    // Ears
    triangle(-25, -45, -35, -20, -10, -25);
    triangle(25, -45, 35, -20, 10, -25);

    // Eyes
    fill(255); // White
    ellipse(-15, -5, 15, 20);
    ellipse(15, -5, 15, 20);
    fill(0); // Black pupils
    ellipse(-15, -5, 5, 8);
    ellipse(15, -5, 5, 8);

    // Nose
    fill(255, 105, 180); // Pink
    triangle(0, 10, -5, 5, 5, 5);
    pop();
}

function drawScrape() {
  push();
  noStroke();
  fill(220, 40, 40, 150);
  // Position the scrape on the cat's body
  ellipse(cat.x + 20, cat.y + 75, 20, 15);
  pop();
}

function drawBandageOnCat() {
    push();
    fill(240, 210, 180);
    stroke(139, 69, 19);
    strokeWeight(1);
    rectMode(CENTER);
    // Position the bandage over the scrape area
    rect(cat.x + 20, cat.y + 75, 30, 15, 5);
    fill(255, 255, 255, 150);
    rect(cat.x + 20, cat.y + 75, 12, 12, 2);
    pop();
}


function drawWinMessage() {
  push();
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(236, 72, 153);
  stroke(255);
  strokeWeight(4);
  text('Yay! All Better!', width / 2, 40);
  pop();
}

function updateLog(message, icon = '🩹') {
  document.getElementById('log').innerHTML = `${icon} ${message}`;
}

// --- DraggableItem CLASS ---
// (This class remains unchanged from the previous version)

class DraggableItem {
  constructor(id, x, y) {
    this.id = id;
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 40;
    this.isDragging = false;
    this.isUsed = false;
  }

  update() {
    if (!this.isDragging) {
      this.x = lerp(this.x, this.startX, 0.1);
      this.y = lerp(this.y, this.startY, 0.1);
    }
  }

  display() {
    if (this.isUsed) return;

    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(10);
    strokeWeight(2);
    
    drawingContext.shadowOffsetX = 3;
    drawingContext.shadowOffsetY = 3;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.2)';

    switch (this.id) {
      case 'Clean':
        fill(173, 216, 230);
        stroke(0, 0, 139);
        rect(this.x, this.y, this.w, this.h, 5);
        fill(0); noStroke();
        text("Soap & \nWater", this.x, this.y);
        break;
      case 'Disinfect':
        fill(255, 255, 255);
        stroke(255, 0, 0);
        rect(this.x, this.y, this.w, this.h, 5);
        fill(0); noStroke();
        text("Antiseptic\nWipe", this.x, this.y);
        break;
      case 'Bandage':
        fill(240, 210, 180);
        stroke(139, 69, 19);
        rect(this.x, this.y, this.w, this.h, 5);
        fill(0); noStroke();
        text("Bandage", this.x, this.y);
        break;
      case 'Treat':
        fill(255, 105, 180);
        stroke(139, 0, 0);
        ellipse(this.x, this.y, this.w / 1.5, this.h);
        fill(0); noStroke();
        text("Treat", this.x, this.y);
        break;
    }
    pop();
  }

  contains(px, py) {
    return px > this.x - this.w / 2 && px < this.x + this.w / 2 &&
           py > this.y - this.h / 2 && py < this.y + this.h / 2;
  }

  startDrag() { this.isDragging = true; }
  stopDrag() { this.isDragging = false; }
  returnToStart() { /* The update() function handles this automatically */ }
}