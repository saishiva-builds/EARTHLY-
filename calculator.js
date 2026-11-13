/**
 * EARTHLY - Scoring and Calculation Engine
 * 
 * 1. Educational Habit Index (0 - 100)
 *    - Lower score = better environmental habits (0 is optimal, 100 is heavy impact).
 *    - Weights:
 *      - Transportation: 30%
 *      - Food: 30%
 *      - Electricity: 20%
 *      - Shopping & Waste: 20%
 *    - Normalized formula:
 *      Category Score = (Points Earned / Maximum Category Points) * 100
 *      Overall Score = (Trans * 0.30) + (Food * 0.30) + (Elec * 0.20) + (Waste * 0.20)
 * 
 * 2. Estimated Activity CO2e Calculations (kg CO2e / month)
 *    - Calculated SEPARATELY from the educational habit score.
 *    - Applied only where credible Indian empirical activity factors exist:
 *      - Transportation (ARAI / PCRA / MoEFCC vehicle emission factors)
 *      - Electricity (Central Electricity Authority CEA CO2 Baseline Database v19: 0.71 kg CO2e/kWh)
 *    - Food & Material lifecycle emissions are explicitly excluded from direct CO2e kg due to lack of localized mass flow data.
 */

import { CATEGORIES, QUESTIONS } from './questions.js';

