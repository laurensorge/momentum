export const GOALS = [
  { id: "weight_loss", title: "Weight Loss", description: "Achieve a healthier weight.", icon: "/icons/onboarding/weight-loss.svg" },
  { id: "build_muscle", title: "Build Muscle", description: "Gain strength and size.", icon: "/icons/onboarding/build-muscle.svg" },
  { id: "improve_endurance", title: "Improve Endurance", description: "Boost your stamina.", icon: "/icons/onboarding/improve-endurance.svg" },
  { id: "enhance_flexibility", title: "Enhance Flexibility", description: "Increase your mobility.", icon: "/icons/onboarding/enhance-flexibility.svg" },
  { id: "general_fitness", title: "General Fitness", description: "Stay active and fit.", icon: "/icons/onboarding/general-fitness.svg" },
];

export const LEVELS = [
  { id: "beginner", title: "Beginner", description: "New to fitness or getting back into it.", icon: "/icons/onboarding/beginner.svg" },
  { id: "intermediate", title: "Intermediate", description: "Comfortable with regular workouts.", icon: "/icons/onboarding/intermediate.svg" },
  { id: "advanced", title: "Advanced", description: "Experienced and ready for challenges.", icon: "/icons/onboarding/advanced.svg" },
];

export const ACTIVITIES = [
  "Running", "Weightlifting", "HIIT", "Boot Camp", "Walking", "Cycling",
  "Yoga", "Pilates", "Swimming", "Home Workouts", "Dance", "Community Workouts", "Other",
];

export const EQUIPMENT = [
  "Dumbbells", "Resistance Bands", "Kettlebells", "Gym Membership", "Treadmill",
  "Yoga Mat", "Jump Rope", "Foam Roller", "Medicine Ball", "Pull-Up Bar", "Bike",
];

export const FREQUENCIES = [
  { id: "1_2_days", title: "1–2 Days", description: "Perfect for easing into a fitness routine.", days: 2 },
  { id: "3_4_days", title: "3–4 Days", description: "Balanced schedule for steady progress.", days: 4 },
  { id: "5_6_days", title: "5–6 Days", description: "Ideal for advanced training and growth.", days: 5 },
  { id: "every_day", title: "Every Day", description: "Daily movement with recovery built in.", days: 6 },
];

const GOAL_PLANS = {
  weight_loss: {
    title: "Sustainable Weight Loss",
    description: "A balanced mix of strength and conditioning to support steady progress.",
    focus: ["Full Body Strength", "Low-Impact Cardio", "HIIT", "Mobility"],
  },
  build_muscle: {
    title: "Build Strength & Muscle",
    description: "Progressive strength sessions with enough recovery to help you grow.",
    focus: ["Lower Body Strength", "Upper Body Strength", "Glutes & Hamstrings", "Full Body Strength"],
  },
  improve_endurance: {
    title: "Increase Endurance",
    description: "Build stamina for longer, higher-energy activities without skipping strength.",
    focus: ["Strength Training", "HIIT", "Running", "Core & Stability"],
  },
  enhance_flexibility: {
    title: "Move Better & Feel Better",
    description: "Mobility-led training that supports flexibility, posture, and strength.",
    focus: ["Yoga", "Mobility", "Full Body Strength", "Walking"],
  },
  general_fitness: {
    title: "Balanced General Fitness",
    description: "A practical blend of strength, cardio, core work, and recovery.",
    focus: ["Full Body Strength", "Cardio", "Core & Stability", "Mobility"],
  },
};

const ACTIVITY_FOCUS = {
  Running: "Running",
  Weightlifting: "Strength Training",
  HIIT: "HIIT",
  "Boot Camp": "Boot Camp",
  Walking: "Walking",
  Cycling: "Cycling",
  Yoga: "Yoga",
  Pilates: "Pilates",
  Swimming: "Swimming",
  "Home Workouts": "Home Strength",
  Dance: "Dance Cardio",
  "Community Workouts": "Community Workout",
};

export function buildPersonalizedPlan(answers) {
  const goal = GOAL_PLANS[answers.goal] || GOAL_PLANS.general_fitness;
  const frequency = FREQUENCIES.find((item) => item.id === answers.frequency) || FREQUENCIES[1];
  const preferred = answers.activities.map((activity) => ACTIVITY_FOCUS[activity]).filter(Boolean);
  const focusPool = [...new Set([...preferred, ...goal.focus])];
  const weeklySchedule = Array.from({ length: frequency.days }, (_, index) => ({
    day: index + 1,
    focus: focusPool[index % focusPool.length],
    duration_minutes: answers.level === "beginner" ? 35 : answers.level === "advanced" ? 55 : 45,
  }));

  return {
    version: 1,
    title: goal.title,
    description: goal.description,
    days_per_week: frequency.days,
    level: answers.level,
    available_equipment: answers.equipment,
    preferred_activities: answers.activities,
    weekly_schedule: weeklySchedule,
  };
}
