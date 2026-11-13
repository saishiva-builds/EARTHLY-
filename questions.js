/**
 * EARTHLY - Environmental Impact Questionnaire Configuration
 * Tailored for Indian college students across various living setups:
 * - College Hostel
 * - PG / Rented Accommodation
 * - Living with Family
 * - Day Scholar Commuters
 * 
 * Category Weights:
 * - Transportation: 30%
 * - Food: 30%
 * - Electricity: 20%
 * - Shopping & Waste: 20%
 * 
 * Lower points = better environmental habits (0 is optimal).
 */

export const CATEGORIES = {
  transportation: {
    id: 'transportation',
    name: 'Transportation',
    weight: 0.30,
    icon: '🚲',
    color: '#397D91',
    description: 'Daily campus commute, transit modes, and weekend travel choices.'
  },
  food: {
    id: 'food',
    name: 'Food & Dining',
    weight: 0.30,
    icon: '🥗',
    color: '#547D69',
    description: 'Dietary patterns, mess/canteen plate waste, and delivery packaging.'
  },
  electricity: {
    id: 'electricity',
    name: 'Electricity & Energy',
    weight: 0.20,
    icon: '💡',
    color: '#E09F3E',
    description: 'Room fans, study lights, device charging, and water heating.'
  },
  shopping_waste: {
    id: 'shopping_waste',
    name: 'Shopping & Waste',
    weight: 0.20,
    icon: '♻️',
    color: '#7BB7D4',
    description: 'Single-use bottles & cups, clothing habits, and item reuse.'
  }
};

export const LIVING_ARRANGEMENTS = [
  {
    id: 'hostel',
    name: 'College Hostel',
    badge: 'On / Near Campus',
    description: 'Shared hostel room with mess meals, ceiling fans, and close campus proximity.',
    icon: '🏢'
  },
  {
    id: 'pg',
    name: 'PG / Rented Accommodation',
    badge: 'Independent Living',
    description: 'Living in a paying guest setup or shared flat with roommates and shared utility controls.',
    icon: '🏠'
  },
  {
    id: 'family',
    name: 'Living with Family',
    badge: 'Home Resident',
    description: 'Living at home with parents/family; home-cooked meals and standard household appliances.',
    icon: '🏡'
  },
  {
    id: 'day_scholar',
    name: 'Day Scholar Commuter',
    badge: 'Daily Commute',
    description: 'Traveling daily from outside the city or suburb to campus via bus, metro, train, or two-wheeler.',
    icon: '🚆'
  }
];

