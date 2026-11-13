/**
 * EARTHLY - Local Storage Manager
 * Handles local persistence of user questionnaire answers, calculated scores,
 * active habit simulations, and weekly challenge progress.
 * 
 * Works completely offline in the browser without any external backend.
 */

const STORAGE_KEYS = {
  ANSWERS: 'earthly_user_answers',
  RESULTS: 'earthly_score_results',
  ACTIVE_SWAPS: 'earthly_simulated_swaps',
  CHALLENGE: 'earthly_weekly_challenge',
  LIVING_ARRANGEMENT: 'earthly_living_arrangement'
};

export const Storage = {
  /**
   * Save questionnaire answers
   * @param {Object} answers - Map of questionId -> selectedOptionId
   */
  saveAnswers(answers) {
    try {
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
    } catch (e) {
      console.warn('Could not save answers to localStorage:', e);
    }
  },

  /**
   * Retrieve saved answers
   * @returns {Object|null}
   */
  getAnswers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Could not read answers from localStorage:', e);
      return null;
    }
  },

  /**
   * Save calculated score results
   * @param {Object} results
   */
  saveResults(results) {
    try {
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
    } catch (e) {
      console.warn('Could not save results to localStorage:', e);
    }
  },

  /**
   * Retrieve saved results
   * @returns {Object|null}
   */
  getResults() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Could not read results from localStorage:', e);
      return null;
    }
  },

  /**
   * Save living arrangement
   * @param {string} arrangement
   */
  saveLivingArrangement(arrangement) {
    try {
      localStorage.setItem(STORAGE_KEYS.LIVING_ARRANGEMENT, arrangement);
    } catch (e) {
      console.warn('Could not save living arrangement:', e);
    }
  },

  /**
   * Retrieve living arrangement
   * @returns {string|null}
   */
  getLivingArrangement() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LIVING_ARRANGEMENT);
    } catch (e) {
      return null;
    }
  },

  /**
   * Save active habit swaps
   * @param {Array<string>} swapIds
   */
  saveActiveSwaps(swapIds) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SWAPS, JSON.stringify(swapIds));
    } catch (e) {
      console.warn('Could not save swaps:', e);
    }
  },

  /**
   * Retrieve active habit swaps
   * @returns {Array<string>}
   */
  getActiveSwaps() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SWAPS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Save weekly challenge progress and reflections
   * @param {Object} challengeData
   */
  saveChallengeState(challengeData) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHALLENGE, JSON.stringify(challengeData));
    } catch (e) {
      console.warn('Could not save challenge state:', e);
    }
  },

  /**
   * Retrieve weekly challenge state
   * @returns {Object|null}
   */
  getChallengeState() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHALLENGE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if user has already completed the assessment
   * @returns {boolean}
   */
  hasCompletedAssessment() {
    const results = this.getResults();
    return !!(results && results.overallScore !== undefined);
  },

  /**
   * Complete restart: resets all answers, results, and active swaps
   * Does not wipe weekly challenge history unless specified.
   */
  clearAssessment() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ANSWERS);
      localStorage.removeItem(STORAGE_KEYS.RESULTS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SWAPS);
      localStorage.removeItem(STORAGE_KEYS.LIVING_ARRANGEMENT);
    } catch (e) {
      console.warn('Could not clear assessment data:', e);
    }
  },

  /**
   * Complete reset of everything including challenge
   */
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ANSWERS);
      localStorage.removeItem(STORAGE_KEYS.RESULTS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SWAPS);
      localStorage.removeItem(STORAGE_KEYS.CHALLENGE);
      localStorage.removeItem(STORAGE_KEYS.LIVING_ARRANGEMENT);
    } catch (e) {
      console.warn('Could not clear all storage:', e);
    }
  }
};
