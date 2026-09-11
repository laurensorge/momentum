import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import PlanMockup from "./PlanMockup";
import ProgramLoading from "./ProgramLoading";

const DAY_WORKOUT_IMAGES = {
  day1: "/images/main-glutes.png",
  day2: "/images/main-back.png",
  day3: "/images/main-quads.png",
  day4: "/images/main-posture.png",
  day5: "/images/main-burnout.png",
};
const ALT_WORKOUT_IMAGES = {
  "glute-pump": "/images/workout-glute-pump-v2.png",
  "lower-cardio": "/images/workout-lower-cardio-v2.png",
  "core-focus": "/images/workout-core-stability-v2.png",
  "full-body-light": "/images/workout-full-body-light-v2.png",
  "posterior-chain": "/images/workout-posterior-chain-v2.png",
  "stretch-yoga": "/images/workout-stretch-mobility-v2.png",
};
const SAVE_ICON_DEFAULT = "/images/save-default.svg";
const SAVE_ICON_TAPPED = "/images/save-tapped.svg";

const WEEK_LABELS = ["Base", "Build", "Peak", "Deload"];

const WORKOUTS = {
  day1: [
    [
      { name: "Barbell Hip Thrust", sets: "4×10", notes: "Pause 2s at top. Find your working weight." },
      { name: "Romanian Deadlift (BB)", sets: "4×12", notes: "Hinge at hips, feel hamstrings stretch." },
      { name: "Bulgarian Split Squat (DB)", sets: "3×10 ea", notes: "Lean forward slightly for glute bias." },
      { name: "Cable Kickback", sets: "3×12 ea", notes: "Squeeze at top, slow on the way down." },
      { name: "Lying Hamstring Curl", sets: "3×12", notes: "Control the negative." },
      { name: "Hip Abductor Machine", sets: "3×15", notes: "Lean forward for upper glute." },
      { name: "Incline Walk", sets: "15 min", notes: "10-12% grade, 3.0-3.5 mph" },
    ],
    [
      { name: "Barbell Hip Thrust", sets: "4×10", notes: "Add 5 lbs from last week." },
      { name: "Romanian Deadlift (BB)", sets: "4×12", notes: "+5 lbs or add 1 rep per set." },
      { name: "Bulgarian Split Squat (DB)", sets: "3×12 ea", notes: "+2 reps per leg vs week 1." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "+3 reps vs week 1. Same weight." },
      { name: "Lying Hamstring Curl", sets: "3×15", notes: "+3 reps. Control the eccentric." },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "+5 reps. Push through the burn." },
      { name: "Incline Walk", sets: "15 min", notes: "12% grade, 3.5 mph" },
    ],
    [
      { name: "Barbell Hip Thrust", sets: "5×8", notes: "Add a 5th set. Heaviest weight yet." },
      { name: "Romanian Deadlift (BB)", sets: "4×10", notes: "Heavier weight, fewer reps." },
      { name: "Bulgarian Split Squat (DB)", sets: "4×10 ea", notes: "Add a 4th set this week." },
      { name: "Single-Leg Hip Thrust", sets: "3×10 ea", notes: "New! Bodyweight or light plate." },
      { name: "Lying Hamstring Curl", sets: "4×12", notes: "Extra set, drop set on the last." },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "Heavy. Lean forward hard." },
      { name: "Incline Walk", sets: "15 min", notes: "12-15% grade — push it." },
    ],
    [
      { name: "Barbell Hip Thrust", sets: "3×12", notes: "60% of week 3 weight. Focus on squeeze." },
      { name: "Romanian Deadlift (DB)", sets: "3×12", notes: "Dumbbells, lighter. Perfect your hinge." },
      { name: "Bodyweight Walking Lunge", sets: "3×12 ea", notes: "Long strides, no weight needed." },
      { name: "Banded Glute Bridge", sets: "3×15", notes: "Band above knees. Mind-muscle." },
      { name: "Lying Hamstring Curl", sets: "2×15", notes: "Light. Blood flow only." },
      { name: "Hip Abductor Machine", sets: "2×15", notes: "Light. Recovery week." },
      { name: "Incline Walk", sets: "20 min", notes: "10% grade, easy pace. Enjoy it." },
    ],
  ],
  day2: [
    [
      { name: "Lat Pulldown (wide)", sets: "3×12", notes: "Squeeze lats, don't yank with arms." },
      { name: "Seated Cable Row", sets: "3×12", notes: "Pull to lower chest, squeeze blades." },
      { name: "Face Pulls", sets: "3×15", notes: "Light weight, high reps, rear delts." },
      { name: "Single-Arm DB Row", sets: "3×12 ea", notes: "Moderate weight. Feel your back work." },
      { name: "Reverse Pec Deck", sets: "3×15", notes: "Rear delts and upper back." },
      { name: "Plank Hold", sets: "3×30s", notes: "Tight core, don't sag." },
      { name: "Incline Walk", sets: "10 min", notes: "10-12% grade, 3.0-3.5 mph" },
    ],
    [
      { name: "Lat Pulldown (wide)", sets: "3×15", notes: "+3 reps. Same weight as week 1." },
      { name: "Seated Cable Row", sets: "3×15", notes: "+3 reps. Full retraction each rep." },
      { name: "Face Pulls", sets: "3×20", notes: "+5 reps. External rotate at the end." },
      { name: "Single-Arm DB Row", sets: "3×12 ea", notes: "Add 2.5-5 lbs." },
      { name: "Reverse DB Fly", sets: "3×12", notes: "Swap from machine. 8-10 lb DBs." },
      { name: "Dead Bug", sets: "3×10 ea", notes: "Core stability. Press back into floor." },
      { name: "Incline Walk", sets: "10 min", notes: "12% grade, 3.5 mph" },
    ],
    [
      { name: "Lat Pulldown (neutral grip)", sets: "4×12", notes: "Add a set + different grip angle." },
      { name: "Seated Cable Row", sets: "4×12", notes: "Heavier than week 2. 4 sets." },
      { name: "Face Pulls", sets: "4×15", notes: "Extra set. Rear delt focus." },
      { name: "Single-Arm DB Row", sets: "3×15 ea", notes: "Same weight, more reps." },
      { name: "Straight-Arm Pulldown", sets: "3×12", notes: "New! Lat isolation, no bicep." },
      { name: "Plank Hold", sets: "3×45s", notes: "+15s vs week 1. Don't forget to breathe." },
      { name: "Incline Walk", sets: "10 min", notes: "12-15% grade." },
    ],
    [
      { name: "Lat Pulldown (wide)", sets: "2×15", notes: "Light. Feel the stretch." },
      { name: "Seated Cable Row", sets: "2×15", notes: "Light. Focus on form." },
      { name: "Face Pulls", sets: "3×15", notes: "Same as week 1. Just maintain." },
      { name: "DB Pullover", sets: "3×12", notes: "Light DB. Feel lats stretch overhead." },
      { name: "Reverse DB Fly", sets: "2×12", notes: "8 lbs. Easy." },
      { name: "Dead Bug", sets: "3×8 ea", notes: "Slow and controlled." },
      { name: "Incline Walk", sets: "15 min", notes: "Easy pace. Recovery." },
    ],
  ],
  day3: [
    [
      { name: "Barbell Squat", sets: "4×10", notes: "Below parallel. Wide stance = more glute." },
      { name: "Leg Press (high & wide)", sets: "4×12", notes: "Feet high on platform for glute bias." },
      { name: "Walking Lunges (DB)", sets: "3×12 ea", notes: "Long stride, lean slightly forward." },
      { name: "Leg Extension", sets: "3×15", notes: "Quad isolation — light, controlled." },
      { name: "Cable Pull-Through", sets: "3×15", notes: "Glute squeeze at top." },
      { name: "Hip Abductor Machine", sets: "2×20", notes: "Burnout to finish." },
      { name: "Incline Walk", sets: "15 min", notes: "10-12% grade, 3.0-3.5 mph" },
    ],
    [
      { name: "Barbell Squat", sets: "4×12", notes: "+2 reps per set. Same weight." },
      { name: "Leg Press (high & wide)", sets: "4×15", notes: "+3 reps. Push through." },
      { name: "Walking Lunges (DB)", sets: "3×15 ea", notes: "+3 reps per leg." },
      { name: "Leg Extension", sets: "3×15", notes: "Add 5 lbs from week 1." },
      { name: "Cable Pull-Through", sets: "3×15", notes: "Hold squeeze for 2 sec." },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "Add a 3rd set." },
      { name: "Incline Walk", sets: "15 min", notes: "12% grade, 3.5 mph" },
    ],
    [
      { name: "Barbell Squat", sets: "5×8", notes: "5th set! Heavier weight, fewer reps." },
      { name: "Leg Press (high & wide)", sets: "4×15", notes: "Add weight. Push hard." },
      { name: "Reverse Lunge (DB)", sets: "3×12 ea", notes: "Swap from walking. More glute focus." },
      { name: "Goblet Squat (deep)", sets: "3×15", notes: "New! ATG for quad/glute stretch." },
      { name: "Cable Pull-Through", sets: "3×15", notes: "Heaviest cable setting yet." },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "Heavy. Lean forward." },
      { name: "Incline Walk", sets: "15 min", notes: "12-15% grade — push it." },
    ],
    [
      { name: "Goblet Squat", sets: "3×12", notes: "Light DB. Depth over weight." },
      { name: "Leg Press (high & wide)", sets: "3×15", notes: "60% of week 3 weight." },
      { name: "Bodyweight Lunges", sets: "3×10 ea", notes: "No weight. Focus on balance." },
      { name: "Leg Extension", sets: "2×15", notes: "Light. Blood flow." },
      { name: "Banded Glute Bridge", sets: "3×20", notes: "Band above knees." },
      { name: "Hip Abductor Machine", sets: "2×15", notes: "Easy. Recovery." },
      { name: "Incline Walk", sets: "20 min", notes: "Easy pace. Enjoy it." },
    ],
  ],
  day4: [
    [
      { name: "Lat Pulldown (neutral)", sets: "3×12", notes: "Different grip than Tuesday." },
      { name: "DB Lateral Raise (light)", sets: "3×15", notes: "8-10 lbs MAX. Shape only." },
      { name: "Cable Face Pull", sets: "3×15", notes: "Rear delt focus. Elbows high." },
      { name: "Straight-Arm Pulldown", sets: "3×12", notes: "Lat isolation without bicep." },
      { name: "Reverse Pec Deck", sets: "3×15", notes: "Upper back and rear delts." },
      { name: "Dead Bug", sets: "3×10 ea", notes: "Core stability. Slow." },
      { name: "Incline Walk", sets: "10 min", notes: "10-12% grade, 3.0-3.5 mph" },
    ],
    [
      { name: "Lat Pulldown (neutral)", sets: "3×15", notes: "+3 reps. Same weight." },
      { name: "DB Lateral Raise (light)", sets: "3×18", notes: "Same 8-10 lbs. More reps only." },
      { name: "Cable Face Pull", sets: "3×20", notes: "+5 reps. Hold the squeeze." },
      { name: "Straight-Arm Pulldown", sets: "3×15", notes: "+3 reps." },
      { name: "Reverse DB Fly", sets: "3×12", notes: "Swap from machine. 8-10 lb DBs." },
      { name: "Plank Hold", sets: "3×40s", notes: "Core work. Tight and still." },
      { name: "Incline Walk", sets: "10 min", notes: "12% grade, 3.5 mph" },
    ],
    [
      { name: "Lat Pulldown (wide)", sets: "4×12", notes: "Extra set. Wide grip." },
      { name: "DB Lateral Raise (light)", sets: "4×15", notes: "Extra set. Still 8-10 lbs." },
      { name: "Cable Face Pull", sets: "4×15", notes: "4 sets this week." },
      { name: "Single-Arm Cable Row", sets: "3×12 ea", notes: "New! Unilateral back work." },
      { name: "Reverse Pec Deck", sets: "3×15", notes: "Rear delt burnout." },
      { name: "Dead Bug", sets: "3×12 ea", notes: "+2 reps per side vs week 1." },
      { name: "Incline Walk", sets: "10 min", notes: "12-15% grade." },
    ],
    [
      { name: "Lat Pulldown (neutral)", sets: "2×15", notes: "Light. Stretch at top." },
      { name: "DB Lateral Raise (light)", sets: "2×15", notes: "5-8 lbs. Easy." },
      { name: "Cable Face Pull", sets: "3×12", notes: "Light. Maintain form." },
      { name: "DB Pullover", sets: "3×12", notes: "Feel lats stretch overhead." },
      { name: "Reverse DB Fly", sets: "2×12", notes: "Light. Posture work." },
      { name: "Plank Hold", sets: "3×30s", notes: "Easy. Recovery week." },
      { name: "Incline Walk", sets: "15 min", notes: "Easy pace." },
    ],
  ],
  day5: [
    [
      { name: "Hip Thrust (lighter)", sets: "4×15", notes: "Lighter than Monday. Chase the burn." },
      { name: "Sumo Deadlift", sets: "3×12", notes: "Wide stance, squeeze glutes at lockout." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "Superset with abductors ↓" },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "↑ Superset with kickbacks." },
      { name: "Banded Glute Bridge", sets: "3×20", notes: "Band above knees, push knees out." },
      { name: "Back Extension (glute)", sets: "3×15", notes: "Round upper back, glutes drive you up." },
      { name: "Single-Leg RDL (DB)", sets: "3×12 ea", notes: "Balance + glute/hamstring." },
      { name: "Incline Walk", sets: "15 min", notes: "12-15% grade — push it!" },
    ],
    [
      { name: "Hip Thrust (lighter)", sets: "4×20", notes: "+5 reps per set. Same weight." },
      { name: "Sumo Deadlift", sets: "3×15", notes: "+3 reps. Squeeze hard." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "Add 5 lbs. Superset ↓" },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "↑ Superset. Add weight." },
      { name: "Banded Glute Bridge", sets: "3×25", notes: "+5 reps. Thicker band if easy." },
      { name: "Back Extension (glute)", sets: "3×15", notes: "Hold a plate at chest." },
      { name: "Single-Leg RDL (DB)", sets: "3×12 ea", notes: "Add 2.5-5 lbs." },
      { name: "Incline Walk", sets: "15 min", notes: "15% grade." },
    ],
    [
      { name: "Hip Thrust (moderate)", sets: "5×12", notes: "5 sets! More weight than wk1-2." },
      { name: "Sumo Deadlift", sets: "4×10", notes: "Extra set. Heavier." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "Heaviest cable yet. Superset ↓" },
      { name: "Hip Abductor Machine", sets: "3×25", notes: "↑ Superset. Heavy." },
      { name: "Frog Pump", sets: "3×20", notes: "New! Feet together, knees out. Squeeze." },
      { name: "Back Extension (glute)", sets: "4×12", notes: "Heavier plate. Extra set." },
      { name: "Single-Leg RDL (DB)", sets: "3×15 ea", notes: "+3 reps. Same weight." },
      { name: "Incline Walk", sets: "15 min", notes: "15% grade — finish strong!" },
    ],
    [
      { name: "Hip Thrust (bodyweight)", sets: "3×20", notes: "No weight. Squeeze and hold 2s." },
      { name: "Banded Sumo Squat", sets: "3×15", notes: "Band + bodyweight only." },
      { name: "Cable Kickback (light)", sets: "2×12 ea", notes: "Easy. Feel the muscle." },
      { name: "Banded Glute Bridge", sets: "3×20", notes: "Light band." },
      { name: "Back Extension", sets: "2×15", notes: "Bodyweight. Stretch." },
      { name: "Single-Leg RDL", sets: "2×10 ea", notes: "Bodyweight. Balance focus." },
      { name: "Incline Walk", sets: "20 min", notes: "Easy pace. Recovery." },
    ],
  ],
};

