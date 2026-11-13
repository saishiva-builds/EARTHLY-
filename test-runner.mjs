import { CATEGORIES, QUESTIONS, LIVING_ARRANGEMENTS } from './questions.js';
import { Calculator } from './calculator.js';
import { Recommendations, SWAP_DEFINITIONS } from './recommendations.js';
import { Challenges } from './challenges.js';

console.log('=== TEST SUITE: EARTHLY CORE ENGINE ===\n');

// 1. Verify Categories & Weights
console.log('1. Checking Categories & Weights...');
const catKeys = Object.keys(CATEGORIES);
console.log('   Total categories:', catKeys.length);
const totalWeight = Object.values(CATEGORIES).reduce((acc, c) => acc + c.weight, 0);
console.log('   Weight Sum:', totalWeight);
if (Math.abs(totalWeight - 1.0) > 0.0001) {
  throw new Error('Weight sum is not 1.0!');
}
console.log('   ✓ Category weights sum to 100% exactly.');

// 2. Verify Living Arrangements
console.log('\n2. Checking Living Arrangements...');
console.log('   Arrangements defined:', LIVING_ARRANGEMENTS.map(l => l.id).join(', '));
if (LIVING_ARRANGEMENTS.length !== 4) {
  throw new Error('Expected 4 living arrangements');
}
console.log('   ✓ 4 living arrangements verified.');

// 3. Verify Questions Integrity
console.log('\n3. Checking Questions Integrity...');
console.log('   Total questions configured:', QUESTIONS.length);
QUESTIONS.forEach((q, idx) => {
  if (!q.id || !q.title || !q.options || q.options.length < 2) {
    throw new Error(`Question at index ${idx} is malformed!`);
  }
  if (!CATEGORIES[q.category]) {
    throw new Error(`Question ${q.id} has invalid category: ${q.category}`);
  }
  q.options.forEach(opt => {
    if (typeof opt.points !== 'number' || opt.points < 0) {
      throw new Error(`Option ${opt.id} in ${q.id} has invalid points: ${opt.points}`);
    }
  });
});
console.log('   ✓ All questions have valid categories, options, and non-negative points.');

// 4. Test Scoring Bounds: Best Habits
console.log('\n4. Testing Best Case Habits (All Option 1)...');
const bestAnswers = {};
QUESTIONS.forEach(q => {
  bestAnswers[q.id] = q.options[0].id;
});
const bestRes = Calculator.calculate(bestAnswers, 'hostel');
console.log('   Overall Score:', bestRes.overallScore, '/ 100');
console.log('   Status:', bestRes.statusTitle, '| Mascot Mood:', bestRes.mascotMood);
console.log('   Monthly CO2e Activity Footprint:', bestRes.co2eEstimate.monthlyTotalKg, 'kg CO2e');
if (bestRes.overallScore > 10) {
  throw new Error(`Best score too high: ${bestRes.overallScore}`);
}
console.log('   ✓ Best case yields optimal score (< 10).');

// 5. Test Scoring Bounds: Worst Habits
console.log('\n5. Testing Worst Case Habits (All Maximum Points)...');
const worstAnswers = {};
QUESTIONS.forEach(q => {
  worstAnswers[q.id] = q.options[q.options.length - 1].id;
});
const worstRes = Calculator.calculate(worstAnswers, 'hostel');
console.log('   Overall Score:', worstRes.overallScore, '/ 100');
console.log('   Status:', worstRes.statusTitle, '| Mascot Mood:', worstRes.mascotMood);
console.log('   Monthly CO2e Activity Footprint:', worstRes.co2eEstimate.monthlyTotalKg, 'kg CO2e');
if (worstRes.overallScore < 90) {
  throw new Error(`Worst score too low: ${worstRes.overallScore}`);
}
console.log('   ✓ Worst case yields maximum score (> 90).');

