/**
 * EARTHLY - Weekly Environmental Challenge Engine
 * 
 * Provides structured, non-judgmental 7-day micro-challenges tailored to
 * the student's highest-impact category or habit score.
 * 
 * Includes 7-day progress tracking, interactive day toggles, and
 * end-of-week reflection prompts.
 */

export const WEEKLY_CHALLENGES = {
  electricity: {
    id: 'challenge_electricity',
    category: 'electricity',
    badge: 'Energy Conscious',
    title: 'The Zero-Phantom-Power Sprint',
    tagline: '7 days of mindful switches & unplugging before lectures',
    description: 'Room electronics and ceiling fans often run without anyone noticing. For the next 7 days, check your switchboards before walking out the door and turn off your charger sockets when going to bed.',
    weeklyTargetDays: 7,
    dailyActionPrompt: 'Switched off room fan/lights before leaving & unplugged phone charger after full battery.',
    impactTip: 'In Indian hostels and flats, switching off idle fans and charger bricks saves approximately 0.5 to 1 kWh per room daily.',
    nextGoalPreview: 'Up next: Ambient water shower challenge or study lamp efficiency!'
  },
  shopping_waste: {
    id: 'challenge_waste',
    category: 'shopping_waste',
    badge: 'Zero Plastic Trail',
    title: 'The Campus Bottle & Tapri Mug Pledge',
    tagline: '7 days without single-use PET bottles or disposable tea cups',
    description: 'Single-use plastic water bottles and wax-lined tea cups make up over 60% of campus trash bins. For 7 days, carry your reusable bottle and ask for a glass or bring your mug at the chai stall.',
    weeklyTargetDays: 7,
    dailyActionPrompt: 'Refilled my own bottle at the campus RO cooler and declined single-use plastic cups/straws.',
    impactTip: 'Saves at least 14 single-use cups and bottles per student every single week, preventing microplastic exposure.',
    nextGoalPreview: 'Up next: Cloth bag habit for grocery and stationery runs!'
  },
  food: {
    id: 'challenge_food',
    category: 'food',
    badge: 'Clean Plate Champion',
    title: 'The Clean Mess Plate Challenge',
    tagline: '7 days of zero edible leftovers on your dining tray',
    description: 'Mess food portions are often dished out generously by servers, leading to wasted rice and roti. For 7 days, request a smaller first portion and return for seconds only if you are truly hungry.',
    weeklyTargetDays: 7,
    dailyActionPrompt: 'Took a mindful first portion at lunch & dinner and finished every bite on my plate.',
    impactTip: 'Prevents ~350g of organic food waste per day from reaching open landfills where it converts to methane.',
    nextGoalPreview: 'Up next: Swap two takeout meals with nutritious mess meals or fresh fruit!'
  },
  transportation: {
    id: 'challenge_transport',
    category: 'transportation',
    badge: 'Campus Stride',
    title: 'The Campus Stride & Transit Sprint',
    tagline: '7 days of walking, cycling, or shared transit for short hops',
    description: 'Short campus and neighborhood hops under 2 km can easily be walked or cycled instead of hailing auto-rickshaws or booking solo cabs. Build cardiovascular fitness while saving petrol!',
    weeklyTargetDays: 7,
    dailyActionPrompt: 'Walked or cycled for trips under 2 km, or took the metro/bus instead of a solo cab.',
    impactTip: 'Saves direct fuel emissions (approx. 140g CO2e per km compared to solo cabs) and cuts daily transit costs.',
    nextGoalPreview: 'Up next: Batch your weekend city trips with friends using shared metro transit!'
  }
};

export const Challenges = {
  /**
   * Determine the most impactful weekly challenge based on user's highest category score
   * @param {Object} results - Calculated score results
   * @returns {Object} Challenge object
   */
  getRecommendedChallenge(results) {
    if (!results || !results.categoryBreakdown) {
      return WEEKLY_CHALLENGES.shopping_waste;
    }

    // Find category with highest normalized score (greatest opportunity for improvement)
    const breakdown = results.categoryBreakdown;
    let highestCat = 'shopping_waste';
    let highestScore = -1;

    Object.keys(breakdown).forEach(catKey => {
      if (breakdown[catKey].score > highestScore && WEEKLY_CHALLENGES[catKey]) {
        highestScore = breakdown[catKey].score;
        highestCat = catKey;
      }
    });

    return WEEKLY_CHALLENGES[highestCat] || WEEKLY_CHALLENGES.shopping_waste;
  },

  /**
   * Initialize a default challenge state if none exists
   * @param {string} challengeId 
   */
  createInitialState(challengeId) {
    return {
      challengeId,
      startedAt: new Date().toISOString(),
      daysCompleted: [false, false, false, false, false, false, false],
      reflections: {
        improvement: '',
        unchanged: '',
        difficulties: '',
        nextGoal: ''
      },
      isCompleted: false,
      completedAt: null
    };
  }
};