const DAY_CONFIG = {
  0: {
    type: null,
    label: "Rest Day",
    emoji: "😴",
    msg: "Full rest. You earned it.",
    guidance: ["Skip structured training", "Keep movement easy and optional", "Prioritize sleep, hydration, and protein"],
  },
  1: { type: "day1", label: "Glutes & Hamstrings", emoji: "🍑", tag: "Heavy" },
  2: { type: "day2", label: "Back & Rear Delts", emoji: "💪", tag: "Upper A" },
  3: { type: "day3", label: "Quads & Glutes", emoji: "🦵", tag: "Moderate-High" },
  4: { type: "day4", label: "Back & Posture", emoji: "🎯", tag: "Upper Back" },
  5: { type: "day5", label: "Glute Burnout", emoji: "🔥", tag: "Volume" },
  6: {
    type: null,
    label: "Active Recovery",
    emoji: "🧘",
    msg: "Walk, stretch, or practice yoga. Keep the effort easy and leave feeling refreshed.",
    guidance: ["20–30 minute easy walk", "8–10 minutes of mobility", "Breathe slowly and avoid fatigue"],
    cta: "Browse mobility workouts",
  },
};

// ─── ALTERNATIVE WORKOUTS (for swap) ─────────────────────────────────────
const ALT_WORKOUTS = [
  {
    id: "glute-pump",
    label: "Glutes",
    title: "Glute Pump",
    desc: "High-rep burnout, no barbell needed",
    exercises: [
      { name: "Banded Glute Bridge", sets: "4×25", notes: "Band above knees. Feel every rep." },
      { name: "Hip Abductor Machine", sets: "4×20", notes: "Slow eccentric. Lean forward." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "Squeeze hard at top." },
      { name: "Frog Pump", sets: "3×20", notes: "Feet together, knees out, hold 1s at top." },
      { name: "Sumo Squat (DB)", sets: "3×15", notes: "Heavy DB, wide stance." },
      { name: "Step-Up (DB)", sets: "3×12 ea", notes: "Drive through heel for glute bias." },
      { name: "Incline Walk", sets: "15 min", notes: "12% grade, steady pace." },
    ],
  },
  {
    id: "lower-cardio",
    label: "Cardio",
    title: "Lower Body Cardio",
    desc: "Fat burn + legs — no heavy lifting",
    exercises: [
      { name: "Incline Walk", sets: "20 min", notes: "12-15% grade, 3.5 mph." },
      { name: "Bodyweight Squat", sets: "3×20", notes: "Fast pace, minimal rest." },
      { name: "Walking Lunge", sets: "3×15 ea", notes: "Long stride, full range." },
      { name: "Jump Rope (or march)", sets: "3×60s", notes: "High knees if no rope." },
      { name: "Glute Bridge Burnout", sets: "1×50", notes: "Bodyweight, as fast as controlled." },
      { name: "Stair Climber", sets: "10 min", notes: "Steady pace, push through heels." },
    ],
  },
  {
    id: "core-focus",
    label: "Core",
    title: "Core & Stability",
    desc: "Abs, posture, and anti-rotation work",
    exercises: [
      { name: "Dead Bug", sets: "3×12 ea", notes: "Press back into floor. Slow." },
      { name: "Pallof Press", sets: "3×12 ea", notes: "Anti-rotation. Stay square." },
      { name: "Plank Hold", sets: "3×45s", notes: "Breathe steadily. Don't sag." },
      { name: "Side Plank", sets: "3×30s ea", notes: "Stack feet or stagger for easier option." },
      { name: "Hollow Hold", sets: "3×20s", notes: "Lower back pressed down, legs low." },
      { name: "Cable Woodchop", sets: "3×12 ea", notes: "Rotate from core, not arms." },
      { name: "Back Extension", sets: "3×15", notes: "Bodyweight. Feel your lower back." },
    ],
  },
  {
    id: "full-body-light",
    label: "Full Body",
    title: "Full Body Light",
    desc: "Active recovery — move without crushing yourself",
    exercises: [
      { name: "Goblet Squat", sets: "3×12", notes: "Light DB. Focus on depth." },
      { name: "DB Romanian Deadlift", sets: "3×12", notes: "Light weight. Hinge pattern." },
      { name: "Seated Cable Row", sets: "3×12", notes: "Moderate. Feel the squeeze." },
      { name: "Banded Glute Bridge", sets: "3×20", notes: "Light band. Mind-muscle." },
      { name: "Face Pulls", sets: "3×15", notes: "Light. Posture and rear delts." },
      { name: "Plank Hold", sets: "3×30s", notes: "Easy effort." },
      { name: "Incline Walk", sets: "20 min", notes: "Easy pace. Let your body breathe." },
    ],
  },
  {
    id: "posterior-chain",
    label: "Glutes",
    title: "Posterior Chain",
    desc: "Back of body — glutes, hamstrings, lats",
    exercises: [
      { name: "Romanian Deadlift (DB)", sets: "4×12", notes: "Feel the hamstring stretch." },
      { name: "Single-Leg RDL", sets: "3×10 ea", notes: "Slow and balanced." },
      { name: "Back Extension (glute)", sets: "3×15", notes: "Round upper back, squeeze glutes up." },
      { name: "Lying Hamstring Curl", sets: "3×12", notes: "Control the negative." },
      { name: "Lat Pulldown", sets: "3×12", notes: "Wide grip, squeeze at bottom." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "Slow. Squeeze at top." },
      { name: "Incline Walk", sets: "15 min", notes: "12% grade." },
    ],
  },
  {
    id: "stretch-yoga",
    label: "Flexibility",
    title: "Stretch & Mobility",
    desc: "Recovery day — open your hips and hamstrings",
    exercises: [
      { name: "Hip Flexor Stretch", sets: "3×45s ea", notes: "Low lunge. Sink deep." },
      { name: "Pigeon Pose", sets: "3×60s ea", notes: "The glute stretch that actually works." },
      { name: "Hamstring Stretch (standing)", sets: "3×45s ea", notes: "Hinge forward, flat back." },
      { name: "Cat-Cow", sets: "3×10", notes: "Slow and controlled. Breathe into it." },
      { name: "90/90 Hip Stretch", sets: "3×45s ea", notes: "External and internal rotation." },
      { name: "Child's Pose", sets: "3×45s", notes: "Arms extended, breathe into hips." },
      { name: "Incline Walk", sets: "15 min", notes: "Easy pace. Blood flow." },
    ],
  },
];

// Expanded exercise guidance shown in the full-screen image view. The short
// coaching cues remain in each workout plan so cards stay easy to scan.
const EXERCISE_LONG_DESCRIPTIONS = {
  "Barbell Hip Thrust": "Set your upper back against the bench with the bar resting across your hips. Drive through your heels, tuck your chin, and lift until your ribs stay stacked over your pelvis. Pause and squeeze your glutes at the top, then lower under control.",
  "Romanian Deadlift (BB)": "Stand tall with the bar close to your thighs and a soft bend in your knees. Push your hips back while keeping your spine neutral and the bar grazing your legs. Stop when your hamstrings are fully loaded, then press the floor away to stand.",
  "Bulgarian Split Squat (DB)": "Place your back foot on a bench and step far enough forward to keep your front heel grounded. Lower straight down with a slight forward torso lean, then drive through the front heel. Keep your knee tracking over your toes throughout.",
  "Cable Kickback": "Face the cable stack and brace your torso before moving the working leg. Sweep your heel back and slightly out without arching your lower back. Hold the glute contraction briefly, then return slowly until the hip is fully loaded.",
  "Lying Hamstring Curl": "Lie face down with your knees aligned to the machine pivot and your hips pressed into the pad. Curl your heels toward your seat without lifting your hips. Lower slowly so the hamstrings control the entire negative.",
  "Hip Abductor Machine": "Sit tall with your back supported and your feet planted. Push your knees apart from the hips while keeping your pelvis still, then pause at your widest comfortable position. Return slowly instead of letting the weight pull you closed.",
  "Incline Walk": "Set a challenging incline that lets you maintain a steady, controlled pace. Keep your chest lifted, hold the rails only for balance, and drive each step through the heel. You should feel your glutes and calves working without needing to run.",
  "Bodyweight Squat": "Stand with feet just outside hip width and brace before each rep. Sit your hips down and back while keeping your whole foot connected to the floor. Reach a comfortable depth, then stand by pushing evenly through both feet.",
  "Walking Lunge": "Take a long step forward and lower until both knees bend comfortably. Keep your front heel heavy and your torso tall, then push through that heel to bring the back leg forward. Alternate sides while keeping your steps smooth and controlled.",
  "Dead Bug": "Lie on your back with your ribs down and your low back gently connected to the floor. Extend the opposite arm and leg without letting your trunk rotate or arch. Return to the start, reset your brace, and switch sides.",
  "Plank Hold": "Set your elbows beneath your shoulders and create one straight line from head to heels. Squeeze your glutes and brace as if preparing for a lift. Breathe slowly while keeping your hips from sagging or hiking.",
};

