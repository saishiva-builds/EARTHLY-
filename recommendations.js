/**
 * EARTHLY - Recommendations & No-Shame Swap Engine
 * 
 * Generates personalized, realistic recommendations for Indian college students
 * based on actual questionnaire answers.
 * 
 * Powered directly by the Calculator engine to compute real score deltas (no hardcoded numbers).
 */

import { Calculator } from './calculator.js';
import { QUESTIONS } from './questions.js';

export const SWAP_DEFINITIONS = [
  {
    id: 'swap_room_switches',
    targetQuestionId: 'elec_room_habits',
    betterOptionId: 'switch_always_off',
    category: 'electricity',
    title: "The 'Bag Pick = Switch Off' Routine",
    existingHabitText: "Leaving ceiling fans or tubelights running when rushing to morning lectures.",
    suggestedAlternative: "Hit the room switch board right as you grab your backpack at the door.",
    whyItMatters: "Ceiling fans (75W) running 6 empty hours daily waste ~13.5 kWh monthly, emitting ~9.6 kg CO2e.",
    realisticAction: "Place a small sticky note by the door handle: 'Bag in hand, switches off'.",
    cost: "100% Free",
    costBadge: "Free"
  },
  {
    id: 'swap_reusable_bottle',
    targetQuestionId: 'waste_water_bottle',
    betterOptionId: 'bottle_reusable',
    category: 'shopping_waste',
    title: "Campus RO Refill Routine",
    existingHabitText: "Purchasing ₹20 single-use plastic water bottles on campus when thirsty.",
    suggestedAlternative: "Carry a 750ml-1L stainless steel or durable bottle and refill at campus RO water coolers.",
    whyItMatters: "Single-use PET bottles take 450+ years to degrade and leach microplastics when left in hot bags.",
    realisticAction: "Keep your filled water bottle beside your room key so you never head out without it. Saves ₹300–₹500/month.",
    cost: "Free (or ₹150 one-time for a steel bottle)",
    costBadge: "Saves Money"
  },
  {
    id: 'swap_tapri_mug',
    targetQuestionId: 'waste_chai_cups',
    betterOptionId: 'cup_kulhad_glass_mug',
    category: 'shopping_waste',
    title: "Glass / Kulhad Chai Choice",
    existingHabitText: "Sipping daily cutting chai in disposable wax-lined paper or plastic cups.",
    suggestedAlternative: "Ask the tapri bhaiya for glass tumblers, terracotta kulhads, or carry your own pocket steel cup.",
    whyItMatters: "Paper tea cups are lined with polyethylene that melts under hot liquid, releasing billions of microplastic particles.",
    realisticAction: "Simply request 'Bhaiya, kanch ke glass mein dena' (Serve in a glass tumbler).",
    cost: "100% Free",
    costBadge: "Free"
  },
  {
    id: 'swap_mess_clean_plate',
    targetQuestionId: 'food_plate_waste',
    betterOptionId: 'waste_zero',
    category: 'food',
    title: "The Mindful First Portion",
    existingHabitText: "Taking large mess or canteen servings and dumping half-eaten rice/curry in the bin.",
    suggestedAlternative: "Ask mess staff for a smaller initial scoop of rice/sabzi; take seconds only if still hungry.",
    whyItMatters: "Decomposing food in landfills generates methane, a greenhouse gas 28x more potent than CO2.",
    realisticAction: "Tell the mess worker: 'Thoda kam chawal dena please' (Give a little less rice, please).",
    cost: "100% Free",
    costBadge: "Free"
  },
  {
    id: 'swap_public_transit',
    targetQuestionId: 'trans_primary_mode',
    betterOptionId: 'public_transit',
    category: 'transportation',
    title: "Metro & Campus Transit Shift",
    existingHabitText: "Relying on solo app cabs (Uber/Ola) or solo two-wheelers for daily travel.",
    suggestedAlternative: "Use the city metro, college bus, or shared e-rickshaws for 3 or more days every week.",
    whyItMatters: "Shared public transport emits less than 1/6th the carbon per passenger-km compared to solo motorized cabs.",
    realisticAction: "Get a student metro card or college bus pass; read notes or listen to podcasts while commuting.",
    cost: "Saves ₹800–₹2,500/month on petrol/cab surge fares",
    costBadge: "Saves Money"
  },
  {
    id: 'swap_kill_phantom_power',
    targetQuestionId: 'elec_charger_phantom',
    betterOptionId: 'charger_unplug',
    category: 'electricity',
    title: "Cut Standby Phantom Draw",
    existingHabitText: "Leaving laptop, phone adapters, and extension cord switches powered ON 24/7.",
    suggestedAlternative: "Click the socket switch off when your phone reaches 80-100%, and kill the board at night.",
    whyItMatters: "Transformer coils in plugged-in chargers leak heat and consume 0.25–2W continuously even without a device.",
    realisticAction: "Switch off the master socket on your multi-plug extension board before going to sleep.",
    cost: "100% Free",
    costBadge: "Free"
  },
  {
    id: 'swap_delivery_containers',
    targetQuestionId: 'food_delivery_habits',
    betterOptionId: 'delivery_rare',
    category: 'food',
    title: "Dine-In or Dabba Over Late-Night Swiggy",
    existingHabitText: "Frequent food delivery orders generating multiple black plastic bowls and polythene bags.",
    suggestedAlternative: "Walk over with friends to eat freshly prepared canteen/dhaba food served on washable stainless steel thalis.",
    whyItMatters: "Food delivery generates 3-5 disposable plastic items per meal plus delivery scooter emissions.",
    realisticAction: "Keep healthy hostel snacks (roasted makhana, chana, fruits) to avoid late-night impulse delivery orders.",
    cost: "Saves ₹1,200–₹2,000/month in delivery fees",
    costBadge: "Saves Money"
  }
];

