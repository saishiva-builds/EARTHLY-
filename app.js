/**
 * EARTHLY - Main Application Coordinator
 * 
 * Drives the complete user experience:
 * - Living situation selection
 * - Interactive adaptive questionnaire
 * - Calculating screen animation
 * - Results dashboard with live scoring
 * - Interactive No-Shame Swap simulator (real recalculation)
 * - Personalized recommendations engine
 * - 7-Day Weekly Challenge habit tracker with reflections
 * - Dynamic SVG Earth mascot reactions
 * - Methodology modal and offline persistence
 */

import { Storage } from './storage.js';
import { CATEGORIES, LIVING_ARRANGEMENTS, QUESTIONS } from './questions.js';
import { Calculator } from './calculator.js';
import { SWAP_DEFINITIONS, Recommendations } from './recommendations.js';
import { WEEKLY_CHALLENGES, Challenges } from './challenges.js';
import { CURATED_ARTICLES, DID_YOU_KNOW_FACTS } from './articles.js';
import { Mascot } from './mascot.js';

class EarthlyApp {
  constructor() {
    // Application State
    this.livingArrangement = Storage.getLivingArrangement() || 'hostel';
    this.answers = Storage.getAnswers() || {};
    this.results = Storage.getResults();
    this.activeSwaps = new Set(Storage.getActiveSwaps() || []);
    this.challengeState = Storage.getChallengeState();
    this.currentQuestionIndex = 0;
    this.applicableQuestions = [];

    // DOM Elements Cache
    this.dom = {
      views: {
        homepage: document.getElementById('view-homepage'),
        questionnaire: document.getElementById('view-questionnaire'),
        calculating: document.getElementById('view-calculating'),
        results: document.getElementById('view-results')
      },
      nav: {
        brandLogo: document.getElementById('nav-brand-logo'),
        calculatorBtn: document.getElementById('nav-calculator-btn'),
        restartBtn: document.getElementById('nav-restart-btn'),
        methodologyBtn: document.getElementById('nav-methodology-btn')
      },
      hero: {
        livingGrid: document.getElementById('living-arrangement-grid'),
        startBtn: document.getElementById('hero-start-calc-btn'),
        ctaStartBtn: document.getElementById('cta-start-calc-btn'),
        speechBubble: document.getElementById('hero-speech-bubble'),
        mascotMount: document.getElementById('hero-mascot-mount'),
        moodTag: document.getElementById('hero-mascot-mood-tag')
      },
      questionnaire: {
        progressText: document.getElementById('questionnaire-progress-text'),
        categoryPill: document.getElementById('questionnaire-category-pill'),
        progressBar: document.getElementById('questionnaire-progress-bar'),
        title: document.getElementById('question-title-text'),
        subtitle: document.getElementById('question-subtitle-text'),
        optionsContainer: document.getElementById('question-options-container'),
        prevBtn: document.getElementById('question-prev-btn'),
        nextBtn: document.getElementById('question-next-btn'),
        indicator: document.getElementById('question-indicator')
      },
      calculating: {
        mascotMount: document.getElementById('calculating-mascot-mount'),
        stepList: document.getElementById('calc-step-list')
      },
      results: {
        scoreVal: document.getElementById('res-score-value'),
        dialCircle: document.getElementById('score-dial-circle'),
        statusBadge: document.getElementById('res-status-badge'),
        statusTitle: document.getElementById('res-status-title'),
        statusDescription: document.getElementById('res-status-description'),
        livingBadge: document.getElementById('res-living-badge'),
        mascotMount: document.getElementById('results-mascot-mount'),
        categoryCards: document.getElementById('category-breakdown-cards'),
        co2eTotal: document.getElementById('res-co2e-total'),
        co2eTransport: document.getElementById('res-co2e-transport'),
        co2eElectricity: document.getElementById('res-co2e-electricity'),
        co2eKmSub: document.getElementById('res-co2e-km-sub'),
        co2eKwhSub: document.getElementById('res-co2e-kwh-sub'),
        restartBtn: document.getElementById('results-restart-btn'),
        methodologyBtn: document.getElementById('results-methodology-btn'),
        // No-Shame Swap elements
        swapBaselineTag: document.getElementById('swap-baseline-tag'),
        swapSimulatedScore: document.getElementById('swap-simulated-score'),
        swapPointsSavedTag: document.getElementById('swap-points-saved-tag'),
        swapsContainer: document.getElementById('swaps-cards-container'),
        swapResetBtn: document.getElementById('swap-reset-btn'),
        // Recommendations & Challenges
        recsContainer: document.getElementById('recommendations-cards-container'),
        challengeBadge: document.getElementById('challenge-badge'),
        challengeTitle: document.getElementById('challenge-title'),
        challengeTagline: document.getElementById('challenge-tagline'),
        challengeDesc: document.getElementById('challenge-desc'),
        challengeCompletionStatus: document.getElementById('challenge-completion-status'),
        challengeDailyPrompt: document.getElementById('challenge-daily-prompt'),
        challengeDaysGrid: document.getElementById('challenge-days-grid'),
        refImprovement: document.getElementById('ref-improvement'),
        refUnchanged: document.getElementById('ref-unchanged'),
        refDifficulties: document.getElementById('ref-difficulties'),
        refNextGoal: document.getElementById('ref-next-goal'),
        saveReflectionsBtn: document.getElementById('save-reflections-btn'),
        reflectionSaveStatus: document.getElementById('reflection-save-status')
      },
      modal: {
        overlay: document.getElementById('methodology-modal'),
        closeBtn: document.getElementById('modal-close-btn'),
        gotItBtn: document.getElementById('modal-got-it-btn')
      },
      homepage: {
        articlesGrid: document.getElementById('curated-articles-grid'),
        factsGrid: document.getElementById('did-you-know-grid')
      }
    };
  }