export const QUESTIONS = [
  // ==========================================
  // CATEGORY A: TRANSPORTATION (30%)
  // ==========================================
  {
    id: 'trans_primary_mode',
    category: 'transportation',
    title: 'How do you primarily commute to campus and your daily classes?',
    subtitle: 'Think of your most frequent transit mode on weekdays.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'walk_cycle',
        label: 'Walking or bicycling',
        description: 'Zero fuel, clean foot or pedal power around campus.',
        points: 0,
        emissionFactor: 0.0, // kg CO2e / km
        avgSpeedKmH: 5
      },
      {
        id: 'public_transit',
        label: 'College bus, city bus, or metro / local train',
        description: 'Shared public transit with high occupancy efficiency.',
        points: 5,
        emissionFactor: 0.022, // kg CO2e / pass-km (Indian urban avg)
        avgSpeedKmH: 25
      },
      {
        id: 'shared_auto',
        label: 'Shared auto-rickshaw / e-rickshaw or carpool with batchmates',
        description: 'Shared last-mile three-wheeler or carpooling.',
        points: 10,
        emissionFactor: 0.035, // kg CO2e / pass-km
        avgSpeedKmH: 20
      },
      {
        id: 'two_wheeler',
        label: 'Personal petrol two-wheeler (Scooty / Motorcycle)',
        description: 'Independent motorized commute for solo trips.',
        points: 20,
        emissionFactor: 0.043, // kg CO2e / km (ARAI avg 110-150cc)
        avgSpeedKmH: 30
      },
      {
        id: 'solo_car_cab',
        label: 'Solo cab (Uber/Ola), personal car, or private auto',
        description: 'Single-occupant motorized vehicle for daily transit.',
        points: 30,
        emissionFactor: 0.140, // kg CO2e / km
        avgSpeedKmH: 25
      }
    ]
  },
  {
    id: 'trans_daily_distance',
    category: 'transportation',
    title: 'Approximately how far do you travel round-trip per college day?',
    subtitle: 'Include the journey from your room/home to campus and back.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'dist_sub_2km',
        label: 'Under 2 km total (Hostel or campus boundary)',
        description: 'Walking distance or immediate campus premises.',
        points: 0,
        distanceKm: 1.5
      },
      {
        id: 'dist_2_to_8km',
        label: '2 to 8 km round-trip',
        description: 'Short commute from nearby locality or PG.',
        points: 5,
        distanceKm: 5.0
      },
      {
        id: 'dist_8_to_20km',
        label: '8 to 20 km round-trip',
        description: 'Moderate city commute across neighboring sectors.',
        points: 15,
        distanceKm: 14.0
      },
      {
        id: 'dist_over_20km',
        label: 'Over 20 km round-trip (Long-distance commuter)',
        description: 'Cross-city or inter-district daily travel.',
        points: 25,
        distanceKm: 28.0
      }
    ]
  },
  {
    id: 'trans_weekend_habits',
    category: 'transportation',
    title: 'What best describes your weekend and leisure travel habits?',
    subtitle: 'Visiting city spots, cafes, libraries, or returning home on weekends.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'weekend_local',
        label: 'Mostly stay on campus / home, or explore nearby on foot / cycle',
        description: 'Minimal motorized trips over Saturday and Sunday.',
        points: 0
      },
      {
        id: 'weekend_public',
        label: 'Use metro, city buses, or shared autos for outings',
        description: 'Low-impact transit for city visits and friend meetups.',
        points: 5
      },
      {
        id: 'weekend_bike',
        label: 'Take personal bike or scooter for city rides and getaways',
        description: 'Regular two-wheeler leisure trips (20-50 km/weekend).',
        points: 15
      },
      {
        id: 'weekend_cabs',
        label: 'Frequently book solo cabs (Ola/Uber) or drive a car for outings',
        description: 'Multiple app-based cabs or personal car trips each weekend.',
        points: 25
      }
    ]
  },

  // ==========================================
  // CATEGORY B: FOOD & DINING (30%)
  // ==========================================
  {
    id: 'food_diet_pattern',
    category: 'food',
    title: 'Which pattern best represents your regular weekly meals?',
    subtitle: 'Reflects the agricultural resource intensity of routine meals.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'diet_veg_plant',
        label: 'Pure vegetarian / Plant-centric meals',
        description: 'Dal, roti, seasonal vegetables, legumes, rice.',
        points: 0
      },
      {
        id: 'diet_veg_eggs',
        label: 'Vegetarian with occasional eggs (1-3 times weekly)',
        description: 'Boiled eggs, omelettes, alongside plant-based staple meals.',
        points: 6
      },
      {
        id: 'diet_regular_chicken_fish',
        label: 'Occasional chicken or fish meals (1-3 times weekly)',
        description: 'Hostel non-veg night, canteen chicken thali, or home curry.',
        points: 14
      },
      {
        id: 'diet_frequent_nonveg',
        label: 'Frequent chicken or fish meals (4 or more days a week)',
        description: 'Non-veg dishes featured in most daily lunch and dinner meals.',
        points: 22
      }
    ]
  },
  {
    id: 'food_plate_waste',
    category: 'food',
    title: 'How often do you leave uneaten food on your plate in the mess or canteen?',
    subtitle: 'Food waste is one of the biggest hidden sources of methane in landfills.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'waste_zero',
        label: 'Almost never — I take mindful portions and finish everything',
        description: 'Clean plate habit; request less rice/roti if not hungry.',
        points: 0
      },
      {
        id: 'waste_occasional',
        label: 'Occasionally leave a small portion when serving size is too large',
        description: 'Rare leftovers when mess ladle portions exceed appetite.',
        points: 8
      },
      {
        id: 'waste_frequent',
        label: 'Often leave uneaten rice, sabzi, or breads on the mess tray',
        description: 'Regularly discard food due to rushed schedule or unpredictable taste.',
        points: 20
      }
    ]
  },
  {
    id: 'food_dairy_chai',
    category: 'food',
    title: 'What is your typical daily tea (chai), coffee, or dairy consumption?',
    subtitle: 'Dairy production carries substantial water and feed footprint.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'dairy_minimal',
        label: 'Zero dairy or strictly 1 light cup of chai/coffee per day',
        description: 'Black tea/coffee, green tea, or minimal dairy.',
        points: 2
      },
      {
        id: 'dairy_moderate',
        label: '2 to 3 cups of cutting chai/coffee or a bowl of curd/dahi daily',
        description: 'Standard campus routine with tapri chai and daily curd.',
        points: 8
      },
      {
        id: 'dairy_heavy',
        label: 'High dairy: 4+ cups of tea, multiple glasses of milk, lassi, or paneer daily',
        description: 'Heavy milk, paneer, and rich dairy-based daily diet.',
        points: 16
      }
    ]
  },
  {
    id: 'food_delivery_habits',
    category: 'food',
    title: 'How often do you order food via delivery apps (Zomato/Swiggy/Blinkit)?',
    subtitle: 'Considers single-use plastics, foil packaging, and delivery transit.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'delivery_rare',
        label: 'Rarely or never — eat mess meals, home food, or dine-in with reusable plates',
        description: 'Less than once a month or zero delivery packaging.',
        points: 0
      },
      {
        id: 'delivery_occasional',
        label: '1 to 2 times a week (late night study snacks or weekend treats)',
        description: 'Occasional takeaway or delivery with roommates.',
        points: 7
      },
      {
        id: 'delivery_frequent',
        label: '3 to 5+ times a week with multiple plastic containers and cutlery',
        description: 'Regular reliance on delivered food containers and plastic pouches.',
        points: 16
      }
    ]
  },

  // ==========================================
  // CATEGORY C: ELECTRICITY & ENERGY (20%)
  // ==========================================
  {
    id: 'elec_room_habits',
    category: 'electricity',
    title: 'What happens to your room fan and lights when stepping out for class?',
    subtitle: 'Hostel and study rooms often run appliances for hours when empty.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'switch_always_off',
        label: 'Always switch off fan, lights, and switches before closing the door',
        description: 'Habitual check whenever vacating the room.',
        points: 0
      },
      {
        id: 'switch_mostly_off',
        label: 'Usually switch off, but occasionally forget when rushing to 8 AM class',
        description: 'Good awareness with occasional lapses during morning exam rushes.',
        points: 8
      },
      {
        id: 'switch_left_on',
        label: 'Frequently leave fans/tubelights running in shared room or out of habit',
        description: 'Room is often illuminated or fan running when nobody is inside.',
        points: 20
      }
    ]
  },
  {
    id: 'elec_cooling_setup',
    category: 'electricity',
    title: 'What cooling appliances are used in your room during warm months?',
    subtitle: 'Adapted to Indian student living standards.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'cooling_fan_only',
        label: 'Standard ceiling fan only (natural ventilation & windows)',
        description: '75W fan; low energy footprint common in most college hostels.',
        points: 2,
        kwhMonthEst: 20
      },
      {
        id: 'cooling_air_cooler',
        label: 'Air cooler (evaporative desert/room cooler) + ceiling fan',
        description: 'Evaporative cooling: ~150-200W electrical consumption.',
        points: 8,
        kwhMonthEst: 45
      },
      {
        id: 'cooling_ac_eco',
        label: 'Air conditioner (AC) set to eco mode (24°C - 26°C with timer)',
        description: 'Energy-conscious AC use for 3-5 hours during peak heat.',
        points: 15,
        kwhMonthEst: 95
      },
      {
        id: 'cooling_ac_heavy',
        label: 'Air conditioner (AC) run cold (<22°C) for long hours or overnight',
        description: 'Continuous compressor load: high monthly kilowatt-hour draw.',
        points: 25,
        kwhMonthEst: 180
      }
    ]
  },
  {
    id: 'elec_charger_phantom',
    category: 'electricity',
    title: 'How do you handle laptop, smartphone, and power bank chargers?',
    subtitle: 'Vampire/phantom draw occurs when chargers remain switched on without devices.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'charger_unplug',
        label: 'Unplug chargers and turn off the wall/extension switch when full',
        description: 'Zero phantom draw; devices charged efficiently.',
        points: 0
      },
      {
        id: 'charger_wall_off',
        label: 'Keep adapter plugged into wall, but switch the wall socket OFF',
        description: 'Safe mechanical cutoff preventing vampire draw.',
        points: 5
      },
      {
        id: 'charger_always_on',
        label: 'Keep chargers, adapters, and extension boards ON 24/7 at the socket',
        description: 'Continuous standby current flowing day and night.',
        points: 15
      }
    ]
  },
  {
    id: 'elec_water_heating',
    category: 'electricity',
    title: 'What is your water heating routine during winter or chilly mornings?',
    subtitle: 'Electric geysers and immersion rods draw high wattage (1500W - 2000W).',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'water_ambient_bucket',
        label: 'Ambient/cold water, or quick single-bucket bath with minimal heating',
        description: 'Traditional water-conserving bucket bath (~15-20 liters total).',
        points: 0
      },
      {
        id: 'water_geyser_timed',
        label: 'Electric geyser / immersion rod run for 10-15 mins for a bucket bath',
        description: 'Moderate hot water heating with careful timing.',
        points: 7
      },
      {
        id: 'water_long_shower',
        label: 'Long continuous hot water shower (geyser running 25-35+ minutes)',
        description: 'High electrical heating load and 50+ liters of hot water.',
        points: 18
      }
    ]
  },

  // ==========================================
  // CATEGORY D: SHOPPING & WASTE (20%)
  // ==========================================
  {
    id: 'waste_water_bottle',
    category: 'shopping_waste',
    title: 'How do you stay hydrated on campus and in class?',
    subtitle: 'Single-use PET water bottles persist in Indian landfills for 450+ years.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'bottle_reusable',
        label: 'Always carry a reusable bottle; refill from campus RO water filters',
        description: 'Zero single-use plastic bottles purchased.',
        points: 0
      },
      {
        id: 'bottle_occasional_pet',
        label: 'Usually refill, but buy a ₹20 packaged bottle 1-2 times a week',
        description: 'Occasional purchase when caught without a bottle.',
        points: 8
      },
      {
        id: 'bottle_frequent_pet',
        label: 'Frequently buy 1L packaged PET bottles (Bisleri/Kinley/Aquafina)',
        description: 'Regular reliance on disposable plastic bottled water.',
        points: 20
      }
    ]
  },
  {
    id: 'waste_chai_cups',
    category: 'shopping_waste',
    title: 'When having chai or coffee at the campus tapri or canteen, what cup is used?',
    subtitle: 'Wax and polyethylene-lined paper cups cannot be recycled with ordinary paper.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'cup_kulhad_glass_mug',
        label: 'Traditional glass tumbler, terracotta kulhad, or my own travel mug',
        description: 'Washable glass or clay; zero plastic lining waste.',
        points: 0
      },
      {
        id: 'cup_mixed',
        label: 'Sometimes use disposable paper/plastic cups when rushing between lectures',
        description: 'Mixed use depending on tapri crowd and time.',
        points: 8
      },
      {
        id: 'cup_daily_disposable',
        label: 'Daily disposable paper cups, plastic cups, or single-use straws',
        description: '2 to 4 disposable cups thrown into campus dustbins daily.',
        points: 18
      }
    ]
  },
  {
    id: 'waste_clothing_habits',
    category: 'shopping_waste',
    title: 'What best describes your clothing purchases and fast fashion habits?',
    subtitle: 'Textile production is responsible for significant water pollution and energy.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'cloth_mindful',
        label: 'Mindful shopper: Buy only essentials (1-4 items/year), repeat & restyle',
        description: 'Wear clothes until worn out; borrow or swap for college fests.',
        points: 0
      },
      {
        id: 'cloth_moderate',
        label: 'Moderate shopper: Buy a few new items each semester or festive season',
        description: 'Occasional shopping for birthdays, college events, or Diwali.',
        points: 8
      },
      {
        id: 'cloth_frequent_fast',
        label: 'Frequent fast fashion: Monthly orders from Myntra, Ajio, Urbanic, or Zara',
        description: 'Trend-driven impulse buying with unworn clothes in the wardrobe.',
        points: 20
      }
    ]
  },
  {
    id: 'waste_books_gadgets',
    category: 'shopping_waste',
    title: 'How do you handle old notebooks, textbooks, gadgets, and waste segregation?',
    subtitle: 'Circular habits keep materials in active use longer.',
    livingArrangements: ['hostel', 'pg', 'family', 'day_scholar'],
    options: [
      {
        id: 'circular_reuse',
        label: 'Pass textbooks to juniors, use rough pages, and repair devices when possible',
        description: 'Campus circularity; segregate recyclable paper and e-waste.',
        points: 0
      },
      {
        id: 'circular_mixed',
        label: 'Mix dry/wet waste in one dustbin, but save textbooks or sell to kabadiwala',
        description: 'Basic resource recovery without structured segregation.',
        points: 10
      },
      {
        id: 'circular_dispose',
        label: 'Throw everything together; replace phone accessories frequently at first flaw',
        description: 'Direct disposal of cables, chargers, and notebooks with general waste.',
        points: 20
      }
    ]
  }
];