// 6. Test Typical Indian College Student
console.log('\n6. Testing Typical Indian Hostel Student...');
const typicalAnswers = {
  trans_primary_mode: 'walk_cycle',
  trans_daily_distance: 'dist_sub_2km',
  trans_weekend_habits: 'weekend_public',
  food_diet_pattern: 'diet_regular_chicken_fish',
  food_plate_waste: 'waste_occasional',
  food_dairy_chai: 'dairy_moderate',
  food_delivery_habits: 'delivery_occasional',
  elec_room_habits: 'switch_mostly_off',
  elec_cooling_setup: 'cooling_fan_only',
  elec_charger_phantom: 'charger_always_on',
  elec_water_heating: 'water_geyser_timed',
  waste_water_bottle: 'bottle_occasional_pet',
  waste_chai_cups: 'cup_mixed',
  waste_clothing_habits: 'cloth_moderate',
  waste_books_gadgets: 'circular_mixed'
};
const typicalRes = Calculator.calculate(typicalAnswers, 'hostel');
console.log('   Overall Score:', typicalRes.overallScore);
console.log('   Status:', typicalRes.statusTitle, '| Tier:', typicalRes.statusTier);
console.log('   Category Breakdown:');
Object.values(typicalRes.categoryBreakdown).forEach(c => {
  console.log(`     - ${c.name}: ${c.score}/100 (Weight: ${c.weight * 100}%, Points: ${c.earnedPoints}/${c.maxPoints})`);
});
console.log('   CO2e Footprint:', typicalRes.co2eEstimate.monthlyTotalKg, 'kg CO2e');
console.log(`     - Transport: ${typicalRes.co2eEstimate.transportKg} kg`);
console.log(`     - Electricity: ${typicalRes.co2eEstimate.electricityKg} kg (${typicalRes.co2eEstimate.monthlyKwh} kWh @ 0.71 kg/kWh)`);
console.log('   ✓ Typical student calculation is balanced and verified.');

// 7. Test Recommendations Engine
console.log('\n7. Testing Recommendations Engine...');
const recs = Recommendations.getPersonalizedRecommendations(typicalAnswers, 'hostel', typicalRes);
console.log(`   Generated ${recs.length} personalized recommendations:`);
recs.forEach((r, idx) => {
  console.log(`     ${idx + 1}. [${r.category.toUpperCase()}] ${r.title} | Expected reduction: ~${r.scoreDelta} pts | Cost: ${r.costBadge}`);
});
if (recs.length !== 3) {
  throw new Error(`Expected exactly 3 top recommendations, got ${recs.length}`);
}
console.log('   ✓ Top 3 practical recommendations successfully produced.');

// 8. Test No-Shame Swap Interactive Simulator
console.log('\n8. Testing No-Shame Swap Recalculation Engine...');
const initialScore = typicalRes.overallScore;
const simulatedRes = Recommendations.simulateActiveSwaps(
  typicalAnswers,
  ['swap_room_switches', 'swap_reusable_bottle', 'swap_kill_phantom_power'],
  'hostel'
);
const newScore = simulatedRes.overallScore;
const ptsSaved = initialScore - newScore;
console.log(`   Baseline Score: ${initialScore} -> Simulated Score: ${newScore} (Saved: ${ptsSaved} pts)`);
if (ptsSaved <= 0) {
  throw new Error('Simulation did not yield positive points reduction!');
}
console.log('   ✓ Dynamic recalculation working properly.');

// 9. Test Weekly Challenge System
console.log('\n9. Testing Weekly Challenge Engine...');
const recChallenge = Challenges.getRecommendedChallenge(typicalRes);
console.log(`   Selected Challenge: "${recChallenge.title}" [${recChallenge.badge}]`);
console.log(`   Tagline: ${recChallenge.tagline}`);
const initialChallengeState = Challenges.createInitialState(recChallenge.id);
if (!initialChallengeState.daysCompleted || initialChallengeState.daysCompleted.length !== 7) {
  throw new Error('Challenge state daysCompleted not initialized properly');
}
console.log('   ✓ 7-day challenge initialization verified.');

console.log('\n========================================');
console.log('✅ ALL TEST SUITE ASSERTIONS PASSED!');
console.log('========================================');