  /**
   * Initialize application
   */
  init() {
    this.setupApplicableQuestions();
    this.renderLivingArrangements();
    this.renderArticlesAndFacts();
    this.mountMascots();
    this.attachEventListeners();

    // Check if user has already completed the assessment
    if (this.results && this.results.overallScore !== undefined) {
      this.dom.nav.restartBtn.classList.remove('hidden');
      this.dom.nav.calculatorBtn.textContent = 'View My Dashboard';
    }

    // Handle hash routing
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  /**
   * Filter questions applicable to selected living arrangement
   */
  setupApplicableQuestions() {
    this.applicableQuestions = QUESTIONS.filter(q =>
      !q.livingArrangements || q.livingArrangements.includes(this.livingArrangement)
    );
  }

  /**
   * Mount SVGs for Earth Mascot
   */
  mountMascots() {
    if (this.dom.hero.mascotMount) {
      this.dom.hero.mascotMount.innerHTML = Mascot.renderSVG('welcoming', '170px');
    }
    if (this.dom.calculating.mascotMount) {
      this.dom.calculating.mascotMount.innerHTML = Mascot.renderSVG('thoughtful', '160px');
    }
  }

  /**
   * Render living arrangement radio cards on homepage
   */
  renderLivingArrangements() {
    if (!this.dom.hero.livingGrid) return;
    this.dom.hero.livingGrid.innerHTML = '';

    LIVING_ARRANGEMENTS.forEach(item => {
      const isSelected = item.id === this.livingArrangement;
      const card = document.createElement('div');
      card.className = `living-option ${isSelected ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.tabIndex = 0;
      card.dataset.id = item.id;

      card.innerHTML = `
        <div class="living-option-header">
          <span class="living-option-icon">${item.icon}</span>
          <span class="badge ${isSelected ? 'badge-blue' : 'badge-cream'}">${item.badge}</span>
        </div>
        <div class="living-option-title">${item.name}</div>
        <div class="living-option-desc">${item.description}</div>
      `;

      card.addEventListener('click', () => this.selectLivingArrangement(item.id));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectLivingArrangement(item.id);
        }
      });

      this.dom.hero.livingGrid.appendChild(card);
    });
  }

  /**
   * Select a living arrangement
   */
  selectLivingArrangement(id) {
    this.livingArrangement = id;
    Storage.saveLivingArrangement(id);
    this.setupApplicableQuestions();
    this.renderLivingArrangements();

    // Contextual mascot reaction
    Mascot.updateMood('curious', `Great! Selected ${LIVING_ARRANGEMENTS.find(l => l.id === id)?.name}. Questions will adapt specifically to your setup.`);
  }

  /**
   * Render Curated Educational Articles & Facts on homepage
   */
  renderArticlesAndFacts() {
    // Articles
    if (this.dom.homepage.articlesGrid) {
      this.dom.homepage.articlesGrid.innerHTML = CURATED_ARTICLES.map(art => `
        <article class="article-card">
          <div class="article-meta">
            <span>${art.category}</span>
            <span>${art.readTime}</span>
          </div>
          <h3>${art.title}</h3>
          <div style="font-size: 0.8rem; color: var(--blue-primary); font-weight: 600;">
            Source: ${art.source} • ${art.publishedDate}
          </div>
          <p>${art.summary}</p>
          <div class="article-takeaway">
            💡 <strong>Actionable takeaway:</strong> ${art.takeaway}
          </div>
        </article>
      `).join('');
    }

    // Did You Know facts
    if (this.dom.homepage.factsGrid) {
      this.dom.homepage.factsGrid.innerHTML = DID_YOU_KNOW_FACTS.map(f => `
        <div class="feature-card">
          <div class="feature-icon-wrapper">${f.icon}</div>
          <span class="badge badge-blue" style="width: fit-content;">${f.category}</span>
          <p style="font-weight: 600; color: var(--text-main); font-size: 0.96rem;">${f.fact}</p>
        </div>
      `).join('');
    }
  }

  /**
   * Switch between application views
   * @param {'homepage'|'questionnaire'|'calculating'|'results'} viewName 
   */
  showView(viewName) {
    Object.keys(this.dom.views).forEach(key => {
      if (this.dom.views[key]) {
        if (key === viewName) {
          this.dom.views[key].classList.remove('hidden');
        } else {
          this.dom.views[key].classList.add('hidden');
        }
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update nav state
    if (viewName === 'questionnaire') {
      Mascot.updateMood('curious');
      this.dom.nav.calculatorBtn.textContent = 'Assessment In Progress';
    } else if (viewName === 'results') {
      this.dom.nav.restartBtn.classList.remove('hidden');
      this.dom.nav.calculatorBtn.textContent = 'My Dashboard';
    } else if (viewName === 'homepage') {
      Mascot.updateMood('welcoming');
      this.dom.nav.calculatorBtn.textContent = this.results ? 'View My Dashboard' : 'Start Assessment';
    }
  }

  /**
   * Handle hash routing
   */
  handleRoute() {
    const hash = window.location.hash;
    if (hash === '#calculator' || hash === '#questionnaire') {
      this.startQuestionnaire();
    } else if (hash === '#results') {
      if (this.results) {
        this.renderResultsDashboard();
        this.showView('results');
      } else {
        this.startQuestionnaire();
      }
    } else if (hash === '#methodology') {
      this.openMethodologyModal();
    } else {
      this.showView('homepage');
    }
  }

  /**
   * Start or resume the questionnaire
   */
  startQuestionnaire() {
    this.setupApplicableQuestions();
    
    // Find first unanswered question or resume
    let firstUnanswered = this.applicableQuestions.findIndex(q => !this.answers[q.id]);
    this.currentQuestionIndex = firstUnanswered !== -1 ? firstUnanswered : 0;

    this.showView('questionnaire');
    this.renderCurrentQuestion();
  }

  /**
   * Render current question in questionnaire view
   */
  renderCurrentQuestion() {
    const q = this.applicableQuestions[this.currentQuestionIndex];
    if (!q) return;

    const total = this.applicableQuestions.length;
    const progressPct = Math.round(((this.currentQuestionIndex + 1) / total) * 100);

    // Meta & Progress
    this.dom.questionnaire.progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${total}`;
    this.dom.questionnaire.indicator.textContent = `${this.currentQuestionIndex + 1} / ${total}`;
    this.dom.questionnaire.progressBar.style.width = `${progressPct}%`;
    this.dom.questionnaire.progressBar.parentElement.setAttribute('aria-valuenow', progressPct);

    // Category Pill
    const cat = CATEGORIES[q.category];
    this.dom.questionnaire.categoryPill.textContent = `${cat?.icon || ''} ${cat?.name || q.category}`;

    // Title & Subtitle
    this.dom.questionnaire.title.textContent = q.title;
    this.dom.questionnaire.subtitle.textContent = q.subtitle;

    // Render Options
    this.dom.questionnaire.optionsContainer.innerHTML = '';
    const currentSelectedId = this.answers[q.id];

    q.options.forEach(opt => {
      const isSelected = opt.id === currentSelectedId;
      const card = document.createElement('div');
      card.className = `option-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.tabIndex = 0;
      card.dataset.optionId = opt.id;

      card.innerHTML = `
        <div class="option-radio" aria-hidden="true">
          <div class="option-radio-dot"></div>
        </div>
        <div class="option-text-wrapper">
          <span class="option-label">${opt.label}</span>
          <span class="option-desc">${opt.description}</span>
        </div>
      `;

      card.addEventListener('click', () => this.selectOption(q.id, opt.id));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectOption(q.id, opt.id);
        }
      });

      this.dom.questionnaire.optionsContainer.appendChild(card);
    });

    // Navigation Buttons State
    this.dom.questionnaire.prevBtn.disabled = this.currentQuestionIndex === 0;

    const isLast = this.currentQuestionIndex === total - 1;
    this.dom.questionnaire.nextBtn.textContent = isLast ? 'Calculate My Impact Score →' : 'Next Question →';
  }

  /**
   * Select an answer option
   */
  selectOption(questionId, optionId) {
    this.answers[questionId] = optionId;
    Storage.saveAnswers(this.answers);

    // Update UI selection
    const cards = this.dom.questionnaire.optionsContainer.querySelectorAll('.option-card');
    cards.forEach(card => {
      const isSelected = card.dataset.optionId === optionId;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Advance automatically after gentle delay for seamless UX if desired
    // (We also provide the explicit Next button)
  }

  /**
   * Handle Next Button click in questionnaire
   */
  handleNextQuestion() {
    const q = this.applicableQuestions[this.currentQuestionIndex];
    if (!this.answers[q.id]) {
      // Gentle validation alert without harsh modal
      alert('Please select an option that best reflects your regular routine to proceed.');
      return;
    }

    if (this.currentQuestionIndex < this.applicableQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Questionnaire complete -> Launch calculation screen
      this.runCalculationFlow();
    }
  }

  /**
   * Handle Previous Button click in questionnaire
   */
  handlePrevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  /**
   * Run the calculating animation and compute real results
   */
  runCalculationFlow() {
    this.showView('calculating');
    Mascot.updateMood('thoughtful', "Crunching your campus lifestyle data and running Indian baseline calculations...");

    const steps = [
      document.getElementById('step-1'),
      document.getElementById('step-2'),
      document.getElementById('step-3'),
      document.getElementById('step-4')
    ];

    // Reset steps
    steps.forEach(s => {
      if (s) {
        s.classList.remove('done');
        const icon = s.querySelector('.step-icon');
        if (icon) icon.textContent = '○';
      }
    });

    // Step-by-step sequential animation
    const completeStep = (index, callback) => {
      setTimeout(() => {
        if (steps[index]) {
          steps[index].classList.add('done');
          const icon = steps[index].querySelector('.step-icon');
          if (icon) icon.textContent = '✓';
        }
        if (callback) callback();
      }, 450);
    };

    completeStep(0, () => {
      completeStep(1, () => {
        completeStep(2, () => {
          completeStep(3, () => {
            // Calculation Complete
            setTimeout(() => {
              this.results = Calculator.calculate(this.answers, this.livingArrangement);
              Storage.saveResults(this.results);
              this.renderResultsDashboard();
              window.location.hash = '#results';
              this.showView('results');
            }, 500);
          });
        });
      });
    });
  }

  /**
   * Render the complete Results Dashboard
   */
  renderResultsDashboard() {
    if (!this.results) return;

    const res = this.results;

    // 1. Overall Score & Dial
    this.dom.results.scoreVal.textContent = res.overallScore;
    this.dom.results.statusBadge.textContent = res.statusTitle;
    this.dom.results.statusTitle.textContent = res.statusTitle;
    this.dom.results.statusDescription.textContent = res.statusDescription;

    const livingInfo = LIVING_ARRANGEMENTS.find(l => l.id === res.livingArrangement);
    this.dom.results.livingBadge.textContent = `Profile: ${livingInfo?.name || 'College Student'}`;

    // Animate Circular Dial (stroke-dasharray = 264, offset varies from 264 to 0)
    // 0 score = best (full green/blue), 100 score = heavy
    const maxOffset = 264;
    const offset = Math.round(maxOffset - (res.overallScore / 100) * maxOffset);
    this.dom.results.dialCircle.style.strokeDashoffset = offset;
    
    // Choose dial stroke color based on tier
    if (res.overallScore <= 30) {
      this.dom.results.dialCircle.style.stroke = 'var(--green-muted)';
    } else if (res.overallScore <= 60) {
      this.dom.results.dialCircle.style.stroke = 'var(--blue-primary)';
    } else {
      this.dom.results.dialCircle.style.stroke = 'var(--coral-accent)';
    }

    // Mount Results Mascot
    if (this.dom.results.mascotMount) {
      this.dom.results.mascotMount.innerHTML = Mascot.renderSVG(res.mascotMood, '80px');
    }

    // 2. Render Category Breakdown Cards
    this.renderCategoryBreakdown(res.categoryBreakdown);

    // 3. Render CO2e Activity Footprint
    const co2 = res.co2eEstimate;
    this.dom.results.co2eTotal.textContent = co2.monthlyTotalKg;
    this.dom.results.co2eTransport.textContent = `${co2.transportKg} kg CO₂e`;
    this.dom.results.co2eElectricity.textContent = `${co2.electricityKg} kg CO₂e`;
    this.dom.results.co2eKmSub.textContent = `~${co2.monthlyKm} km monthly travel`;
    this.dom.results.co2eKwhSub.textContent = `~${co2.monthlyKwh} kWh monthly power`;

    // 4. Render No-Shame Swap Section
    this.renderNoShameSwaps();

    // 5. Render Top 3 Personalized Recommendations
    this.renderRecommendations();

    // 6. Render Weekly Challenge Tracker
    this.renderWeeklyChallenge();
  }

  /**
   * Render Category Breakdown Cards
   */
  renderCategoryBreakdown(breakdown) {
    if (!this.dom.results.categoryCards) return;
    this.dom.results.categoryCards.innerHTML = '';

    Object.keys(breakdown).forEach(catKey => {
      const item = breakdown[catKey];
      const card = document.createElement('div');
      card.className = 'category-stat-card';

      card.innerHTML = `
        <div class="cat-card-header">
          <div class="cat-card-title">
            <span>${item.icon}</span>
            <span>${item.name}</span>
          </div>
          <span class="cat-card-score">${item.score}<span style="font-size: 0.8rem; font-weight: normal; color: var(--text-subtle);">/100</span></span>
        </div>
        <div class="cat-progress-track">
          <div class="cat-progress-fill" style="width: ${item.score}%; background-color: ${item.color};"></div>
        </div>
        <div class="cat-meta-text">
          <span>Points: ${item.earnedPoints} / ${item.maxPoints}</span>
          <span>Weight: ${Math.round(item.weight * 100)}%</span>
        </div>
      `;

      this.dom.results.categoryCards.appendChild(card);
    });
  }

  /**
   * Render No-Shame Swap Interactive Simulator
   */
  renderNoShameSwaps() {
    if (!this.dom.results.swapsContainer) return;

    const availableSwaps = Recommendations.getAvailableSwaps(this.answers, this.livingArrangement, this.results);
    this.dom.results.swapsContainer.innerHTML = '';

    // Update diff bar
    this.updateSwapSimulationState();

    availableSwaps.forEach(swap => {
      const isApplied = this.activeSwaps.has(swap.id);
      const card = document.createElement('div');
      card.className = `swap-card ${isApplied ? 'applied' : ''}`;
      card.dataset.swapId = swap.id;

      card.innerHTML = `
        <div class="swap-card-top">
          <div class="swap-title">${swap.title}</div>
          <span class="swap-reduction-pill">${isApplied ? '✓ Applied' : `Save ~${swap.potentialReduction} pts`}</span>
        </div>

        <div class="swap-comparison">
          <div class="swap-from">
            <strong>Current:</strong> ${swap.existingHabitText}
          </div>
          <div class="swap-to">
            <strong>Alternative:</strong> ${swap.suggestedAlternative}
          </div>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">
          ${swap.whyItMatters}
        </div>

        <div class="swap-action-row">
          <span class="swap-cost-tag">💰 ${swap.costBadge}</span>
          <button class="btn ${isApplied ? 'btn-secondary' : 'btn-primary'} btn-sm toggle-swap-btn">
            ${isApplied ? 'Undo Swap' : 'Apply Swap'}
          </button>
        </div>
      `;

      const btn = card.querySelector('.toggle-swap-btn');
      btn.addEventListener('click', () => this.toggleSwap(swap.id));

      this.dom.results.swapsContainer.appendChild(card);
    });
  }

  /**
   * Toggle a habit swap in the simulator
   */
  toggleSwap(swapId) {
    if (this.activeSwaps.has(swapId)) {
      this.activeSwaps.delete(swapId);
    } else {
      this.activeSwaps.add(swapId);
    }

    Storage.saveActiveSwaps(Array.from(this.activeSwaps));
    this.renderNoShameSwaps();

    // If swap was applied, animate mascot happy!
    if (this.activeSwaps.size > 0) {
      Mascot.updateMood('happy', "Look at that! That realistic swap lowered your impact score! Small habits add up.");
    } else {
      Mascot.updateMood(this.results.mascotMood);
    }
  }

  /**
   * Reset all simulated habit swaps
   */
  resetSwaps() {
    this.activeSwaps.clear();
    Storage.saveActiveSwaps([]);
    this.renderNoShameSwaps();
    Mascot.updateMood(this.results.mascotMood);
  }

  /**
   * Recalculate score live with active swaps and update UI
   */
  updateSwapSimulationState() {
    const baseline = this.results.overallScore;

    if (this.activeSwaps.size === 0) {
      this.dom.results.swapBaselineTag.textContent = `(Baseline: ${baseline})`;
      this.dom.results.swapSimulatedScore.textContent = `${baseline}`;
      this.dom.results.swapPointsSavedTag.textContent = '0 Points Saved';
      this.dom.results.swapPointsSavedTag.style.backgroundColor = 'var(--bg-cream)';
      this.dom.results.swapPointsSavedTag.style.color = 'var(--text-muted)';
      return;
    }

    // Run real simulation through Calculator
    const simulatedResult = Recommendations.simulateActiveSwaps(
      this.answers,
      Array.from(this.activeSwaps),
      this.livingArrangement
    );

    const newScore = simulatedResult.overallScore;
    const saved = baseline - newScore;

    this.dom.results.swapBaselineTag.textContent = `(Baseline: ${baseline})`;
    this.dom.results.swapSimulatedScore.textContent = `${newScore}`;
    this.dom.results.swapPointsSavedTag.textContent = `-${saved} Points Saved!`;
    this.dom.results.swapPointsSavedTag.style.backgroundColor = '#E8F5E9';
    this.dom.results.swapPointsSavedTag.style.color = 'var(--green-accent)';

    // Update category bars live
    this.renderCategoryBreakdown(simulatedResult.categoryBreakdown);
  }

  /**
   * Render Top 3 Personalized Recommendations
   */
  renderRecommendations() {
    if (!this.dom.results.recsContainer) return;

    const recs = Recommendations.getPersonalizedRecommendations(
      this.answers,
      this.livingArrangement,
      this.results
    );

    if (recs.length === 0) {
      this.dom.results.recsContainer.innerHTML = `
        <div style="grid-column: 1/-1; background-color: var(--bg-card); padding: 24px; border-radius: var(--radius-md); text-align: center;">
          <p>🎉 Excellent habits! Your lifestyle is already very sustainable across all categories. Keep up the wonderful stewardship!</p>
        </div>
      `;
      return;
    }

    this.dom.results.recsContainer.innerHTML = recs.map(r => `
      <div class="rec-card">
        <div class="rec-badge-row">
          <span class="badge badge-blue">Saves ~${r.scoreDelta} pts</span>
          <span class="badge badge-green">${r.costBadge}</span>
        </div>
        <h4>${r.title}</h4>
        
        <div class="rec-detail-block">
          <strong>Existing Habit</strong>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${r.existingHabitText}</p>
        </div>

        <div class="rec-detail-block">
          <strong>Suggested Alternative</strong>
          <p style="font-size: 0.85rem; color: var(--text-main); font-weight: 500;">${r.suggestedAlternative}</p>
        </div>

        <div class="rec-detail-block">
          <strong>Realistic Student Action</strong>
          <p style="font-size: 0.85rem; color: var(--blue-primary);">${r.realisticAction}</p>
        </div>

        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border-light); font-size: 0.8rem; color: var(--text-subtle);">
          💰 Estimated Cost: <strong>${r.cost}</strong>
        </div>
      </div>
    `).join('');
  }

  /**
   * Render Weekly Challenge Section & Habit Tracker
   */
  renderWeeklyChallenge() {
    const recommendedChallenge = Challenges.getRecommendedChallenge(this.results);
    
    // Initialize state if needed
    if (!this.challengeState || this.challengeState.challengeId !== recommendedChallenge.id) {
      this.challengeState = Challenges.createInitialState(recommendedChallenge.id);
      Storage.saveChallengeState(this.challengeState);
    }

    // Populate challenge details
    this.dom.results.challengeBadge.textContent = recommendedChallenge.badge;
    this.dom.results.challengeTitle.textContent = recommendedChallenge.title;
    this.dom.results.challengeTagline.textContent = recommendedChallenge.tagline;
    this.dom.results.challengeDesc.textContent = recommendedChallenge.description;
    this.dom.results.challengeDailyPrompt.textContent = `Daily Action: ${recommendedChallenge.dailyActionPrompt}`;

    // Render 7-day tracker boxes
    this.renderDaysTracker();

    // Populate reflections if already filled
    const ref = this.challengeState.reflections || {};
    this.dom.results.refImprovement.value = ref.improvement || '';
    this.dom.results.refUnchanged.value = ref.unchanged || '';
    this.dom.results.refDifficulties.value = ref.difficulties || '';
    this.dom.results.refNextGoal.value = ref.nextGoal || '';
  }

  /**
   * Render 7-Day boxes for the weekly challenge
   */
  renderDaysTracker() {
    if (!this.dom.results.challengeDaysGrid) return;
    this.dom.results.challengeDaysGrid.innerHTML = '';

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const completedDays = this.challengeState.daysCompleted || [false, false, false, false, false, false, false];
    const completedCount = completedDays.filter(Boolean).length;

    this.dom.results.challengeCompletionStatus.textContent = `${completedCount} / 7 Days Active`;

    days.forEach((dayName, idx) => {
      const isDone = completedDays[idx];
      const dayBox = document.createElement('div');
      dayBox.className = `day-box ${isDone ? 'completed' : ''}`;
      dayBox.dataset.dayIndex = idx;
      dayBox.tabIndex = 0;
      dayBox.setAttribute('role', 'checkbox');
      dayBox.setAttribute('aria-checked', isDone ? 'true' : 'false');

      dayBox.innerHTML = `
        <span class="day-label">${dayName}</span>
        <div class="day-check-circle">${isDone ? '✓' : ''}</div>
      `;

      dayBox.addEventListener('click', () => this.toggleChallengeDay(idx));
      dayBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleChallengeDay(idx);
        }
      });

      this.dom.results.challengeDaysGrid.appendChild(dayBox);
    });
  }

  /**
   * Toggle a day in the weekly challenge
   */
  toggleChallengeDay(dayIndex) {
    if (!this.challengeState.daysCompleted) {
      this.challengeState.daysCompleted = [false, false, false, false, false, false, false];
    }

    this.challengeState.daysCompleted[dayIndex] = !this.challengeState.daysCompleted[dayIndex];
    Storage.saveChallengeState(this.challengeState);
    this.renderDaysTracker();

    const completedCount = this.challengeState.daysCompleted.filter(Boolean).length;
    if (completedCount === 7) {
      Mascot.updateMood('happy', "Incredible achievement! You completed all 7 days of the challenge! That's how lasting sustainable habits are formed.");
    } else {
      Mascot.updateMood('encouraging', `Keep up the momentum! ${completedCount} day(s) checked off this week.`);
    }
  }

  /**
   * Save Weekly Reflection Form
   */
  saveReflections() {
    this.challengeState.reflections = {
      improvement: this.dom.results.refImprovement.value.trim(),
      unchanged: this.dom.results.refUnchanged.value.trim(),
      difficulties: this.dom.results.refDifficulties.value.trim(),
      nextGoal: this.dom.results.refNextGoal.value.trim()
    };

    Storage.saveChallengeState(this.challengeState);

    this.dom.results.reflectionSaveStatus.textContent = '✓ Saved successfully!';
    setTimeout(() => {
      this.dom.results.reflectionSaveStatus.textContent = '';
    }, 3000);
  }

  /**
   * Complete Restart Assessment without page reload
   */
  restartAssessment() {
    if (confirm('Are you sure you want to restart your assessment? Your current answers and score simulation will be reset.')) {
      Storage.clearAssessment();
      this.answers = {};
      this.results = null;
      this.activeSwaps.clear();
      this.currentQuestionIndex = 0;

      this.dom.nav.restartBtn.classList.add('hidden');
      this.dom.nav.calculatorBtn.textContent = 'Start Assessment';

      // Reset dial
      if (this.dom.results.dialCircle) {
        this.dom.results.dialCircle.style.strokeDashoffset = '264';
      }

      window.location.hash = '#calculator';
      this.startQuestionnaire();
    }
  }

  /**
   * Open Methodology Modal
   */
  openMethodologyModal() {
    if (this.dom.modal.overlay) {
      this.dom.modal.overlay.classList.add('open');
    }
  }

  /**
   * Close Methodology Modal
   */
  closeMethodologyModal() {
    if (this.dom.modal.overlay) {
      this.dom.modal.overlay.classList.remove('open');
    }
  }

  /**
   * Attach all DOM event listeners
   */
  attachEventListeners() {
    // Navigation controls
    this.dom.nav.brandLogo?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#home';
      this.showView('homepage');
    });

    this.dom.nav.calculatorBtn?.addEventListener('click', () => {
      if (this.results) {
        window.location.hash = '#results';
        this.renderResultsDashboard();
        this.showView('results');
      } else {
        window.location.hash = '#calculator';
        this.startQuestionnaire();
      }
    });

    this.dom.nav.restartBtn?.addEventListener('click', () => this.restartAssessment());
    this.dom.results.restartBtn?.addEventListener('click', () => this.restartAssessment());

    this.dom.hero.startBtn?.addEventListener('click', () => {
      window.location.hash = '#calculator';
      this.startQuestionnaire();
    });

    this.dom.hero.ctaStartBtn?.addEventListener('click', () => {
      window.location.hash = '#calculator';
      this.startQuestionnaire();
    });

    // Questionnaire controls
    this.dom.questionnaire.nextBtn?.addEventListener('click', () => this.handleNextQuestion());
    this.dom.questionnaire.prevBtn?.addEventListener('click', () => this.handlePrevQuestion());

    // Methodology modal controls
    this.dom.nav.methodologyBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openMethodologyModal();
    });

    this.dom.results.methodologyBtn?.addEventListener('click', () => this.openMethodologyModal());
    this.dom.modal.closeBtn?.addEventListener('click', () => this.closeMethodologyModal());
    this.dom.modal.gotItBtn?.addEventListener('click', () => this.closeMethodologyModal());

    this.dom.modal.overlay?.addEventListener('click', (e) => {
      if (e.target === this.dom.modal.overlay) {
        this.closeMethodologyModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMethodologyModal();
      }
    });

    // Swaps reset
    this.dom.results.swapResetBtn?.addEventListener('click', () => this.resetSwaps());

    // Reflections save
    this.dom.results.saveReflectionsBtn?.addEventListener('click', () => this.saveReflections());
  }
}

// Instantiate and initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new EarthlyApp();
  app.init();
});
