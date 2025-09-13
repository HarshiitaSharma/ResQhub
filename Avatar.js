// Avatar.js (Corrected for Jump Movement)

export default class Avatar {
  constructor(spriteSheet, x, y) {
    this.x = x;
    this.y = y;
    
    this.spriteSheet = spriteSheet;
    this.frameWidth = 48;
    this.frameHeight = 48;

    this.scale = 1.5; // Makes the avatar 50% larger

    this.currentFrame = 0;
    this.animationSpeed = 0.2;
    this.state = 'idle'; // 'idle', 'success', 'fail'
    
    this.animations = {
      idle: { start: 0, length: 3 },      // Loops through the first 3 frames
      // No 'running' animation needed for instant jumps
      success: { start: 3, length: 3 }, // Uses the last 3 frames for a "happy" animation
      fail: { start: 0, length: 1 }      // Shows a single static frame
    };
  }

  // NEW: A function to instantly move the avatar to a new position
  jumpTo(x, y) {
    this.x = x;
    this.y = y;
    this.setState('idle'); // Return to idle state after jumping
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.currentFrame = 0; // Reset frame count when animation changes
    }
  }

  update() {
    // Only update the animation frame, no movement logic here now
    const anim = this.animations[this.state];
    if (anim) {
      this.currentFrame = (this.currentFrame + this.animationSpeed) % anim.length;
    }
  }

  display() {
    if (!this.spriteSheet) return;
    const anim = this.animations[this.state];
    if (!anim) return;
    
    const frameIndex = anim.start + Math.floor(this.currentFrame);
    
    const scaledWidth = this.frameWidth * this.scale;
    const scaledHeight = this.frameHeight * this.scale;
    
    // Draw the image centered at this.x, this.y
    image(
      this.spriteSheet, 
      this.x - scaledWidth / 2, this.y - scaledHeight / 2, // Adjust to center the image
      scaledWidth, scaledHeight,
      frameIndex * this.frameWidth, 0,
      this.frameWidth, this.frameHeight
    );
  }
}