export const Calculator = {
  /**
   * Calculate full assessment results from user answers
   * @param {Object} answers - Map of { questionId: selectedOptionId }
   * @param {string} livingArrangement - 'hostel' | 'pg' | 'family' | 'day_scholar'
   * @returns {Object} Comprehensive results object
   */
  calculate(answers, livingArrangement = 'hostel') {
    // 1. Filter applicable questions for this living arrangement
    const applicableQuestions = QUESTIONS.filter(q => 
      !q.livingArrangements || q.livingArrangements.includes(livingArrangement)
    );

    // 2. Accumulate points per category
    const categoryStats = {
      transportation: { earned: 0, max: 0 },
      food: { earned: 0, max: 0 },
      electricity: { earned: 0, max: 0 },
      shopping_waste: { earned: 0, max: 0 }
    };

    applicableQuestions.forEach(q => {
      const cat = q.category;
      if (!categoryStats[cat]) return;

      // Find max points possible for this question
      const questionMax = Math.max(...q.options.map(opt => opt.points));
      categoryStats[cat].max += questionMax;

      // Find points earned by user
      const selectedOptionId = answers[q.id];
      const selectedOption = q.options.find(opt => opt.id === selectedOptionId);
      if (selectedOption) {
        categoryStats[cat].earned += selectedOption.points;
      }
    });

    // 3. Compute normalized category scores (0 - 100)
    const categoryBreakdown = {};
    let weightedScoreSum = 0;

    Object.keys(CATEGORIES).forEach(catId => {
      const stats = categoryStats[catId];
      const weight = CATEGORIES[catId].weight;
      const normalizedScore = stats.max > 0 ? Math.round((stats.earned / stats.max) * 100) : 0;

      categoryBreakdown[catId] = {
        id: catId,
        name: CATEGORIES[catId].name,
        icon: CATEGORIES[catId].icon,
        color: CATEGORIES[catId].color,
        weight: weight,
        earnedPoints: stats.earned,
        maxPoints: stats.max,
        score: normalizedScore, // 0 - 100
        contributionToOverall: Math.round(normalizedScore * weight * 10) / 10
      };

      weightedScoreSum += normalizedScore * weight;
    });

    const overallScore = Math.min(100, Math.max(0, Math.round(weightedScoreSum)));

    // 4. Derive Status Tier & Mascot Expression
    const statusInfo = this.getStatusTier(overallScore);

    // 5. Calculate Separate CO2e Estimates (Activity based)
    const co2eEstimate = this.calculateActivityCO2e(answers, livingArrangement);

    return {
      overallScore,
      statusTier: statusInfo.tier,
      statusTitle: statusInfo.title,
      statusDescription: statusInfo.description,
      mascotMood: statusInfo.mascotMood,
      categoryBreakdown,
      co2eEstimate,
      livingArrangement,
      calculatedAt: new Date().toISOString()
    };
  },

  /**
   * Determine status tier, descriptive tone, and mascot reaction based on habit score
   * @param {number} score (0 - 100, lower is better)
   */
  getStatusTier(score) {
    if (score <= 25) {
      return {
        tier: 'champion',
        title: 'Earth Champion',
        description: 'Exceptional, deeply conscious everyday habits. You walk/transit, minimize electricity leakage, and produce remarkably little single-use waste.',
        mascotMood: 'happy'
      };
    } else if (score <= 45) {
      return {
        tier: 'mindful',
        title: 'Mindful Living',
        description: 'Well-balanced environmental footprint. You make sustainable choices in most campus routines with minor room for easy tweaks.',
        mascotMood: 'encouraging'
      };
    } else if (score <= 65) {
      return {
        tier: 'emerging',
        title: 'Moderate Footprint',
        description: 'You have solid foundation habits, but routine conveniences (delivery packaging, cab rides, or idle appliances) offer great opportunities to lighten your load.',
        mascotMood: 'thoughtful'
      };
    } else if (score <= 85) {
      return {
        tier: 'opportunity',
        title: 'High Opportunity',
        description: 'Significant potential to trim waste and electricity. Small, affordable changes in your campus routine can make an immediate difference.',
        mascotMood: 'concerned'
      };
    } else {
      return {
        tier: 'intensive',
        title: 'High Resource Footprint',
        description: 'High daily energy and material usage. Good news: with no-shame swaps, you can easily save pocket money and reduce your impact substantially.',
        mascotMood: 'concerned'
      };
    }
  },

  /**
   * Calculate documented, activity-based CO2e footprint per month.
   * Clearly bounded to Transportation & Room Electricity.
   * @param {Object} answers 
   * @param {string} livingArrangement 
   */
  calculateActivityCO2e(answers, livingArrangement) {
    // Assumptions & Documented Sources:
    // 1. Grid Electricity Emission Factor: 0.710 kg CO2e / kWh
    //    Source: Central Electricity Authority (CEA) CO2 Baseline Database for Indian Power Sector (User Guide v19).
    // 2. Transport Emission Factors (kg CO2e / passenger-km):
    //    - Solo car / cab: 0.140 kg CO2e/km (ARAI / PCRA average Indian petrol passenger car)
    //    - 2-wheeler petrol: 0.043 kg CO2e/km (ARAI average 110-150cc scooter/bike)
    //    - Shared auto: 0.035 kg CO2e/p-km
    //    - Bus / Metro transit: 0.022 kg CO2e/p-km
    //    - Walk / Cycle: 0.000 kg CO2e/km
    // 3. College days per month: 24 days

    const COLLEGE_DAYS_PER_MONTH = 24;
    const GRID_EMISSION_FACTOR = 0.710; // kg CO2e / kWh

    // Transportation Calculation
    const modeQ = QUESTIONS.find(q => q.id === 'trans_primary_mode');
    const distQ = QUESTIONS.find(q => q.id === 'trans_daily_distance');

    const selectedMode = modeQ?.options.find(opt => opt.id === answers['trans_primary_mode']);
    const selectedDist = distQ?.options.find(opt => opt.id === answers['trans_daily_distance']);

    const emissionFactor = selectedMode?.emissionFactor ?? 0.022;
    const dailyDistanceKm = selectedDist?.distanceKm ?? 6.0;

    const monthlyKm = dailyDistanceKm * COLLEGE_DAYS_PER_MONTH;
    const transportMonthlyCO2eKg = Math.round(monthlyKm * emissionFactor * 10) / 10;

    // Electricity Calculation (Estimated Student Monthly kWh)
    let estimatedMonthlyKwh = 0;

    // A. Cooling:
    const coolingQ = QUESTIONS.find(q => q.id === 'elec_cooling_setup');
    const selectedCooling = coolingQ?.options.find(opt => opt.id === answers['elec_cooling_setup']);
    estimatedMonthlyKwh += (selectedCooling?.kwhMonthEst ?? 20);

    // B. Lighting & Fan Room Habits:
    const roomHabits = answers['elec_room_habits'];
    if (roomHabits === 'switch_always_off') {
      estimatedMonthlyKwh += 12; // Normal 75W fan running ~5 hrs/day when occupied
    } else if (roomHabits === 'switch_mostly_off') {
      estimatedMonthlyKwh += 18; // ~7 hrs/day
    } else {
      estimatedMonthlyKwh += 28; // Left running 12+ hrs/day
    }

    // C. Charging & Phantom Draw:
    const chargerHabit = answers['elec_charger_phantom'];
    if (chargerHabit === 'charger_always_on') {
      estimatedMonthlyKwh += 6; // Standby adapters + phantom board draw
    } else {
      estimatedMonthlyKwh += 3; // Basic phone + laptop active charging
    }

    // D. Water Heating (Geyser / Rod):
    const waterHabit = answers['elec_water_heating'];
    if (waterHabit === 'water_long_shower') {
      estimatedMonthlyKwh += 35; // 2kW geyser run 30m daily
    } else if (waterHabit === 'water_geyser_timed') {
      estimatedMonthlyKwh += 15; // 2kW geyser run 12m daily
    } else {
      estimatedMonthlyKwh += 0;  // Ambient / zero heating
    }

    const electricityMonthlyCO2eKg = Math.round(estimatedMonthlyKwh * GRID_EMISSION_FACTOR * 10) / 10;
    const totalActivityCO2eKg = Math.round((transportMonthlyCO2eKg + electricityMonthlyCO2eKg) * 10) / 10;

    return {
      monthlyTotalKg: totalActivityCO2eKg,
      transportKg: transportMonthlyCO2eKg,
      electricityKg: electricityMonthlyCO2eKg,
      monthlyKwh: estimatedMonthlyKwh,
      monthlyKm: monthlyKm,
      isReliable: true,
      scope: 'Transportation & Electricity (Direct activity based)',
      excludedCategories: 'Food and Shopping & Waste (Excluded from direct kg figure due to lack of localized lifecycle mass data; measured instead through the transparent Habit Index)',
      documentedSources: [
        {
          entity: 'Central Electricity Authority (CEA), Govt. of India',
          detail: 'CO2 Baseline Database for the Indian Power Sector, User Guide v19 (Grid factor: 0.710 kg CO2e / kWh)'
        },
        {
          entity: 'Automotive Research Association of India (ARAI) & PCRA',
          detail: 'Indian urban fleet vehicle emission benchmarks (Petrol car: 0.140, 2-wheeler: 0.043, Metro/Bus: 0.022 kg CO2e/p-km)'
        }
      ]
    };
  }
};