const exerciseLongDescription = (exercise) => EXERCISE_LONG_DESCRIPTIONS[exercise.name]
  || `${exercise.notes} Focus on a controlled tempo, a stable torso, and a full range of motion that you can repeat with consistent form.`;

const MEALS = {
  0: [
    { type: "Breakfast", title: "Protein Shake + Bacon", desc: "Quick rest-day fuel", recipe: "1 scoop low-carb whey + unsweetened almond milk + ice, blended. Side of 2 strips bacon, cooked crispy." },
    { type: "Lunch", title: "Deli Roll-Ups + Almonds", desc: "Zero-cook, high protein", recipe: "4 oz deli turkey and ham, spread with cream cheese, roll up tight. Handful (~1 oz) of almonds on the side." },
    { type: "Dinner", title: "Slow Cooker Salsa Chicken", desc: "Dump and forget", recipe: "Place 2 lbs chicken breasts in slow cooker. Pour 1 cup salsa over top. Cook 4 hrs on high. Shred with forks. Serve over cauliflower rice with shredded cheese and sour cream." },
  ],
  1: [
    { type: "Breakfast", title: "3-Egg Cheddar Scramble", desc: "Fast and classic", recipe: "3 eggs scrambled in 1 tbsp butter. Stir in 1 oz shredded cheddar. Side of 2 turkey sausage links." },
    { type: "Lunch", title: "Turkey Pickle Roll-Ups", desc: "Crunchy, zero carb", recipe: "4 oz deli turkey spread with 2 tbsp cream cheese. Wrap around pickle spears." },
    { type: "Dinner", title: "Skillet Steak + Broccoli", desc: "Your go-to, upgraded", recipe: "Season 6 oz steak with salt & pepper. Sear in hot cast iron with butter, 3-4 min per side. Rest 5 min. Roast broccoli with olive oil, salt, garlic powder at 400°F for 20 min. Top with parmesan." },
  ],
  2: [
    { type: "Breakfast", title: "Eggs, Bacon & Avocado", desc: "The keto trifecta", recipe: "2 eggs fried in butter (runny yolk). 3 strips bacon. 1/4 avocado sliced with a pinch of salt." },
    { type: "Lunch", title: "Tuna Salad on Spinach", desc: "5-minute protein bomb", recipe: "1 can tuna, drained. Mix with 2 tbsp mayo, diced celery, squeeze of lemon, salt & pepper. Serve on a big bed of baby spinach." },
    { type: "Dinner", title: "Sheet Pan Chicken Thighs", desc: "One pan, minimal cleanup", recipe: "Bone-in, skin-on chicken thighs — season with salt, pepper, garlic powder, paprika. Toss green beans with olive oil on same pan. Bake 400°F for 35 min." },
  ],
  3: [
    { type: "Breakfast", title: "Protein Shake", desc: "Fast pre-gym fuel", recipe: "1 scoop low-carb whey + 1 tbsp almond butter + unsweetened almond milk + ice. Blend until smooth." },
    { type: "Lunch", title: "Leftover Chicken Salad", desc: "Repurpose last night", recipe: "Chop leftover chicken thigh. Toss with mixed greens, cherry tomatoes, cucumber, and ranch dressing." },
    { type: "Dinner", title: "Burgers (No Bun)", desc: "Family favorite, keto-friendly", recipe: "6 oz ground beef (80/20) patties. Season with salt, pepper, garlic. Sear 4 min per side. Top with cheddar, mustard, pickles. Side of sautéed zucchini in butter." },
  ],
  4: [
    { type: "Breakfast", title: "Spinach & Feta Omelet", desc: "5-minute restaurant quality", recipe: "3 eggs whisked. Pour into buttered pan over medium heat. Add handful of spinach and 1 oz crumbled feta. Fold when edges set. Cook 1 more minute." },
    { type: "Lunch", title: "Chipotle Bowl at Home", desc: "Fast, customizable", recipe: "Season ground beef with cumin, chili powder, garlic, salt. Cook in skillet. Serve over shredded lettuce with sour cream, shredded cheese, and salsa." },
    { type: "Dinner", title: "Pan-Seared Salmon", desc: "Omega-3s powerhouse", recipe: "6 oz salmon filet, skin-on. Pat dry, season with salt and pepper. Sear skin-side down in hot buttered pan 4 min. Flip, cook 3 more min. Side of asparagus roasted at 400°F for 12 min." },
  ],
  5: [
    { type: "Breakfast", title: "Eggs + Sausage + Avocado", desc: "Fuel for burnout day", recipe: "2 eggs cooked however you want. 2 turkey sausage links. 1/4 avocado with salt and everything bagel seasoning." },
    { type: "Lunch", title: "Rotisserie Chicken + Salad", desc: "No cooking required", recipe: "Buy a pre-made rotisserie chicken. Pull off 6 oz of meat. Serve with a side salad dressed with olive oil and lemon." },
    { type: "Dinner", title: "Skillet Pork Chops", desc: "Simple and satisfying", recipe: "Season 6 oz pork chops with salt, pepper, garlic powder. Sear in hot skillet with butter, 4 min per side. Roast cauliflower with butter at 400°F for 25 min." },
  ],
  6: [
    { type: "Breakfast", title: "Bacon & Egg Cups", desc: "Fun, make a batch", recipe: "Line muffin tin cups with bacon strips. Crack 1 egg into each cup. Season with salt and pepper. Bake 375°F for 15 min. Makes 6 — eat 3, save the rest." },
    { type: "Lunch", title: "Leftover Pork Chop Salad", desc: "Repurpose Friday's dinner", recipe: "Slice leftover pork chop thin. Lay over mixed greens with cucumber, cherry tomatoes, and ranch dressing." },
    { type: "Dinner", title: "Steak Night + Caesar", desc: "Weekend ritual", recipe: "Your usual skillet steak — 6 oz, seared in butter, salt and pepper. Side of Caesar salad: romaine, parmesan, Caesar dressing. No croutons." },
  ],
};

const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAYS_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const FILTER_LABELS = ["All", "Saved", "Glutes", "Cardio", "Core", "Full Body", "Flexibility"];

// ─── EXERCISE IMAGES ─────────────────────────────────────────────────────
// picsum.photos — free, no hotlink restrictions, seeded by category
const IMG = {
  glute:    "https://picsum.photos/seed/glute/400/200",
  squat:    "https://picsum.photos/seed/squat/400/200",
  lunge:    "https://picsum.photos/seed/lunge/400/200",
  deadlift: "https://picsum.photos/seed/deadlift/400/200",
  machine:  "https://picsum.photos/seed/machine/400/200",
  pull:     "https://picsum.photos/seed/pulldown/400/200",
  row:      "https://picsum.photos/seed/rowing/400/200",
  shoulder: "https://picsum.photos/seed/shoulder/400/200",
  core:     "https://picsum.photos/seed/plank/400/200",
  cardio:   "https://picsum.photos/seed/treadmill/400/200",
  stretch:  "https://picsum.photos/seed/yoga/400/200",
  gym:      "https://picsum.photos/seed/gym/400/200",
};

const EX_CATEGORY = {
  "Barbell Hip Thrust": "glute", "Hip Thrust (lighter)": "glute", "Hip Thrust (moderate)": "glute",
  "Hip Thrust (bodyweight)": "glute", "Single-Leg Hip Thrust": "glute",
  "Banded Glute Bridge": "glute", "Glute Bridge Burnout": "glute", "Frog Pump": "glute",
  "Cable Kickback": "glute", "Cable Kickback (light)": "glute", "Cable Pull-Through": "glute",
  "Hip Abductor Machine": "machine", "Back Extension (glute)": "machine", "Back Extension": "machine",
  "Barbell Squat": "squat", "Goblet Squat": "squat", "Goblet Squat (deep)": "squat",
  "Sumo Squat (DB)": "squat", "Banded Sumo Squat": "squat", "Bodyweight Squat": "squat",
  "Bulgarian Split Squat (DB)": "lunge", "Walking Lunges (DB)": "lunge", "Walking Lunge": "lunge",
  "Bodyweight Walking Lunge": "lunge", "Bodyweight Lunges": "lunge", "Reverse Lunge (DB)": "lunge",
  "Step-Up (DB)": "lunge",
  "Romanian Deadlift (BB)": "deadlift", "Romanian Deadlift (DB)": "deadlift",
  "DB Romanian Deadlift": "deadlift", "Sumo Deadlift": "deadlift",
  "Single-Leg RDL (DB)": "deadlift", "Single-Leg RDL": "deadlift",
  "Leg Press (high & wide)": "machine", "Lying Hamstring Curl": "machine", "Leg Extension": "machine",
  "Lat Pulldown (wide)": "pull", "Lat Pulldown (neutral grip)": "pull",
  "Lat Pulldown (neutral)": "pull", "Lat Pulldown": "pull",
  "Straight-Arm Pulldown": "pull", "DB Pullover": "pull",
  "Seated Cable Row": "row", "Single-Arm DB Row": "row", "Single-Arm Cable Row": "row",
  "Face Pulls": "shoulder", "Cable Face Pull": "shoulder", "Reverse Pec Deck": "shoulder",
  "Reverse DB Fly": "shoulder", "DB Lateral Raise (light)": "shoulder",
  "Plank Hold": "core", "Side Plank": "core", "Dead Bug": "core",
  "Pallof Press": "core", "Hollow Hold": "core", "Cable Woodchop": "core",
  "Incline Walk": "cardio", "Stair Climber": "cardio", "Jump Rope (or march)": "cardio",
  "Hip Flexor Stretch": "stretch", "Pigeon Pose": "stretch",
  "Hamstring Stretch (standing)": "stretch", "Cat-Cow": "stretch",
  "90/90 Hip Stretch": "stretch", "Child's Pose": "stretch",
};

