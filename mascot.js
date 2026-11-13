/**
 * EARTHLY - Dynamic Interactive Earth Mascot
 * 
 * An expressive, sophisticated browser-based vector mascot with real-time dynamic expressions:
 * - welcoming: Warm welcoming smile, gentle waving gesture, open friendly eyes.
 * - curious: One eyebrow raised, head slightly tilted, curious inquiring eyes.
 * - thoughtful: Looking upward, gentle thinking expression, subtle thinking pulse.
 * - happy: Bright beaming smile, glowing rosy cheeks, cheerful bouncing animation.
 * - encouraging: Confident upbeat smile, enthusiastic expression with thumbs-up aura.
 * - concerned: Gentle empathetic curve (never disappointed or shaming, purely caring).
 */

export const MascotExpressions = {
  welcoming: {
    mood: 'welcoming',
    dialogue: "Hey there! I'm Earth. Welcome to EARTHLY. Let's discover how your everyday campus choices shape our shared home.",
    mouthD: "M 65,115 Q 100,140 135,115",
    mouthFill: "none",
    mouthStroke: "#202D38",
    leftEye: { cx: 75, cy: 90, r: 10, pupilY: 90, pupilR: 4.5, browY1: 74, browY2: 74 },
    rightEye: { cx: 125, cy: 90, r: 10, pupilY: 90, pupilR: 4.5, browY1: 74, browY2: 74 },
    blushOpacity: 0.45,
    tag: "Welcome Friend!"
  },
  curious: {
    mood: 'curious',
    dialogue: "I'm curious to learn about your daily campus routine! There are no right or wrong answers here.",
    mouthD: "M 75,120 Q 95,128 120,118",
    mouthFill: "none",
    mouthStroke: "#202D38",
    leftEye: { cx: 75, cy: 88, r: 11, pupilY: 88, pupilR: 5, browY1: 70, browY2: 76 },
    rightEye: { cx: 125, cy: 88, r: 11, pupilY: 88, pupilR: 5, browY1: 65, browY2: 68 }, // raised brow
    blushOpacity: 0.3,
    tag: "Tell me more..."
  },
  thoughtful: {
    mood: 'thoughtful',
    dialogue: "Analyzing your daily campus habits and calculating your educational impact score...",
    mouthD: "M 85,120 Q 100,123 115,120",
    mouthFill: "none",
    mouthStroke: "#202D38",
    leftEye: { cx: 75, cy: 85, r: 9, pupilY: 82, pupilR: 4.5, browY1: 72, browY2: 74 }, // looking up
    rightEye: { cx: 125, cy: 85, r: 9, pupilY: 82, pupilR: 4.5, browY1: 74, browY2: 72 },
    blushOpacity: 0.25,
    tag: "Crunching data..."
  },
  happy: {
    mood: 'happy',
    dialogue: "Wonderful! Look at how that small habit tweak lightens your impact. Every small action adds up!",
    mouthD: "M 65,110 Q 100,150 135,110 Z",
    mouthFill: "#E76F51",
    mouthStroke: "#202D38",
    leftEye: { cx: 75, cy: 88, r: 10, pupilY: 88, pupilR: 4.5, browY1: 70, browY2: 74 },
    rightEye: { cx: 125, cy: 88, r: 10, pupilY: 88, pupilR: 4.5, browY1: 74, browY2: 70 },
    blushOpacity: 0.8,
    tag: "Feeling Fantastic!"
  },
  encouraging: {
    mood: 'encouraging',
    dialogue: "You're making great strides! Small, consistent student habits create massive generational changes.",
    mouthD: "M 70,114 Q 100,138 130,114",
    mouthFill: "none",
    mouthStroke: "#202D38",
    leftEye: { cx: 75, cy: 89, r: 10, pupilY: 89, pupilR: 4.5, browY1: 72, browY2: 74 },
    rightEye: { cx: 125, cy: 89, r: 10, pupilY: 89, pupilR: 4.5, browY1: 74, browY2: 72 },
    blushOpacity: 0.55,
    tag: "Keep it up!"
  },
  concerned: {
    mood: 'concerned',
    dialogue: "I notice a few high-resource areas in your routine. Don't worry at all—we have easy, zero-cost swaps to lighten things up!",
    mouthD: "M 75,126 Q 100,116 125,126", // soft gentle empathetic curve
    mouthFill: "none",
    mouthStroke: "#202D38",
    leftEye: { cx: 75, cy: 90, r: 10, pupilY: 91, pupilR: 4.5, browY1: 77, browY2: 72 },
    rightEye: { cx: 125, cy: 90, r: 10, pupilY: 91, pupilR: 4.5, browY1: 72, browY2: 77 },
    blushOpacity: 0.25,
    tag: "Here to Help"
  }
};