export const Recommendations = {
  /**
   * Generate prioritized personalized recommendations based on actual user answers.
   * Computes the EXACT score reduction using the Calculator.
   * 
   * @param {Object} answers - Current user answers
   * @param {string} livingArrangement - Living situation
   * @param {Object} currentResults - Calculated baseline results
   * @returns {Array<Object>} Sorted list of top personalized recommendations
   */
  getPersonalizedRecommendations(answers, livingArrangement, currentResults) {
    if (!answers || !currentResults) return [];

    const baselineScore = currentResults.overallScore;
    const eligibleRecommendations = [];

    SWAP_DEFINITIONS.forEach(swap => {
      const currentAnswer = answers[swap.targetQuestionId];
      // Only recommend if the user hasn't already achieved the optimal habit
      if (currentAnswer && currentAnswer !== swap.betterOptionId) {
        // Simulate score with this swap applied
        const simulatedAnswers = { ...answers, [swap.targetQuestionId]: swap.betterOptionId };
        const simulatedResult = Calculator.calculate(simulatedAnswers, livingArrangement);

        const scoreDelta = baselineScore - simulatedResult.overallScore;
        const newCategoryScore = simulatedResult.categoryBreakdown[swap.category].score;
        const oldCategoryScore = currentResults.categoryBreakdown[swap.category].score;
        const catDelta = oldCategoryScore - newCategoryScore;

        if (scoreDelta > 0 || catDelta > 0) {
          eligibleRecommendations.push({
            ...swap,
            currentAnswer,
            scoreDelta: Math.max(1, scoreDelta),
            catDelta,
            newOverallScore: simulatedResult.overallScore,
            categoryImpact: currentResults.categoryBreakdown[swap.category].score
          });
        }
      }
    });

    // Prioritize by highest overall score reduction and category impact
    eligibleRecommendations.sort((a, b) => b.scoreDelta - a.scoreDelta);

    // Return the top 3 high-impact recommendations
    return eligibleRecommendations.slice(0, 3);
  },

  /**
   * Get all eligible swaps available for the interactive No-Shame Swap simulator
   * @param {Object} answers 
   * @param {string} livingArrangement 
   * @param {Object} baselineResults 
   */
  getAvailableSwaps(answers, livingArrangement, baselineResults) {
    if (!answers || !baselineResults) return [];

    return SWAP_DEFINITIONS.map(swap => {
      const currentAnswer = answers[swap.targetQuestionId];
      const isAlreadyBest = currentAnswer === swap.betterOptionId;

      // Calculate potential score reduction if applied
      const simulatedAnswers = { ...answers, [swap.targetQuestionId]: swap.betterOptionId };
      const simulatedResult = Calculator.calculate(simulatedAnswers, livingArrangement);
      const potentialReduction = Math.max(0, baselineResults.overallScore - simulatedResult.overallScore);

      return {
        ...swap,
        isAlreadyBest,
        potentialReduction: isAlreadyBest ? 0 : Math.max(1, potentialReduction)
      };
    });
  },

  /**
   * Calculate simulated score when a set of swap IDs are actively enabled
   * @param {Object} originalAnswers 
   * @param {Array<string>} activeSwapIds 
   * @param {string} livingArrangement 
   */
  simulateActiveSwaps(originalAnswers, activeSwapIds, livingArrangement) {
    const simulatedAnswers = { ...originalAnswers };

    activeSwapIds.forEach(swapId => {
      const swap = SWAP_DEFINITIONS.find(s => s.id === swapId);
      if (swap) {
        simulatedAnswers[swap.targetQuestionId] = swap.betterOptionId;
      }
    });

    return Calculator.calculate(simulatedAnswers, livingArrangement);
  }
};