// Real custom images — override the category placeholder when a real photo exists
const EX_IMG_OVERRIDE = {
  "Barbell Hip Thrust": "/images/barbell-hip-thrust.png",
  "Hip Thrust (lighter)": "/images/glute-bridge-burnout.jpg",
  "Hip Thrust (moderate)": "/images/glute-bridge-burnout.jpg",
  "Hip Thrust (bodyweight)": "/images/glute-bridge-burnout.jpg",
  "Single-Leg Hip Thrust": "/images/glute-bridge-burnout.jpg",
  "Banded Glute Bridge": "/images/banded-glute-bridge.jpg",
  "Glute Bridge Burnout": "/images/glute-bridge-burnout.jpg",
  "Cable Kickback": "/images/cable-kickback.jpg",
  "Cable Kickback (light)": "/images/cable-kickback-light.jpg",
  "Hip Abductor Machine": "/images/hip-abductor-machine.jpg",
  "Frog Pump": "/images/banded-glute-bridge.jpg",
  "Back Extension (glute)": "/images/back-extension-glute.jpg",
  "Back Extension": "/images/back-extension.jpg",
  "Cable Pull-Through": "/images/cable-pull-through.jpg",
  "Barbell Squat": "/images/barbell-squat.jpg",
  "Goblet Squat": "/images/goblet-squat.jpg",
  "Goblet Squat (deep)": "/images/goblet-squat-deep.jpg",
  "Sumo Squat (DB)": "/images/sumo-squat-db.jpg",
  "Banded Sumo Squat": "/images/banded-sumo-squat.jpg",
  "Bodyweight Squat": "/images/bodyweight-squat.jpg",
  "Bulgarian Split Squat (DB)": "/images/bulgarian-split-squat.jpg",
  "Walking Lunges (DB)": "/images/walking-lunges-db.jpg",
  "Walking Lunge": "/images/walking-lunge.jpg",
  "Bodyweight Walking Lunge": "/images/bodyweight-walking-lunge.jpg",
  "Bodyweight Lunges": "/images/bodyweight-lunges.jpg",
  "Reverse Lunge (DB)": "/images/reverse-lunge-db.jpg",
  "Step-Up (DB)": "/images/step-up-db.jpg",
  "Romanian Deadlift (BB)": "/images/romanian-deadlift-bb.jpg",
  "Romanian Deadlift (DB)": "/images/romanian-deadlift-db.jpg",
  "DB Romanian Deadlift": "/images/db-romanian-deadlift.jpg",
  "Sumo Deadlift": "/images/sumo-deadlift.jpg",
  "Single-Leg RDL (DB)": "/images/single-leg-rdl-db.jpg",
  "Single-Leg RDL": "/images/single-leg-rdl.jpg",
  "Leg Press (high & wide)": "/images/leg-press.jpg",
  "Lying Hamstring Curl": "/images/lying-hamstring-curl.jpg",
  "Leg Extension": "/images/leg-extension.jpg",
  "Lat Pulldown (wide)": "/images/lat-pulldown-wide.jpg",
  "Lat Pulldown (neutral grip)": "/images/lat-pulldown-neutral-grip.jpg",
  "Lat Pulldown (neutral)": "/images/lat-pulldown-neutral.jpg",
  "Lat Pulldown": "/images/lat-pulldown.jpg",
  "Straight-Arm Pulldown": "/images/straight-arm-pulldown.jpg",
  "DB Pullover": "/images/db-pullover.jpg",
  "Seated Cable Row": "/images/seated-cable-row.jpg",
  "Single-Arm DB Row": "/images/single-arm-db-row.jpg",
  "Single-Arm Cable Row": "/images/single-arm-cable-row.jpg",
  "Face Pulls": "/images/face-pulls.jpg",
  "Cable Face Pull": "/images/cable-face-pull.jpg",
  "Reverse Pec Deck": "/images/reverse-pec-deck.jpg",
  "Reverse DB Fly": "/images/reverse-db-fly.jpg",
  "DB Lateral Raise (light)": "/images/db-lateral-raise.jpg",
  "Plank Hold": "/images/plank-hold.jpg",
  "Side Plank": "/images/side-plank.jpg",
  "Dead Bug": "/images/dead-bug.jpg",
  "Pallof Press": "/images/pallof-press.jpg",
  "Hollow Hold": "/images/hollow-hold.jpg",
  "Cable Woodchop": "/images/cable-woodchop.jpg",
  "Incline Walk": "/images/incline-walk.jpg",
  "Stair Climber": "/images/stair-climber.jpg",
  "Jump Rope (or march)": "/images/jump-rope.jpg",
  "Hip Flexor Stretch": "/images/hip-flexor-stretch.jpg",
  "Pigeon Pose": "/images/pigeon-pose.jpg",
  "Hamstring Stretch (standing)": "/images/hamstring-stretch.jpg",
  "Cat-Cow": "/images/cat-cow.jpg",
  "90/90 Hip Stretch": "/images/90-90-hip-stretch.jpg",
  "Child's Pose": "/images/childs-pose.jpg",
};

const getImg = (name) => EX_IMG_OVERRIDE[name] || IMG[EX_CATEGORY[name] || "gym"];

const I = {
  home: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10.5z"/><path d="M9 22V14h6v8"/></svg>,
  nutrition: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  right: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  down: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  swap: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

// ─── WORKOUT CARD (reusable) ──────────────────────────────────────────────
function WorkoutCard({ title, tag, desc, onStart, isSwap, isScheduled }) {
  return (
    <div style={{
      ...S.card, padding: 16, flexShrink: 0, width: 220, display: "flex",
      flexDirection: "column", justifyContent: "space-between", gap: 12,
      border: isScheduled ? "1px solid rgba(221,251,36,0.25)" : "0.5px solid rgba(255,255,255,0.12)",
    }}>
      <div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <span style={S.pill}>{tag}</span>
          {isScheduled && <span style={{ ...S.pill, background: "rgba(221,251,36,0.1)", color: "#DDFB24" }}>Scheduled</span>}
        </div>
        <p style={{ ...S.h5, marginBottom: 4 }}>{title}</p>
        <p style={{ ...S.xs, color: "#656565", lineHeight: 1.5 }}>{desc}</p>
      </div>
      <button onClick={onStart} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: isSwap ? "rgba(221,251,36,0.08)" : "#DDFB24",
        border: isSwap ? "1px solid rgba(221,251,36,0.3)" : "none",
        borderRadius: 12, padding: "8px 8px 8px 14px",
        cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: isSwap ? "#DDFB24" : "#000" }}>
          {isSwap ? "Swap In" : "Start"}
        </span>
        <span style={{
          background: isSwap ? "#DDFB24" : "#000", borderRadius: 100,
          width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
          color: isSwap ? "#000" : "#fff",
        }}>
          {isSwap ? I.swap : I.right}
        </span>
      </button>
    </div>
  );
}

function AuthScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState("sign-in");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    const result = mode === "sign-up"
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName.trim() } },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
    } else if (mode === "sign-up" && !result.data.session) {
      setMessage("Check your email to confirm your account, then come back and sign in.");
    }
    setSubmitting(false);
  };

  const switchMode = () => {
    setMode(mode === "sign-in" ? "sign-up" : "sign-in");
    setMessage("");
    setError("");
  };

  if (showSplash) {
    return (
      <div style={{ ...S.wrap, position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <img src="/images/main-back.png" alt="Athlete training" style={{ position: "absolute", inset: 0, width: "100%", height: "64%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(2,3,0,0.08) 28%,#050600 62%,#050600 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", padding: "0 24px 72px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/icon.svg" alt="" style={{ width: 44, height: 44 }} />
            <strong style={{ fontSize: 30, letterSpacing: 1 }}>MOMENTUM</strong>
          </div>
          <h1 style={{ fontSize: 38, lineHeight: 1.18, letterSpacing: -1, margin: "26px 0 30px" }}>Start building a healthier, stronger you.</h1>
          <button type="button" onClick={() => setShowSplash(false)} style={S.btnPrimary}>Start Your Journey</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={{ minHeight: "100vh", padding: "110px 24px 52px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <img src="/icon.svg" alt="Momentum" style={{ width: 48, height: 48, marginBottom: 30 }} />
        <h1 style={{ fontSize: 36, lineHeight: 1.2, letterSpacing: -0.8, margin: 0 }}>{mode === "sign-in" ? "Welcome back! Sign in to get started." : "Create your Momentum account."}</h1>
        <p style={{ ...S.sm, color: "#8C8C8C", marginTop: 8, maxWidth: 340 }}>
          {mode === "sign-in" ? "Sign in to continue your personalized program." : "Your workouts and progress will stay securely connected to you."}
        </p>

        <form onSubmit={submit} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "sign-up" && (
            <label style={S.authLabel}>
              Name
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                required
                placeholder="Your name"
                style={S.authInput}
              />
            </label>
          )}
          <label style={S.authLabel}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="you@example.com"
              style={S.authInput}
            />
          </label>
          <label style={S.authLabel}>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={6}
              required
              placeholder="At least 6 characters"
              style={S.authInput}
            />
          </label>
          {error && <p role="alert" style={{ ...S.xs, color: "#ff8d8d" }}>{error}</p>}
          {message && <p role="status" style={{ ...S.xs, color: "#DDFB24", lineHeight: 1.5 }}>{message}</p>}
          <button type="submit" disabled={submitting} style={{ ...S.btnPrimary, marginTop: 8, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? "Please wait…" : mode === "sign-in" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button onClick={switchMode} style={{ marginTop: 18, background: "none", border: "none", color: "#ADADAD", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
          {mode === "sign-in" ? "New to Momentum? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const [showPlanMockup, setShowPlanMockup] = useState(false);
  const [viewDay, setViewDay] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [completed, setCompleted] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [swappedWorkout, setSwappedWorkout] = useState(null); // { dateKey, altId }
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailWorkout, setDetailWorkout] = useState(null); // alt workout being viewed
  const [expandedImg, setExpandedImg] = useState(null); // exercise name whose image is expanded
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [syncError, setSyncError] = useState("");

  const now = new Date();
  const dow = now.getDay();
  const activeDay = viewDay !== null ? viewDay : dow;
  const dc = DAY_CONFIG[activeDay];
  const dateKey = now.toISOString().split("T")[0];
  const donesToday = completed[dateKey] || [];

  const getWeek = () => {
    if (!startDate) return 0;
    const diff = Math.floor((now - new Date(startDate)) / 86400000);
    return Math.max(0, Math.min(3, Math.floor(diff / 7) % 4));
  };
  const weekIdx = getWeek();

  // Resolve today's exercises — either scheduled or swapped
  const todaySwap = swappedWorkout?.dateKey === dateKey ? swappedWorkout.altId : null;
  const swappedAlt = todaySwap ? ALT_WORKOUTS.find(a => a.id === todaySwap) : null;
  const scheduledExercises = dc.type ? (WORKOUTS[dc.type]?.[weekIdx] || []) : [];
  const todayExercises = swappedAlt ? swappedAlt.exercises : scheduledExercises;
  const todayTitle = swappedAlt ? swappedAlt.title : dc.label;
  const todayTag = swappedAlt ? swappedAlt.label : dc.tag;
  const todayWorkoutImage = swappedAlt ? getImg(swappedAlt.exercises[0].name) : DAY_WORKOUT_IMAGES[dc.type];
  const pct = todayExercises.length > 0 ? Math.round((donesToday.length / todayExercises.length) * 100) : 0;

  // For viewing a specific day
  const viewDayExercises = viewDay !== null
    ? (DAY_CONFIG[viewDay].type ? (WORKOUTS[DAY_CONFIG[viewDay].type]?.[weekIdx] || []) : [])
    : [];

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setAuthLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const loadProgramState = async () => {
      setLoading(true);
      setSyncError("");

      let localState = {
        start_date: null,
        completed_exercises: {},
        swapped_workout: null,
        saved_workouts: [],
      };
      try {
        const readLocal = (name) => localStorage.getItem(`m:${session.user.id}:${name}`) ?? localStorage.getItem(`m:${name}`);
        const done = readLocal("done");
        const start = readLocal("start");
        const swap = readLocal("swap");
        const saved = readLocal("saved");
        localState = {
          start_date: start || null,
          completed_exercises: done ? JSON.parse(done) : {},
          swapped_workout: swap ? JSON.parse(swap) : null,
          saved_workouts: saved ? JSON.parse(saved) : [],
        };
      } catch {}

      const { data, error } = await supabase
        .from("user_program_state")
        .select("start_date, completed_exercises, swapped_workout, saved_workouts")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!mounted) return;
      if (profileError) {
        setSyncError("Your account is connected, but the Momentum database still needs its setup scripts.");
      } else if (profileData) {
        setProfile(profileData);
      } else {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({ id: session.user.id, display_name: session.user.user_metadata?.display_name || session.user.email?.split("@")[0] })
          .select()
          .single();
        if (mounted) setProfile(newProfile);
      }

      if (error) {
        setSyncError("Your account is connected, but the Momentum database still needs its setup script.");
        setStartDate(localState.start_date);
        setCompleted(localState.completed_exercises);
        setSwappedWorkout(localState.swapped_workout);
        setSavedWorkouts(localState.saved_workouts);
        setLoading(false);
        return;
      }

      const nextState = data || localState;
      if (!data) {
        const { error: insertError } = await supabase.from("user_program_state").insert({
          user_id: session.user.id,
          ...localState,
        });
        if (insertError) {
          setSyncError("We couldn't create your Momentum data yet. Please try again after the database setup is complete.");
        } else {
          try {
            ["m:done", "m:start", "m:swap", "m:saved"].forEach((key) => localStorage.removeItem(key));
          } catch {}
        }
      } else {
        try {
          ["m:done", "m:start", "m:swap", "m:saved"].forEach((key) => localStorage.removeItem(key));
        } catch {}
      }

      setStartDate(nextState.start_date);
      setCompleted(nextState.completed_exercises || {});
      setSwappedWorkout(nextState.swapped_workout || null);
      setSavedWorkouts(nextState.saved_workouts || []);
      setLoading(false);
    };

    loadProgramState();
    return () => { mounted = false; };
  }, [session?.user?.id]);

  const persistUserState = async (changes) => {
    if (!session?.user) return;
    const { error } = await supabase.from("user_program_state").upsert({
      user_id: session.user.id,
      ...changes,
    }, { onConflict: "user_id" });
    setSyncError(error ? "Your latest change is saved on this device but has not synced yet." : "");
  };

  useEffect(() => {
    if (!session?.user || loading || !profile?.onboarding_completed_at || startDate) return;

    setStartDate(dateKey);
    try { localStorage.setItem(`m:${session.user.id}:start`, dateKey); } catch {}
    void persistUserState({ start_date: dateKey });
  }, [session?.user?.id, loading, profile?.onboarding_completed_at, startDate, dateKey]);

  const toggle = (idx) => {
    const u = { ...completed };
    const d = u[dateKey] || [];
    u[dateKey] = d.includes(idx) ? d.filter(i => i !== idx) : [...d, idx];
    setCompleted(u);
    try { localStorage.setItem(`m:${session.user.id}:done`, JSON.stringify(u)); } catch {}
    void persistUserState({ completed_exercises: u });
  };

  const swapWorkout = (altId) => {
    const s = { dateKey, altId };
    setSwappedWorkout(s);
    try { localStorage.setItem(`m:${session.user.id}:swap`, JSON.stringify(s)); } catch {}
    // Clear today's completions since workout changed
    const u = { ...completed, [dateKey]: [] };
    setCompleted(u);
    try { localStorage.setItem(`m:${session.user.id}:done`, JSON.stringify(u)); } catch {}
    void persistUserState({ swapped_workout: s, completed_exercises: u });
    setTab("home");
    setDetailWorkout(null);
  };

  const clearSwap = () => {
    setSwappedWorkout(null);
    try { localStorage.removeItem(`m:${session.user.id}:swap`); } catch {}
    const u = { ...completed, [dateKey]: [] };
    setCompleted(u);
    try { localStorage.setItem(`m:${session.user.id}:done`, JSON.stringify(u)); } catch {}
    void persistUserState({ swapped_workout: null, completed_exercises: u });
  };

  const toggleSaved = (id) => {
    const next = savedWorkouts.includes(id) ? savedWorkouts.filter(x => x !== id) : [...savedWorkouts, id];
    setSavedWorkouts(next);
    try { localStorage.setItem(`m:${session.user.id}:saved`, JSON.stringify(next)); } catch {}
    void persistUserState({ saved_workouts: next });
  };

  const filteredAlts = ALT_WORKOUTS.filter(a => {
    if (activeFilter === "Saved" && !savedWorkouts.includes(a.id)) return false;
    const matchFilter = activeFilter === "All" || activeFilter === "Saved" || a.label === activeFilter;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (authLoading) return <ProgramLoading />;

  if (!session) return <AuthScreen />;

  if (loading) return <ProgramLoading />;

  if (!profile?.onboarding_completed_at) {
    return <OnboardingFlow user={session.user} profile={profile} onComplete={setProfile} />;
  }

  if (showPlanMockup) return <PlanMockup initialScreen="settings" onClose={() => setShowPlanMockup(false)} />;

  // ── IMAGE EXPAND MODAL (overlays any screen) ──
  const ImageModal = expandedImg ? (
    <div onClick={() => setExpandedImg(null)} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{ maxWidth: 430, width: "100%" }}>
        <img src={getImg(expandedImg)} alt={expandedImg}
          style={{ width: "100%", borderRadius: 20, display: "block" }} />
        <div style={{ padding: "0 8px" }}>
          <p style={{ ...S.h4, color: "#fff", marginTop: 16 }}>{expandedImg}</p>
          <p style={{ ...S.sm, color: "#ADADAD", marginTop: 8, lineHeight: 1.55 }}>
            {exerciseLongDescription(
              [...Object.values(WORKOUTS).flat(2), ...ALT_WORKOUTS.flatMap(w => w.exercises)]
                .find(ex => ex.name === expandedImg) || { name: expandedImg, notes: "Move with control and maintain consistent form." }
            )}
          </p>
        </div>
        <button onClick={() => setExpandedImg(null)} style={{
          ...S.btnPrimary, marginTop: 16,
        }}>Close</button>
      </div>
    </div>
  ) : null;

  // ── ALT WORKOUT DETAIL ──
  if (detailWorkout) {
    const alt = ALT_WORKOUTS.find(a => a.id === detailWorkout);
    const isCurrentSwap = todaySwap === alt.id;
    return (
      <div style={S.wrap}>
        <div style={{ padding: "16px" }}>
          <button onClick={() => setDetailWorkout(null)} style={S.btnBack}>{I.back} Back</button>
          <div style={{ marginTop: 16 }}>
            <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{alt.label}</span>
            <h1 style={{ ...S.h2, marginTop: 4 }}>{alt.title}</h1>
            <p style={{ ...S.sm, color: "#ADADAD", marginTop: 4 }}>{alt.desc}</p>
          </div>
          {!isCurrentSwap ? (
            <button onClick={() => swapWorkout(alt.id)} style={{ ...S.btnPrimary, marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ color: "#000" }}>{I.swap}</span> Swap in for Today
            </button>
          ) : (
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <div style={{ flex: 1, background: "rgba(221,251,36,0.08)", border: "1px solid rgba(221,251,36,0.3)", borderRadius: 14, padding: "12px 16px", textAlign: "center" }}>
                <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600 }}>✓ Today's workout</span>
              </div>
              <button onClick={clearSwap} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 16px", color: "#8C8C8C", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>
                Undo
              </button>
            </div>
          )}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {alt.exercises.map((ex, idx) => (
              <div key={idx} onClick={() => setExpandedImg(ex.name)}
                style={{ ...S.card, overflow: "hidden", position: "relative", minHeight: 90, display: "flex", alignItems: "stretch", cursor: "pointer" }}>
                <div style={{ flex: 1, padding: "14px 16px", zIndex: 1, position: "relative" }}>
                  <p style={{ ...S.sm, fontWeight: 700 }}>{ex.name}</p>
                  <span style={{ ...S.xs, color: "#DDFB24", marginTop: 3, display: "inline-block" }}>{ex.sets}</span>
                  <p style={{ ...S.xs, color: "#656565", marginTop: 3 }}>{ex.notes}</p>
                </div>
                <div style={{ width: 150, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                  <img src={getImg(ex.name)} alt={ex.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                  <div style={{ position: "absolute", top: -1, bottom: -1, left: -130, width: 280, background: "linear-gradient(90deg, #0a0707 6%, rgba(10,7,7,0.98) 28%, rgba(10,7,7,0.72) 54%, rgba(10,7,7,0.08) 86%, transparent 100%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,9,3,0.16), transparent 35%, rgba(9,9,3,0.42))", pointerEvents: "none" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 100 }} />
        <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} setDetailWorkout={setDetailWorkout} />
      {ImageModal}
      </div>
    );
  }

  // ── NUTRITION TAB ──
  if (tab === "nutrition") {
    const mealDay = viewDay !== null ? viewDay : dow;
    const meals = MEALS[mealDay] || MEALS[0];
    return (
      <div style={S.wrap}>
        <div style={{ padding: "24px 16px 12px" }}>
          <h1 style={S.h2}>Meal Plan</h1>
          <p style={{ ...S.xs, color: "#8C8C8C", marginTop: 4 }}>Keto · ~1,500 cal · 120g protein · &lt;25g carbs</p>
        </div>
        <div style={{ padding: "4px 16px 12px", display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {[0,1,2,3,4,5,6].map(d => (
            <button key={d} onClick={() => { setViewDay(d); setExpandedMeal(null); }}
              style={{ ...S.chip, ...(mealDay === d ? S.chipOn : {}), width: 48, height: 48, minWidth: 48, flexShrink: 0, padding: "8px 4px", borderRadius: 14, justifyContent: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>{DAYS[d]}</span>
              {d === dow && <span style={{ width: 4, height: 4, borderRadius: 2, marginTop: 4, background: mealDay === d ? "#000" : "#DDFB24" }} />}
            </button>
          ))}
        </div>
        <div style={{ padding: "8px 16px" }}>
          <h3 style={{ ...S.h5, marginBottom: 4 }}>{DAYS_FULL[mealDay]}</h3>
          <p style={{ ...S.xs, color: "#656565", marginBottom: 16 }}>Tap a meal to see the full recipe</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {meals.map((m, i) => {
              const open = expandedMeal === i;
              return (
                <button key={i} onClick={() => setExpandedMeal(open ? null : i)}
                  style={{ ...S.card, padding: 0, width: "100%", textAlign: "left", cursor: "pointer", overflow: "hidden" }}>
                  <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.type}</span>
                      <p style={{ ...S.md, fontWeight: 700, marginTop: 4 }}>{m.title}</p>
                      <p style={{ ...S.xs, color: "#ADADAD", marginTop: 2 }}>{m.desc}</p>
                    </div>
                    <span style={{ color: "#656565", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "" }}>{I.down}</span>
                  </div>
                  {open && (
                    <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <p style={{ ...S.sm, color: "#ADADAD", marginTop: 12, lineHeight: 1.7 }}>{m.recipe}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ height: 120 }} />
        <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} setDetailWorkout={setDetailWorkout} />
      {ImageModal}
      </div>
    );
  }

  // ── EXPLORE WORKOUTS TAB ──
  if (tab === "explore") {
    return (
      <div style={S.wrap}>
        <div style={{ padding: "24px 16px 12px" }}>
          <h1 style={S.h2}>Workouts</h1>
          <p style={{ ...S.xs, color: "#8C8C8C", marginTop: 4 }}>Swap today's plan or preview any session</p>
        </div>

        {/* Today's plan reminder */}
        <div style={{ padding: "0 16px 8px" }}>
          <div style={{ ...S.card, minHeight: 220, position: "relative", overflow: "hidden", border: "1px solid rgba(221,251,36,0.25)" }}>
            <img src={todayWorkoutImage} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,9,3,0.06) 15%, rgba(9,9,3,0.88) 100%)" }} />
            <div style={{ position: "relative", zIndex: 1, minHeight: 220, padding: 16, display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ ...S.xs, color: "#DDFB24", fontWeight: 600, marginBottom: 2 }}>TODAY'S WORKOUT</p>
                  <p style={{ ...S.h4, fontWeight: 700 }}>{todayTitle}</p>
                  {todaySwap && <p style={{ ...S.xs, color: "#8C8C8C", marginTop: 2 }}>Swapped from scheduled</p>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  {todaySwap && (
                    <button onClick={clearSwap} style={{ ...S.xs, color: "#8C8C8C", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                      Reset
                    </button>
                  )}
                  <button onClick={() => { setViewDay(dow); setTab("home"); }} style={{ background: "#DDFB24", border: "none", borderRadius: 10, padding: "8px 8px 8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "#000" }}>
                    View
                    <span style={{ background: "#000", borderRadius: 100, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{I.right}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browse controls */}
        <div style={{ padding: "16px 16px 4px" }}>
          <h3 style={{ ...S.h5, margin: 0 }}>Browse Workouts</h3>
        </div>
        <div style={{ padding: "8px 16px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 28, padding: "10px 16px" }}>
            <span style={{ color: "#656565" }}>{I.search}</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search workouts"
              style={{ background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, flex: 1 }}
            />
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: "4px 16px 8px", display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {FILTER_LABELS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              flexShrink: 0, padding: "7px 13px", borderRadius: 40, cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
              background: activeFilter === f ? "#DDFB24" : "rgba(255,255,255,0.05)",
              color: activeFilter === f ? "#000" : "#fff",
              border: activeFilter === f ? "none" : "1px solid #525252",
            }}>{f}</button>
          ))}
        </div>

        {/* Workout cards */}
        <div style={{ padding: "4px 16px" }}>
          <p style={{ ...S.xs, color: "#8C8C8C", margin: "8px 0 12px" }}>
            {filteredAlts.length} {activeFilter === "All" ? "workouts" : `${activeFilter.toLowerCase()} workouts`}{searchQuery && ` matching “${searchQuery}”`}
          </p>
          {filteredAlts.length === 0 ? (
            <p style={{ ...S.sm, color: "#656565", padding: "20px 0" }}>No workouts match that filter.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredAlts.map(alt => {
                const isActive = todaySwap === alt.id;
                return (
                  <div key={alt.id} style={{
                    ...S.card, padding: 16, minHeight: 190, position: "relative", overflow: "hidden",
                    border: isActive ? "1px solid rgba(221,251,36,0.3)" : "0.5px solid rgba(255,255,255,0.12)",
                  }}>
                    <img src={ALT_WORKOUT_IMAGES[alt.id] || getImg(alt.exercises[0].name)} alt="" aria-hidden="true" style={{ position: "absolute", inset: "0 0 0 42%", width: "58%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 1, filter: "contrast(1.04) saturate(0.92)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #141414 24%, rgba(20,20,20,0.98) 40%, rgba(20,20,20,0.78) 57%, rgba(10,7,7,0.18) 82%, transparent 100%), linear-gradient(180deg, rgba(9,9,3,0.12) 0%, transparent 34%, rgba(9,9,3,0.78) 100%)", pointerEvents: "none" }} />
                    <button onClick={() => toggleSaved(alt.id)} aria-label={savedWorkouts.includes(alt.id) ? `Remove ${alt.title} from saved workouts` : `Save ${alt.title}`} style={{ position: "absolute", right: 12, top: 12, zIndex: 2, width: 40, height: 40, borderRadius: 12, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 8 }}>
                      <img src={savedWorkouts.includes(alt.id) ? SAVE_ICON_TAPPED : SAVE_ICON_DEFAULT} alt="" width="24" height="24" />
                    </button>
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 158 }}>
                      <div>
                        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                          <span style={S.pill}>{alt.label}</span>
                          {isActive && <span style={{ ...S.pill, background: "rgba(221,251,36,0.1)", color: "#DDFB24" }}>Today's pick</span>}
                        </div>
                        <p style={{ ...S.sm, fontWeight: 700 }}>{alt.title}</p>
                        <p style={{ ...S.xs, color: "#656565", marginTop: 3 }}>{alt.desc}</p>
                        <p style={{ ...S.xs, color: "#525252", marginTop: 4 }}>{alt.exercises.length} exercises</p>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 12, width: "100%" }}>
                      <button onClick={() => setDetailWorkout(alt.id)} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                        Preview
                      </button>
                      {!isActive ? (
                        <button onClick={() => swapWorkout(alt.id)} style={{ flex: 1, background: "#DDFB24", border: "none", borderRadius: 12, padding: "10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <span style={{ color: "#000" }}>{I.swap}</span> Swap In
                        </button>
                      ) : (
                        <button onClick={clearSwap} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(221,251,36,0.3)", borderRadius: 12, padding: "10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#DDFB24" }}>
                          Undo Swap
                        </button>
                      )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ height: 120 }} />
        <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} setDetailWorkout={setDetailWorkout} />
      {ImageModal}
      </div>
    );
  }

  // ── RECOVERY / REST DAY DETAIL ──
  if (viewDay !== null && viewDayExercises.length === 0) {
    const vdc = DAY_CONFIG[viewDay];
    return (
      <div style={S.wrap}>
        <div style={{ padding: "16px" }}>
          <button onClick={() => setViewDay(null)} style={S.btnBack}>{I.back} Back</button>
          <div style={{ marginTop: 24 }}>
            <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              {viewDay === 6 ? "Recovery plan" : "Weekly reset"}
            </span>
            <div style={{ fontSize: 48, marginTop: 16 }}>{vdc.emoji}</div>
            <h1 style={{ ...S.h2, marginTop: 8 }}>{vdc.label}</h1>
            <p style={{ ...S.sm, color: "#ADADAD", lineHeight: 1.6, marginTop: 8, maxWidth: 360 }}>{vdc.msg}</p>
          </div>

          <div style={{ ...S.card, padding: 18, marginTop: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ ...S.xs, color: "#656565", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
              {viewDay === 6 ? "Keep it light" : "Today’s priorities"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {vdc.guidance.map((item, idx) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(221,251,36,0.1)", color: "#DDFB24", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 700 }}>{idx + 1}</span>
                  <span style={{ ...S.sm, color: "#fff" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {vdc.cta && (
            <button onClick={() => { setActiveFilter("Flexibility"); setSearchQuery(""); setViewDay(null); setTab("explore"); }} style={{ ...S.btnPrimary, width: "100%", marginTop: 16 }}>
              {vdc.cta} {I.right}
            </button>
          )}
        </div>
        <div style={{ height: 120 }} />
        <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} setDetailWorkout={setDetailWorkout} />
        {ImageModal}
      </div>
    );
  }

  // ── WORKOUT DETAIL (scheduled day) ──
  if (viewDay !== null && viewDayExercises.length > 0) {
    const vdc = DAY_CONFIG[viewDay];
    const isToday = viewDay === dow;
    const exs = isToday ? todayExercises : viewDayExercises;
    const ttl = isToday ? todayTitle : vdc.label;
    const tg = isToday ? todayTag : vdc.tag;
    return (
      <div style={S.wrap}>
        <div style={{ padding: "16px" }}>
          <button onClick={() => setViewDay(null)} style={S.btnBack}>{I.back} Back</button>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{tg}</span>
              <span style={{ ...S.xs, color: "#302F2F" }}>·</span>
              <span style={{ ...S.xs, color: "#8C8C8C" }}>Week {weekIdx + 1} — {WEEK_LABELS[weekIdx]}</span>
            </div>
            <h1 style={{ ...S.h2, marginTop: 6 }}>{vdc.emoji} {ttl}</h1>
            {isToday && todaySwap && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <span style={{ ...S.xs, color: "#8C8C8C" }}>Swapped from scheduled ·</span>
                <button onClick={clearSwap} style={{ ...S.xs, color: "#DDFB24", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", padding: 0 }}>Undo</button>
              </div>
            )}
            {isToday && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#DDFB24", borderRadius: 2, transition: "width 0.4s" }} />
                </div>
                <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600 }}>{pct}%</span>
              </div>
            )}
            {!isToday && <p style={{ ...S.xs, color: "#656565", marginTop: 8 }}>Preview — check off exercises on the actual day</p>}
          </div>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {exs.map((ex, idx) => {
              const done = isToday && donesToday.includes(idx);
              return (
                <div key={idx}
                  style={{ ...S.card, overflow: "hidden", position: "relative", minHeight: 90,
                    display: "flex", alignItems: "stretch",
                    opacity: done ? 0.35 : 1, transition: "opacity 0.3s" }}>
                  {isToday && (
                    <div onClick={() => toggle(idx)} style={{ display: "flex", alignItems: "center", paddingLeft: 14, zIndex: 1, flexShrink: 0, cursor: "pointer" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8,
                        border: done ? "none" : "1.5px solid rgba(255,255,255,0.15)",
                        background: done ? "#DDFB24" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {done && <span style={{ color: "#000" }}>{I.check}</span>}
                      </div>
                    </div>
                  )}
                  <div onClick={() => isToday && toggle(idx)} style={{ flex: 1, padding: "14px 12px 14px 14px", zIndex: 1, cursor: isToday ? "pointer" : "default" }}>
                    <p style={{ ...S.sm, fontWeight: 700, textDecoration: done ? "line-through" : "none" }}>{ex.name}</p>
                    <span style={{ ...S.xs, color: "#DDFB24", marginTop: 3, display: "inline-block" }}>{ex.sets}</span>
                    <p style={{ ...S.xs, color: "#656565", marginTop: 3 }}>{ex.notes}</p>
                  </div>
                  <div onClick={() => setExpandedImg(ex.name)} style={{ width: 150, flexShrink: 0, position: "relative", overflow: "hidden", cursor: "pointer" }}>
                    <img src={getImg(ex.name)} alt={ex.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                    <div style={{ position: "absolute", top: -1, bottom: -1, left: -130, width: 280, background: "linear-gradient(90deg, #0a0707 6%, rgba(10,7,7,0.98) 28%, rgba(10,7,7,0.72) 54%, rgba(10,7,7,0.08) 86%, transparent 100%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,9,3,0.16), transparent 35%, rgba(9,9,3,0.42))", pointerEvents: "none" }} />
                  </div>
                </div>
              );
            })}
          </div>
          {pct === 100 && isToday && (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <div style={{ fontSize: 44 }}>🎉</div>
              <p style={{ ...S.h4, marginTop: 8, color: "#DDFB24" }}>Crushed it!</p>
            </div>
          )}
        </div>
        <div style={{ height: 120 }} />
        <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} setDetailWorkout={setDetailWorkout} />
      {ImageModal}
      </div>
    );
  }

  // ── HOME ──
  const todayConf = DAY_CONFIG[dow];
  return (
    <div style={S.wrap}>
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <svg width="36" height="36" viewBox="0 0 95 95" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="7.5" y="5" width="80" height="80" rx="8" fill="black"/>
            <path d="M65.5 34.4067H70.5V58.093H65.5V34.4067Z" fill="#DDFB24"/>
            <path d="M73 40.0322H78V52.4675H73V40.0322Z" fill="#DDFB24"/>
            <path d="M29.5 58.0931H24.5L24.5 34.4067L29.5 34.4067L29.5 58.0931Z" fill="#DDFB24"/>
            <path d="M22 52.4676H17L17 40.0323L22 40.0323L22 52.4676Z" fill="#DDFB24"/>
            <path d="M39.5 49.4067L32 49.4067V42.9067L39.5 42.9067V49.4067Z" fill="#DDFB24"/>
            <path d="M63 49.4067H55.5V42.9067L63 42.9067V49.4067Z" fill="#DDFB24"/>
            <path d="M39.8091 49.4067V40.9382L47.3108 54.3933H47.9412L55.1908 41.0488V49.4067H59.6666V31.9067H55.0647L47.689 45.9516L39.9982 31.9067H35.3333V49.4067H39.8091Z" fill="#DDFB24"/>
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...S.xs, color: "#ADADAD", fontWeight: 600, letterSpacing: 1 }}>{DAYS[dow]}  {now.getDate()} {MONTHS[now.getMonth()]}</span>
            <button onClick={() => supabase.auth.signOut()} style={{ ...S.btnText, fontSize: 11, padding: "5px 8px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>Sign out</button>
            <button onClick={() => setShowPlanMockup(true)} aria-label="Settings" style={{ width: 40, height: 40, display: "grid", placeItems: "center", background: "#141414", border: "1px solid #302F2F", borderRadius: "50%", color: "#fff", cursor: "pointer" }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 3-.5 2-2 .9-1.9-.6-2 3.4L4 10.2v2.3L2.6 14l2 3.4 1.9-.6 2 .9.5 2h4l.5-2 2-.9 1.9.6 2-3.4-1.4-1.5v-2.3l1.4-1.5-2-3.4-1.9.6-2-.9-.5-2Z" transform="translate(1 1)"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        {syncError && <p role="status" style={{ ...S.xs, color: "#ffcf70", marginTop: 12, lineHeight: 1.5 }}>{syncError}</p>}
        <h1 style={{ ...S.h2, marginTop: 12 }}>Let's Crush Today's Goals!</h1>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(221,251,36,0.06)", borderRadius: 20, padding: "5px 14px", marginTop: 10 }}>
          <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600 }}>Week {weekIdx + 1}: {WEEK_LABELS[weekIdx]}</span>
          <span style={{ ...S.xs, color: "#302F2F" }}>·</span>
          <span style={{ ...S.xs, color: "#8C8C8C" }}>4-week cycle</span>
        </div>
      </div>

      {/* Today's Workout */}
      <div style={{ padding: "8px 16px" }}>
        <h3 style={{ ...S.h5, marginBottom: 12 }}>Today's Workout</h3>
        {!todayConf.type ? (
          <button onClick={() => setViewDay(dow)} style={{ ...S.card, padding: 28, textAlign: "center", width: "100%", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
            <div style={{ fontSize: 44 }}>{todayConf.emoji}</div>
            <h3 style={{ ...S.h4, marginTop: 10 }}>{todayConf.label}</h3>
            <p style={{ ...S.sm, color: "#ADADAD", marginTop: 6 }}>{todayConf.msg}</p>
            <span style={{ ...S.xs, display: "inline-flex", alignItems: "center", gap: 4, color: "#DDFB24", fontWeight: 600, marginTop: 12 }}>View plan {I.right}</span>
          </button>
        ) : (
          <button onClick={() => setViewDay(dow)}
            style={{ ...S.card, position: "relative", overflow: "hidden", padding: 0, width: "100%", minHeight: 240, textAlign: "left", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)" }}>
            <img src={todayWorkoutImage} alt={`${todayTitle} workout`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,9,3,0.02) 20%, rgba(9,9,3,0.35) 50%, rgba(9,9,3,0.96) 100%)" }} />
            <div style={{ position: "relative", zIndex: 1, minHeight: 240, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8, padding: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={S.pill}>{todayTag}</span>
              <span style={S.pill}>{todayExercises.length} exercises</span>
              {todaySwap && <span style={{ ...S.pill, background: "rgba(221,251,36,0.1)", color: "#DDFB24" }}>Swapped</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                <h3 style={{ ...S.h4, maxWidth: "100%" }}>{todayConf.emoji} {todayTitle}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 150, height: 6, background: "rgba(255,255,255,0.18)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#DDFB24", borderRadius: 99, transition: "width 0.4s" }} />
                </div>
                <span style={{ ...S.xs, color: pct === 100 ? "#DDFB24" : "#8C8C8C" }}>{pct === 100 ? "Done!" : `${donesToday.length}/${todayExercises.length}`}</span>
                </div>
              </div>
              <div style={{ ...S.startBtn, flexShrink: 0 }}>
                <span>{pct > 0 && pct < 100 ? "Continue" : "Start"}</span>
                <span style={S.startIcon}>{I.right}</span>
              </div>
            </div>
            </div>
          </button>
        )}
      </div>

      {/* Explore Workouts section */}
      {todayConf.type && (
        <div style={{ padding: "16px 0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 12 }}>
            <h3 style={S.h4}>Explore Workouts</h3>
            <button onClick={() => setTab("explore")} style={{ background: "none", border: "none", color: "#DDFB24", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              View All {I.right}
            </button>
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "4px 16px", WebkitOverflowScrolling: "touch" }}>
            {ALT_WORKOUTS.slice(0, 4).map(alt => {
              const isActive = todaySwap === alt.id;
              return (
                <button key={alt.id} onClick={() => setDetailWorkout(alt.id)}
                  style={{ ...S.card, padding: 16, flexShrink: 0, width: 200, display: "flex",
                    flexDirection: "column", justifyContent: "space-between", gap: 10, textAlign: "left",
                    cursor: "pointer", border: isActive ? "1px solid rgba(221,251,36,0.3)" : "0.5px solid rgba(255,255,255,0.12)" }}>
                  <div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <span style={S.pill}>{alt.label}</span>
                      {isActive && <span style={{ ...S.pill, background: "rgba(221,251,36,0.1)", color: "#DDFB24" }}>Active</span>}
                    </div>
                    <p style={{ ...S.sm, fontWeight: 700, color: "#fff" }}>{alt.title}</p>
                    <p style={{ ...S.xs, color: "#656565", marginTop: 4, lineHeight: 1.5 }}>{alt.desc}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#DDFB24" }}>
                    <span style={{ ...S.xs, fontWeight: 600, color: "#DDFB24" }}>View workout</span>
                    <span style={{ color: "#DDFB24" }}>{I.right}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Week */}
      <div style={{ padding: "16px 16px 0" }}>
        <h3 style={{ ...S.h4, marginBottom: 12 }}>This Week</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[1,2,3,4,5,6,0].map(d => {
            const di = DAY_CONFIG[d];
            const isT = d === dow;
            return (
              <button key={d} onClick={() => setViewDay(d)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 14,
                  border: isT ? "1px solid rgba(221,251,36,0.15)" : "1px solid transparent",
                  background: isT ? "rgba(221,251,36,0.05)" : "transparent",
                  cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                <span style={{ ...S.xs, color: isT ? "#DDFB24" : "#656565", width: 32, fontWeight: 600 }}>{DAYS[d]}</span>
                <span style={{ fontSize: 14 }}>{di.emoji}</span>
                <span style={{ ...S.sm, color: isT ? "#fff" : "#ADADAD", flex: 1 }}>{di.label}</span>
                {isT && <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 700, fontSize: 10 }}>TODAY</span>}
                {!isT && <span style={{ color: "#302F2F" }}>{I.right}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: 120 }} />
      <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} setDetailWorkout={setDetailWorkout} />
      {ImageModal}
    </div>
  );
}

// ─── BOTTOM NAV (3 tabs: Home, Nutrition, Explore) ────────────────────────
const NAV_ICONS = {
  home: {
    default: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.6835 24.2335L10.6611 21.6556C10.661 20.7456 11.4029 20.0061 12.3221 20H15.6892C16.6128 20 17.3616 20.7413 17.3616 21.6556L17.384 24.2446C17.3838 25.0172 18.0067 25.6487 18.787 25.6668H21.0317C23.2694 25.6668 25.0834 23.871 25.0834 21.6556V11.4776C25.0715 10.6061 24.6581 9.78774 23.9611 9.25537L16.2841 3.13301C14.9392 2.06699 13.0273 2.06699 11.6824 3.13301L4.03911 9.26648C3.33938 9.79669 2.92537 10.6164 2.91675 11.4887V21.6556C2.91675 23.871 4.73077 25.6668 6.96848 25.6668H9.2132C10.0128 25.6668 10.6611 25.0251 10.6611 24.2335" stroke="#656565" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.6057 16.2046H17.3948" stroke="#656565" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    active: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.6678 20.6675V24.2455H10.626C10.626 24.6241 10.4738 24.9871 10.2031 25.2538C9.93248 25.5206 9.56578 25.6691 9.18442 25.6663H6.94895C4.72203 25.6663 2.91675 23.874 2.91675 21.6631V11.5098C2.93723 10.6392 3.35161 9.82397 4.04493 9.29043L11.6497 3.20262C12.968 2.07518 14.9083 2.04032 16.2669 3.11965L24.0388 9.29043C24.7008 9.84017 25.0834 10.653 25.0834 11.5098V21.6735C25.0834 22.7342 24.6583 23.7514 23.9018 24.5005C23.1453 25.2496 22.1197 25.6691 21.0512 25.6663H18.7635C17.9714 25.6606 17.3324 25.0215 17.3324 24.2351V20.6675C17.3324 19.7567 16.5888 19.0185 15.6715 19.0185H12.3183C11.405 19.0242 10.6678 19.7608 10.6678 20.6675ZM10.6058 12.9961C10.1225 12.9961 9.73075 13.3878 9.73075 13.8711C9.73075 14.3543 10.1225 14.7461 10.6058 14.7461H17.3948C17.8781 14.7461 18.2698 14.3543 18.2698 13.8711C18.2698 13.3878 17.8781 12.9961 17.3948 12.9961H10.6058Z" fill="#DDFB24"/></svg>,
  },
  nutrition: {
    default: <svg width="36" height="35" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.6883 11.4891C29.0076 11.6487 29.0874 12.0478 28.8878 12.3671L26.2938 16.2781C24.9768 18.2336 22.9814 18.9918 20.8663 18.3533L12.3658 27.2928C12.0465 27.612 11.5676 27.8515 11.1286 27.8515C11.0887 27.8515 11.0488 27.8515 11.0089 27.8515C10.5699 27.8515 10.1708 27.6919 9.89147 27.4125L9.01349 26.5345C8.69422 26.2153 8.53459 25.7763 8.53459 25.2974C8.57449 24.8584 8.77404 24.3795 9.13321 24.0602L18.0727 15.5597C17.4341 13.4047 18.1525 11.4891 20.108 10.1721L24.0589 7.53815C24.3782 7.33861 24.7374 7.41843 24.9369 7.7377C25.1365 8.01705 25.0566 8.41614 24.7773 8.61568L20.8264 11.2097C19.23 12.2872 18.7511 13.7239 19.4296 15.5198L19.5493 15.9189L10.0112 24.9781C9.89147 25.0978 9.85156 25.2175 9.81165 25.3772C9.81165 25.4969 9.85156 25.5767 9.93138 25.6565L10.7695 26.4946C10.8493 26.5744 10.9291 26.6143 11.0488 26.5744C11.1685 26.5744 11.3282 26.4946 11.4479 26.4148L20.5071 16.8368L20.9062 16.9964C22.6621 17.6749 24.1387 17.1561 25.2163 15.5597L27.8103 11.6487C28.0099 11.3694 28.4089 11.2895 28.6883 11.4891ZM11.7273 19.5905C11.6873 19.5905 11.6075 19.5905 11.5277 19.5506C7.81624 18.1937 6.61899 15.1207 6.2199 13.4446C5.741 11.2097 6.06027 8.77531 6.97816 7.85742C7.25752 7.57806 7.69651 7.41843 8.17541 7.45834C8.57449 7.45834 8.97358 7.65788 9.29284 7.97715L16.2768 14.6418C16.5163 14.8813 16.5163 15.2804 16.2768 15.5597C16.0374 15.7992 15.6383 15.7992 15.3988 15.5597L8.37495 8.89504C8.29514 8.77531 8.17541 8.7354 8.05569 8.7354C8.01578 8.7354 7.93596 8.7354 7.85614 8.77531C7.45706 9.1744 6.97816 10.9703 7.45706 13.1652C7.81624 14.6019 8.81394 17.196 11.9667 18.3533C12.286 18.473 12.4456 18.8322 12.3259 19.1515C12.2461 19.4308 12.0066 19.5905 11.7273 19.5905ZM21.6245 19.7501L25.775 23.701C26.5732 24.5391 26.653 25.7763 25.9346 26.4946L25.0566 27.3726C24.7374 27.6919 24.2984 27.8515 23.8195 27.8515C23.7796 27.8515 23.7796 27.8515 23.7796 27.8515C23.1809 27.8515 22.6222 27.612 22.2231 27.1331L18.3121 23.3818C18.0727 23.1423 18.0727 22.7432 18.3121 22.4639C18.5516 22.2244 18.9507 22.2244 19.23 22.4639L23.141 26.2552C23.3406 26.4547 23.58 26.5744 23.7796 26.5744C23.8993 26.6143 24.0589 26.5744 24.1387 26.4547L25.0167 25.5767C25.2562 25.3772 25.1764 24.9382 24.8571 24.6189L20.7465 20.668C20.4672 20.4285 20.4672 20.0295 20.7066 19.7501C20.9461 19.5107 21.3452 19.5107 21.6245 19.7501ZM20.986 13.684C20.7465 13.4047 20.7864 13.0056 21.0259 12.7661L25.336 8.93495C25.5754 8.6955 25.9745 8.7354 26.214 8.97485C26.4534 9.25421 26.4534 9.6533 26.1741 9.89275L21.9039 13.7239C21.7842 13.8437 21.6245 13.8836 21.4649 13.8836C21.3053 13.8836 21.1057 13.8038 20.986 13.684ZM22.8617 15.5198C22.5823 15.2804 22.5424 14.8813 22.7819 14.6418L26.6131 10.3317C26.8525 10.0923 27.2915 10.0524 27.531 10.2918C27.8103 10.5313 27.8103 10.9304 27.5709 11.2097L23.7397 15.4799C23.6199 15.6395 23.4603 15.6795 23.2608 15.6795C23.1011 15.6795 22.9814 15.6395 22.8617 15.5198Z" fill="#656565"/></svg>,
    active: <svg width="36" height="35" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.85385 24.8584L13.8823 20.0295L16.4364 22.5038L11.5676 27.5721C11.3681 27.7717 11.1286 27.8515 10.8892 27.8515C10.6098 27.8914 10.3704 27.7717 10.1708 27.5721L8.85385 26.2552C8.65431 26.0556 8.53459 25.8162 8.57449 25.5368C8.57449 25.2974 8.65431 25.0579 8.85385 24.8584ZM28.7282 11.1698C29.0076 11.3694 29.0475 11.7285 28.8878 12.0079L26.6929 15.879C25.9346 17.0762 24.7374 17.7946 23.3805 17.9542C22.6222 18.034 21.864 17.8744 21.1855 17.5951L19.9085 18.912L26.1342 24.8983C26.5332 25.2575 26.5332 25.8561 26.1342 26.2552L24.8172 27.5721C24.6176 27.7717 24.3782 27.8914 24.0988 27.8515C23.8195 27.8515 23.58 27.7318 23.4204 27.5721L14.1617 18.5129C4.90293 19.0318 5.30201 9.33403 6.89834 7.7377C7.25752 7.33861 7.85614 7.33861 8.25523 7.7377L17.4741 16.5574L18.8309 15.2405C18.5516 14.562 18.3919 13.8038 18.4718 13.0455C18.6314 11.6886 19.3497 10.4914 20.5071 9.73311L24.4181 7.53815C24.6975 7.37852 25.0566 7.41843 25.2562 7.69779C25.4557 7.93724 25.4158 8.29641 25.1764 8.53586L21.1057 12.6065L21.6245 13.0854L26.1342 9.37394C26.3736 9.1744 26.7727 9.2143 26.9722 9.41385C27.2117 9.6533 27.2516 10.0524 27.0521 10.2918L23.3406 14.8015L23.8195 15.3203L27.8901 11.2496C28.1296 11.0102 28.4888 10.9703 28.7282 11.1698Z" fill="#DDFB24"/></svg>,
  },
  explore: {
    default: <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29.9927 14.9598C30.3211 14.9598 30.6495 15.279 30.6495 15.5983C30.6495 15.9575 30.3211 16.2368 29.9927 16.2368H29.3359V19.4295C29.3359 20.507 28.4329 21.3451 27.3656 21.3451H26.0521C25.8058 21.3451 25.6005 21.3052 25.3953 21.2653V21.9836C25.3953 23.0612 24.4922 23.8992 23.425 23.8992H22.1114C21.0031 23.8992 20.1411 23.0612 20.1411 21.9836V16.2368H14.8869V21.9836C14.8869 23.0612 13.9838 23.8992 12.9165 23.8992H11.603C10.4947 23.8992 9.63264 23.0612 9.63264 21.9836V21.2653C9.42739 21.3052 9.1811 21.3451 8.97586 21.3451H7.6623C6.55399 21.3451 5.69197 20.507 5.69197 19.4295V16.2368H5.0352C4.66576 16.2368 4.37842 15.9575 4.37842 15.5983C4.37842 15.279 4.66576 14.9598 5.0352 14.9598H5.69197V11.7671C5.69197 10.7295 6.55399 9.8515 7.6623 9.8515H8.97586C9.1811 9.8515 9.42739 9.93131 9.63264 9.97122V9.21296C9.63264 8.17535 10.4947 7.29736 11.603 7.29736H12.9165C13.9838 7.29736 14.8869 8.17535 14.8869 9.21296V14.9598H20.1411V9.21296C20.1411 8.17535 21.0031 7.29736 22.1114 7.29736H23.425C24.4922 7.29736 25.3953 8.17535 25.3953 9.21296V9.97122C25.6005 9.93131 25.8058 9.8515 26.0521 9.8515H27.3656C28.4329 9.8515 29.3359 10.7295 29.3359 11.7671V14.9598H29.9927ZM9.63264 19.4295V11.7671C9.63264 11.4478 9.30425 11.1286 8.97586 11.1286H7.6623C7.29287 11.1286 7.00553 11.4478 7.00553 11.7671V19.4295C7.00553 19.7887 7.29287 20.068 7.6623 20.068H8.97586C9.30425 20.068 9.63264 19.7887 9.63264 19.4295ZM13.5733 21.9836V9.21296C13.5733 8.8937 13.2449 8.57443 12.9165 8.57443H11.603C11.2335 8.57443 10.9462 8.8937 10.9462 9.21296V21.9836C10.9462 22.3428 11.2335 22.6222 11.603 22.6222H12.9165C13.2449 22.6222 13.5733 22.3428 13.5733 21.9836ZM24.0817 21.9836V9.21296C24.0817 8.8937 23.7533 8.57443 23.425 8.57443H22.1114C21.742 8.57443 21.4546 8.8937 21.4546 9.21296V21.9836C21.4546 22.3428 21.742 22.6222 22.1114 22.6222H23.425C23.7533 22.6222 24.0817 22.3428 24.0817 21.9836ZM28.0224 19.4295V11.7671C28.0224 11.4478 27.694 11.1286 27.3656 11.1286H26.0521C25.6826 11.1286 25.3953 11.4478 25.3953 11.7671V19.4295C25.3953 19.7887 25.6826 20.068 26.0521 20.068H27.3656C27.694 20.068 28.0224 19.7887 28.0224 19.4295Z" fill="#656565"/></svg>,
    active: <svg width="36" height="35" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.89376 11.2496C9.41257 11.2496 9.85156 11.6886 9.85156 12.2074V23.0625C9.85156 23.6212 9.41257 24.0203 8.89376 24.0203H6.97816C6.41944 24.0203 6.02036 23.6212 6.02036 23.0625V18.912C5.30201 18.912 4.74329 18.3533 4.74329 17.635C4.74329 16.9565 5.30201 16.3579 6.02036 16.3579V12.2074C6.02036 11.6886 6.41944 11.2496 6.97816 11.2496H8.89376ZM22.9415 8.6955C23.4603 8.6955 23.8993 9.13449 23.8993 9.6533V25.6166C23.8993 26.1753 23.4603 26.5744 22.9415 26.5744H21.0259C20.4672 26.5744 20.0681 26.1753 20.0681 25.6166V18.912H14.9598V25.6166C14.9598 26.1753 14.5208 26.5744 14.002 26.5744H12.0864C11.5277 26.5744 11.1286 26.1753 11.1286 25.6166V9.6533C11.1286 9.13449 11.5277 8.6955 12.0864 8.6955H14.002C14.5208 8.6955 14.9598 9.13449 14.9598 9.6533V16.3579H20.0681V9.6533C20.0681 9.13449 20.4672 8.6955 21.0259 8.6955H22.9415ZM29.0076 16.3579C29.686 16.3579 30.2846 16.9565 30.2846 17.635C30.2846 18.3533 29.686 18.912 29.0076 18.912V23.0625C29.0076 23.6212 28.5686 24.0203 28.0498 24.0203H26.1342C25.5754 24.0203 25.1764 23.6212 25.1764 23.0625V12.2074C25.1764 11.6886 25.5754 11.2496 26.1342 11.2496H28.0498C28.5686 11.2496 29.0076 11.6886 29.0076 12.2074V16.3579Z" fill="#DDFB24"/></svg>,
  },
};

function Nav({ tab, setTab, setViewDay, setDetailWorkout }) {
  const items = ["home", "nutrition", "explore"];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430,
      padding: "12px 20px 28px", display: "flex", justifyContent: "center",
      background: "linear-gradient(transparent 0%, #090903 35%)", zIndex: 50 }}>
      <div style={{ background: "#141414", border: "1px solid #302F2F", borderRadius: 100, padding: 8,
        display: "flex", gap: 12, alignItems: "center",
        boxShadow: "0 4px 8px rgba(221,251,36,0.08), 0 2px 4px rgba(221,251,36,0.04)" }}>
        {items.map(id => {
          const on = tab === id;
          return (
            <button key={id} onClick={() => { setTab(id); setViewDay(null); setDetailWorkout(null); }}
              style={{ width: 56, height: 56, borderRadius: 100, border: "none",
                background: on ? "rgba(255,255,255,0.1)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
              {on ? NAV_ICONS[id].active : NAV_ICONS[id].default}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const S = {
  wrap: { background: "#090903", minHeight: "100vh", maxWidth: 430, margin: "0 auto", fontFamily: "'DM Sans',sans-serif", color: "#fff", WebkitFontSmoothing: "antialiased" },
  h2: { fontSize: 28, fontWeight: 700, lineHeight: 1.3, margin: 0 },
  h3: { fontSize: 24, fontWeight: 700, lineHeight: 1.35, margin: 0 },
  h4: { fontSize: 20, fontWeight: 700, lineHeight: 1.3, margin: 0 },
  h5: { fontSize: 16, fontWeight: 700, lineHeight: 1.35, margin: 0 },
  md: { fontSize: 16, lineHeight: 1.4, margin: 0 },
  sm: { fontSize: 14, lineHeight: 1.4, margin: 0 },
  xs: { fontSize: 12, lineHeight: 1.4, margin: 0 },
  // Figma: Gradients/Card Fill + Card Stroke, 24px radius, 12px backdrop blur.
  card: { background: "linear-gradient(180deg,#141414 0%,#0a0707 100%)", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 24, backdropFilter: "blur(12px)" },
  pill: { background: "rgba(245,245,245,0.05)", borderRadius: 40, padding: "4px 10px", fontSize: 12, color: "#fff", backdropFilter: "blur(8px)" },
  chip: { background: "rgba(255,255,255,0.05)", border: "1px solid #525252", borderRadius: 40, padding: "8px 12px", color: "#8C8C8C", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 44 },
  chipOn: { background: "#DDFB24", border: "1px solid #DDFB24", color: "#000" },
  btnPrimary: { background: "linear-gradient(180deg,rgba(108,108,108,0.15),rgba(255,255,255,0)),#DDFB24", color: "#000", border: "1px solid rgba(255,255,255,0.56)", borderRadius: 12, padding: "11px 20px", fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", width: "100%", boxShadow: "0 1px 2px rgba(55,62,13,0.5), 0 0 0 2px #5c6713" },
  btnText: { background: "none", border: "none", color: "#8C8C8C", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14 },
  authLabel: { display: "flex", flexDirection: "column", gap: 7, color: "#ADADAD", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" },
  authInput: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid #302F2F", borderRadius: 12, padding: "12px 14px", color: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 14 },
  startBtn: { display: "inline-flex", alignItems: "center", gap: 4, background: "#DDFB24", color: "#000", borderRadius: 12, padding: "8px 8px 8px 14px", fontSize: 12, fontWeight: 600 },
  startIcon: { background: "#000", borderRadius: 100, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  btnBack: { display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#DDFB24", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0" },
};

if (typeof document !== "undefined" && !document.getElementById("dms")) {
  const l = document.createElement("link"); l.id = "dms"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
  // Hide all scrollbars globally
  const s = document.createElement("style"); s.id = "hide-scrollbars";
  s.textContent = "::-webkit-scrollbar{display:none}*{-ms-overflow-style:none;scrollbar-width:none;}";
  document.head.appendChild(s);
}