export const Mascot = {
  currentMood: 'welcoming',

  /**
   * Generate SVG markup for Earth Mascot
   * @param {string} mood - 'welcoming' | 'curious' | 'thoughtful' | 'happy' | 'encouraging' | 'concerned'
   * @param {string} size - CSS size e.g. '180px'
   * @returns {string} SVG HTML string
   */
  renderSVG(mood = 'welcoming', size = '160px') {
    const config = MascotExpressions[mood] || MascotExpressions.welcoming;
    this.currentMood = mood;

    return `
      <div class="earth-mascot-container" data-mood="${mood}" style="width: ${size}; height: ${size};" role="img" aria-label="Earth mascot with ${mood} expression">
        <svg viewBox="0 0 200 200" class="earth-mascot-svg ${mood}-anim" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Planet Gradient -->
            <radialGradient id="earthBodyGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#9AD2EA" />
              <stop offset="60%" stop-color="#6FB2D2" />
              <stop offset="100%" stop-color="#468FA6" />
            </radialGradient>

            <!-- Atmosphere Rim Glow -->
            <filter id="atmoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <!-- Soft Shadow -->
            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#202D38" flood-opacity="0.12" />
            </filter>
          </defs>

          <!-- Outer Glow Atmosphere -->
          <circle cx="100" cy="100" r="88" fill="#DCEEF7" opacity="0.4" filter="url(#atmoGlow)" />

          <!-- Main Earth Sphere -->
          <circle cx="100" cy="100" r="82" fill="url(#earthBodyGrad)" filter="url(#shadowFilter)" class="earth-globe" />

          <!-- Continents (Stylized Muted Green Patches) -->
          <g class="earth-continents" fill="#5E8E76" opacity="0.92">
            <!-- Northern continent (Eurasia-like curve) -->
            <path d="M 45,45 C 55,30 85,32 105,42 C 120,48 140,40 155,55 C 150,75 130,85 115,80 C 100,75 75,82 60,70 C 48,60 40,55 45,45 Z" />
            <!-- Southern continent (Africa/India-like peninsula) -->
            <path d="M 90,85 C 105,82 125,92 122,110 C 118,125 105,145 95,155 C 88,145 80,125 82,105 C 84,95 86,90 90,85 Z" />
            <!-- Western continent (Americas curve) -->
            <path d="M 24,75 C 32,70 38,82 35,100 C 32,118 25,130 20,120 C 18,105 20,85 24,75 Z" />
            <!-- Small Islands / Archipelagos -->
            <circle cx="148" cy="115" r="4.5" />
            <circle cx="158" cy="125" r="3" />
            <circle cx="138" cy="142" r="4" />
          </g>

          <!-- Soft Atmosphere Highlight (Upper left light reflection) -->
          <path d="M 35,45 C 50,30 80,24 110,25 C 95,29 65,38 48,55 C 38,65 32,80 30,95 C 27,75 30,55 35,45 Z" fill="#FFFFFF" opacity="0.4" />

          <!-- Rosy Cheeks -->
          <ellipse cx="54" cy="105" rx="9" ry="6" fill="#F4A261" opacity="${config.blushOpacity}" class="earth-cheek" />
          <ellipse cx="146" cy="105" rx="9" ry="6" fill="#F4A261" opacity="${config.blushOpacity}" class="earth-cheek" />

          <!-- Left Eyebrow -->
          <line x1="66" y1="${config.leftEye.browY1}" x2="84" y2="${config.leftEye.browY2}" stroke="#202D38" stroke-width="2.6" stroke-linecap="round" />
          <!-- Right Eyebrow -->
          <line x1="116" y1="${config.rightEye.browY1}" x2="134" y2="${config.rightEye.browY2}" stroke="#202D38" stroke-width="2.6" stroke-linecap="round" />

          <!-- Left Eye Sclera & Pupil -->
          <circle cx="${config.leftEye.cx}" cy="${config.leftEye.cy}" r="${config.leftEye.r}" fill="#FFFFFF" stroke="#202D38" stroke-width="1.8" />
          <circle cx="${config.leftEye.cx}" cy="${config.leftEye.pupilY}" r="${config.leftEye.pupilR}" fill="#202D38" class="earth-pupil" />
          <circle cx="${config.leftEye.cx - 2}" cy="${config.leftEye.pupilY - 2}" r="1.8" fill="#FFFFFF" />

          <!-- Right Eye Sclera & Pupil -->
          <circle cx="${config.rightEye.cx}" cy="${config.rightEye.cy}" r="${config.rightEye.r}" fill="#FFFFFF" stroke="#202D38" stroke-width="1.8" />
          <circle cx="${config.rightEye.cx}" cy="${config.rightEye.pupilY}" r="${config.rightEye.pupilR}" fill="#202D38" class="earth-pupil" />
          <circle cx="${config.rightEye.cx - 2}" cy="${config.rightEye.pupilY - 2}" r="1.8" fill="#FFFFFF" />

          <!-- Nose (Subtle gentle curve) -->
          <path d="M 97,100 Q 100,104 103,100" fill="none" stroke="#397D91" stroke-width="2" stroke-linecap="round" />

          <!-- Expressive Dynamic Mouth -->
          <path d="${config.mouthD}" fill="${config.mouthFill}" stroke="${config.mouthStroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="earth-mouth" />
        </svg>
      </div>
    `;
  },

  /**
   * Update all active mascot instances on the page
   * @param {string} mood 
   * @param {string|null} customDialogue 
   */
  updateMood(mood, customDialogue = null) {
    if (!MascotExpressions[mood]) mood = 'welcoming';
    this.currentMood = mood;
    const config = MascotExpressions[mood];

    // Update SVGs
    const containers = document.querySelectorAll('.earth-mascot-container');
    containers.forEach(container => {
      const size = container.style.width || '160px';
      container.outerHTML = this.renderSVG(mood, size);
    });

    // Update dialogue bubbles if present
    const speechBubbles = document.querySelectorAll('.mascot-speech-bubble');
    speechBubbles.forEach(bubble => {
      const textElem = bubble.querySelector('.bubble-text') || bubble;
      textElem.textContent = customDialogue || config.dialogue;
    });

    // Update mood tags
    const moodTags = document.querySelectorAll('.mascot-mood-tag');
    moodTags.forEach(tag => {
      tag.textContent = config.tag;
    });
  }
};
