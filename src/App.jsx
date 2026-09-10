import { useState, useEffect } from "react";

// ─── 4-WEEK PROGRESSIVE WORKOUTS ──────────────────────────────────────────
// Goals: grow glutes, lose weight, keep arms AND shoulders small
// Split: MWF lower body, TTh back/rear delts/core (no arm isolation, minimal shoulder pressing)
// Progresses each week, cycles every 4 weeks

const WEEK_LABELS = ["Base", "Build", "Peak", "Deload"];

const WORKOUTS = {
  // ─── DAY 1: MONDAY — GLUTES & HAMSTRINGS (HEAVY) ───
  day1: [
    [ // Week 1
      { name: "Barbell Hip Thrust", sets: "4×10", notes: "Pause 2s at top. Find your working weight." },
      { name: "Romanian Deadlift (BB)", sets: "4×12", notes: "Hinge at hips, feel hamstrings stretch." },
      { name: "Bulgarian Split Squat (DB)", sets: "3×10 ea", notes: "Lean forward slightly for glute bias." },
      { name: "Cable Kickback", sets: "3×12 ea", notes: "Squeeze at top, slow on the way down." },
      { name: "Lying Hamstring Curl", sets: "3×12", notes: "Control the negative." },
      { name: "Hip Abductor Machine", sets: "3×15", notes: "Lean forward for upper glute." },
      { name: "Incline Walk", sets: "15 min", notes: "10-12% grade, 3.0-3.5 mph" },
    ],
    [ // Week 2
      { name: "Barbell Hip Thrust", sets: "4×10", notes: "Add 5 lbs from last week." },
      { name: "Romanian Deadlift (BB)", sets: "4×12", notes: "+5 lbs or add 1 rep per set." },
      { name: "Bulgarian Split Squat (DB)", sets: "3×12 ea", notes: "+2 reps per leg vs week 1." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "+3 reps vs week 1. Same weight." },
      { name: "Lying Hamstring Curl", sets: "3×15", notes: "+3 reps. Control the eccentric." },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "+5 reps. Push through the burn." },
      { name: "Incline Walk", sets: "15 min", notes: "12% grade, 3.5 mph" },
    ],
    [ // Week 3 — Peak
      { name: "Barbell Hip Thrust", sets: "5×8", notes: "Add a 5th set. Heaviest weight yet." },
      { name: "Romanian Deadlift (BB)", sets: "4×10", notes: "Heavier weight, fewer reps." },
      { name: "Bulgarian Split Squat (DB)", sets: "4×10 ea", notes: "Add a 4th set this week." },
      { name: "Single-Leg Hip Thrust", sets: "3×10 ea", notes: "New! Bodyweight or light plate." },
      { name: "Lying Hamstring Curl", sets: "4×12", notes: "Extra set, drop set on the last." },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "Heavy. Lean forward hard." },
      { name: "Incline Walk", sets: "15 min", notes: "12-15% grade — push it." },
    ],
    [ // Week 4 — Deload
      { name: "Barbell Hip Thrust", sets: "3×12", notes: "60% of week 3 weight. Focus on squeeze." },
      { name: "Romanian Deadlift (DB)", sets: "3×12", notes: "Dumbbells, lighter. Perfect your hinge." },
      { name: "Bodyweight Walking Lunge", sets: "3×12 ea", notes: "Long strides, no weight needed." },
      { name: "Banded Glute Bridge", sets: "3×15", notes: "Band above knees. Mind-muscle." },
      { name: "Lying Hamstring Curl", sets: "2×15", notes: "Light. Blood flow only." },
      { name: "Hip Abductor Machine", sets: "2×15", notes: "Light. Recovery week." },
      { name: "Incline Walk", sets: "20 min", notes: "10% grade, easy pace. Enjoy it." },
    ],
  ],

  // ─── DAY 2: TUESDAY — BACK & REAR DELTS ───
  day2: [
    [ // Week 1
      { name: "Lat Pulldown (wide)", sets: "3×12", notes: "Squeeze lats, don't yank with arms." },
      { name: "Seated Cable Row", sets: "3×12", notes: "Pull to lower chest, squeeze blades." },
      { name: "Face Pulls", sets: "3×15", notes: "Light weight, high reps, rear delts." },
      { name: "Single-Arm DB Row", sets: "3×12 ea", notes: "Moderate weight. Feel your back work." },
      { name: "Reverse Pec Deck", sets: "3×15", notes: "Rear delts and upper back." },
      { name: "Plank Hold", sets: "3×30s", notes: "Tight core, don't sag." },
      { name: "Incline Walk", sets: "10 min", notes: "10-12% grade, 3.0-3.5 mph" },
    ],
    [ // Week 2
      { name: "Lat Pulldown (wide)", sets: "3×15", notes: "+3 reps. Same weight as week 1." },
      { name: "Seated Cable Row", sets: "3×15", notes: "+3 reps. Full retraction each rep." },
      { name: "Face Pulls", sets: "3×20", notes: "+5 reps. External rotate at the end." },
      { name: "Single-Arm DB Row", sets: "3×12 ea", notes: "Add 2.5-5 lbs." },
      { name: "Reverse DB Fly", sets: "3×12", notes: "Swap from machine. 8-10 lb DBs." },
      { name: "Dead Bug", sets: "3×10 ea", notes: "Core stability. Press back into floor." },
      { name: "Incline Walk", sets: "10 min", notes: "12% grade, 3.5 mph" },
    ],
    [ // Week 3 — Peak
      { name: "Lat Pulldown (neutral grip)", sets: "4×12", notes: "Add a set + different grip angle." },
      { name: "Seated Cable Row", sets: "4×12", notes: "Heavier than week 2. 4 sets." },
      { name: "Face Pulls", sets: "4×15", notes: "Extra set. Rear delt focus." },
      { name: "Single-Arm DB Row", sets: "3×15 ea", notes: "Same weight, more reps." },
      { name: "Straight-Arm Pulldown", sets: "3×12", notes: "New! Lat isolation, no bicep." },
      { name: "Plank Hold", sets: "3×45s", notes: "+15s vs week 1. Don't forget to breathe." },
      { name: "Incline Walk", sets: "10 min", notes: "12-15% grade." },
    ],
    [ // Week 4 — Deload
      { name: "Lat Pulldown (wide)", sets: "2×15", notes: "Light. Feel the stretch." },
      { name: "Seated Cable Row", sets: "2×15", notes: "Light. Focus on form." },
      { name: "Face Pulls", sets: "3×15", notes: "Same as week 1. Just maintain." },
      { name: "DB Pullover", sets: "3×12", notes: "Light DB. Feel lats stretch overhead." },
      { name: "Reverse DB Fly", sets: "2×12", notes: "8 lbs. Easy." },
      { name: "Dead Bug", sets: "3×8 ea", notes: "Slow and controlled." },
      { name: "Incline Walk", sets: "15 min", notes: "Easy pace. Recovery." },
    ],
  ],

  // ─── DAY 3: WEDNESDAY — QUADS & GLUTES ───
  day3: [
    [ // Week 1
      { name: "Barbell Squat", sets: "4×10", notes: "Below parallel. Wide stance = more glute." },
      { name: "Leg Press (high & wide)", sets: "4×12", notes: "Feet high on platform for glute bias." },
      { name: "Walking Lunges (DB)", sets: "3×12 ea", notes: "Long stride, lean slightly forward." },
      { name: "Leg Extension", sets: "3×15", notes: "Quad isolation — light, controlled." },
      { name: "Cable Pull-Through", sets: "3×15", notes: "Glute squeeze at top." },
      { name: "Hip Abductor Machine", sets: "2×20", notes: "Burnout to finish." },
      { name: "Incline Walk", sets: "15 min", notes: "10-12% grade, 3.0-3.5 mph" },
    ],
    [ // Week 2
      { name: "Barbell Squat", sets: "4×12", notes: "+2 reps per set. Same weight." },
      { name: "Leg Press (high & wide)", sets: "4×15", notes: "+3 reps. Push through." },
      { name: "Walking Lunges (DB)", sets: "3×15 ea", notes: "+3 reps per leg." },
      { name: "Leg Extension", sets: "3×15", notes: "Add 5 lbs from week 1." },
      { name: "Cable Pull-Through", sets: "3×15", notes: "Hold squeeze for 2 sec." },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "Add a 3rd set." },
      { name: "Incline Walk", sets: "15 min", notes: "12% grade, 3.5 mph" },
    ],
    [ // Week 3 — Peak
      { name: "Barbell Squat", sets: "5×8", notes: "5th set! Heavier weight, fewer reps." },
      { name: "Leg Press (high & wide)", sets: "4×15", notes: "Add weight. Push hard." },
      { name: "Reverse Lunge (DB)", sets: "3×12 ea", notes: "Swap from walking. More glute focus." },
      { name: "Goblet Squat (deep)", sets: "3×15", notes: "New! ATG for quad/glute stretch." },
      { name: "Cable Pull-Through", sets: "3×15", notes: "Heaviest cable setting yet." },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "Heavy. Lean forward." },
      { name: "Incline Walk", sets: "15 min", notes: "12-15% grade — push it." },
    ],
    [ // Week 4 — Deload
      { name: "Goblet Squat", sets: "3×12", notes: "Light DB. Depth over weight." },
      { name: "Leg Press (high & wide)", sets: "3×15", notes: "60% of week 3 weight." },
      { name: "Bodyweight Lunges", sets: "3×10 ea", notes: "No weight. Focus on balance." },
      { name: "Leg Extension", sets: "2×15", notes: "Light. Blood flow." },
      { name: "Banded Glute Bridge", sets: "3×20", notes: "Band above knees." },
      { name: "Hip Abductor Machine", sets: "2×15", notes: "Easy. Recovery." },
      { name: "Incline Walk", sets: "20 min", notes: "Easy pace. Enjoy it." },
    ],
  ],

  // ─── DAY 4: THURSDAY — BACK & POSTURE (light shoulders, no pressing) ───
  day4: [
    [ // Week 1
      { name: "Lat Pulldown (neutral)", sets: "3×12", notes: "Different grip than Tuesday." },
      { name: "DB Lateral Raise (light)", sets: "3×15", notes: "8-10 lbs MAX. Shape only." },
      { name: "Cable Face Pull", sets: "3×15", notes: "Rear delt focus. Elbows high." },
      { name: "Straight-Arm Pulldown", sets: "3×12", notes: "Lat isolation without bicep." },
      { name: "Reverse Pec Deck", sets: "3×15", notes: "Upper back and rear delts." },
      { name: "Dead Bug", sets: "3×10 ea", notes: "Core stability. Slow." },
      { name: "Incline Walk", sets: "10 min", notes: "10-12% grade, 3.0-3.5 mph" },
    ],
    [ // Week 2
      { name: "Lat Pulldown (neutral)", sets: "3×15", notes: "+3 reps. Same weight." },
      { name: "DB Lateral Raise (light)", sets: "3×18", notes: "Same 8-10 lbs. More reps only." },
      { name: "Cable Face Pull", sets: "3×20", notes: "+5 reps. Hold the squeeze." },
      { name: "Straight-Arm Pulldown", sets: "3×15", notes: "+3 reps." },
      { name: "Reverse DB Fly", sets: "3×12", notes: "Swap from machine. 8-10 lb DBs." },
      { name: "Plank Hold", sets: "3×40s", notes: "Core work. Tight and still." },
      { name: "Incline Walk", sets: "10 min", notes: "12% grade, 3.5 mph" },
    ],
    [ // Week 3 — Peak
      { name: "Lat Pulldown (wide)", sets: "4×12", notes: "Extra set. Wide grip." },
      { name: "DB Lateral Raise (light)", sets: "4×15", notes: "Extra set. Still 8-10 lbs." },
      { name: "Cable Face Pull", sets: "4×15", notes: "4 sets this week." },
      { name: "Single-Arm Cable Row", sets: "3×12 ea", notes: "New! Unilateral back work." },
      { name: "Reverse Pec Deck", sets: "3×15", notes: "Rear delt burnout." },
      { name: "Dead Bug", sets: "3×12 ea", notes: "+2 reps per side vs week 1." },
      { name: "Incline Walk", sets: "10 min", notes: "12-15% grade." },
    ],
    [ // Week 4 — Deload
      { name: "Lat Pulldown (neutral)", sets: "2×15", notes: "Light. Stretch at top." },
      { name: "DB Lateral Raise (light)", sets: "2×15", notes: "5-8 lbs. Easy." },
      { name: "Cable Face Pull", sets: "3×12", notes: "Light. Maintain form." },
      { name: "DB Pullover", sets: "3×12", notes: "Feel lats stretch overhead." },
      { name: "Reverse DB Fly", sets: "2×12", notes: "Light. Posture work." },
      { name: "Plank Hold", sets: "3×30s", notes: "Easy. Recovery week." },
      { name: "Incline Walk", sets: "15 min", notes: "Easy pace." },
    ],
  ],

  // ─── DAY 5: FRIDAY — GLUTE BURNOUT & POSTERIOR CHAIN ───
  day5: [
    [ // Week 1
      { name: "Hip Thrust (lighter)", sets: "4×15", notes: "Lighter than Monday. Chase the burn." },
      { name: "Sumo Deadlift", sets: "3×12", notes: "Wide stance, squeeze glutes at lockout." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "Superset with abductors ↓" },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "↑ Superset with kickbacks." },
      { name: "Banded Glute Bridge", sets: "3×20", notes: "Band above knees, push knees out." },
      { name: "Back Extension (glute)", sets: "3×15", notes: "Round upper back, glutes drive you up." },
      { name: "Single-Leg RDL (DB)", sets: "3×12 ea", notes: "Balance + glute/hamstring." },
      { name: "Incline Walk", sets: "15 min", notes: "12-15% grade — push it!" },
    ],
    [ // Week 2
      { name: "Hip Thrust (lighter)", sets: "4×20", notes: "+5 reps per set. Same weight." },
      { name: "Sumo Deadlift", sets: "3×15", notes: "+3 reps. Squeeze hard." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "Add 5 lbs. Superset ↓" },
      { name: "Hip Abductor Machine", sets: "3×20", notes: "↑ Superset. Add weight." },
      { name: "Banded Glute Bridge", sets: "3×25", notes: "+5 reps. Thicker band if easy." },
      { name: "Back Extension (glute)", sets: "3×15", notes: "Hold a plate at chest." },
      { name: "Single-Leg RDL (DB)", sets: "3×12 ea", notes: "Add 2.5-5 lbs." },
      { name: "Incline Walk", sets: "15 min", notes: "15% grade." },
    ],
    [ // Week 3 — Peak
      { name: "Hip Thrust (moderate)", sets: "5×12", notes: "5 sets! More weight than wk1-2." },
      { name: "Sumo Deadlift", sets: "4×10", notes: "Extra set. Heavier." },
      { name: "Cable Kickback", sets: "3×15 ea", notes: "Heaviest cable yet. Superset ↓" },
      { name: "Hip Abductor Machine", sets: "3×25", notes: "↑ Superset. Heavy." },
      { name: "Frog Pump", sets: "3×20", notes: "New! Feet together, knees out. Squeeze." },
      { name: "Back Extension (glute)", sets: "4×12", notes: "Heavier plate. Extra set." },
      { name: "Single-Leg RDL (DB)", sets: "3×15 ea", notes: "+3 reps. Same weight." },
      { name: "Incline Walk", sets: "15 min", notes: "15% grade — finish strong!" },
    ],
    [ // Week 4 — Deload
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
  0: { type: null, label: "Rest Day", emoji: "😴", msg: "Full rest. You earned it." },
  1: { type: "day1", label: "Glutes & Hamstrings", emoji: "🍑", tag: "Heavy" },
  2: { type: "day2", label: "Back & Rear Delts", emoji: "💪", tag: "Upper A" },
  3: { type: "day3", label: "Quads & Glutes", emoji: "🦵", tag: "Moderate-High" },
  4: { type: "day4", label: "Back & Posture", emoji: "🎯", tag: "Upper B" },
  5: { type: "day5", label: "Glute Burnout", emoji: "🔥", tag: "Volume" },
  6: { type: null, label: "Active Recovery", emoji: "🧘", msg: "Walk, stretch, or yoga. Move gently." },
};

// ─── KETO MEALS ───────────────────────────────────────────────────────────
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

// ─── ICONS (matching Figma) ───────────────────────────────────────────────
const I = {
  home: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10.5z"/><path d="M9 22V14h6v8"/></svg>,
  nutrition: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/></svg>,
  community: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  right: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  down: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
};

// ─── APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [viewDay, setViewDay] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [completed, setCompleted] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const dow = now.getDay();
  const activeDay = viewDay !== null ? viewDay : dow;
  const dc = DAY_CONFIG[activeDay];
  const dateKey = now.toISOString().split("T")[0];
  const donesToday = completed[dateKey] || [];

  // Week calc: cycles 1-4 based on start date
  const getWeek = () => {
    if (!startDate) return 0;
    const diff = Math.floor((now - new Date(startDate)) / 86400000);
    return Math.max(0, Math.min(3, Math.floor(diff / 7) % 4));
  };
  const weekIdx = getWeek();
  const exercises = dc.type ? (WORKOUTS[dc.type]?.[weekIdx] || []) : [];
  const pct = exercises.length > 0 ? Math.round((donesToday.length / exercises.length) * 100) : 0;

  useEffect(() => {
    try {
      const done = localStorage.getItem("m:done");
      if (done) setCompleted(JSON.parse(done));
      const start = localStorage.getItem("m:start");
      if (start) setStartDate(start);
    } catch {}
    setLoading(false);
  }, []);

  const toggle = (idx) => {
    const u = { ...completed };
    const d = u[dateKey] || [];
    u[dateKey] = d.includes(idx) ? d.filter(i => i !== idx) : [...d, idx];
    setCompleted(u);
    try { localStorage.setItem("m:done", JSON.stringify(u)); } catch {}
  };

  const begin = () => {
    setStartDate(dateKey);
    try { localStorage.setItem("m:start", dateKey); } catch {}
  };

  if (loading) return <div style={S.wrap}><p style={{ color: "#DDFB24", textAlign: "center", paddingTop: "45vh" }}>Loading...</p></div>;

  // ── ONBOARDING ──
  if (!startDate) return (
    <div style={S.wrap}>
      <div style={{ padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
        <div style={{ fontSize: 56 }}>⚡</div>
        <h1 style={{ ...S.h2, margin: 0 }}>Momentum</h1>
        <p style={{ ...S.sm, color: "#ADADAD", maxWidth: 280 }}>Glute-focused workouts + keto meals, personalized for you. Ready every day you open it.</p>
        <button style={S.btnPrimary} onClick={begin}>Let's Go</button>
      </div>
    </div>
  );

  // ── NUTRITION TAB ──
  if (tab === "nutrition") {
    const meals = MEALS[activeDay] || MEALS[0];
    return (
      <div style={S.wrap}>
        <div style={{ padding: "24px 16px 12px" }}>
          <h1 style={S.h2}>Meal Plan</h1>
          <p style={{ ...S.xs, color: "#8C8C8C", marginTop: 4 }}>Keto · ~1,500 cal · 120g protein · &lt;25g carbs</p>
        </div>
        <div style={{ padding: "4px 16px 12px", display: "flex", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {[0,1,2,3,4,5,6].map(d => (
            <button key={d} onClick={() => { setViewDay(d); setExpandedMeal(null); }}
              style={{ ...S.chip, ...(activeDay === d ? S.chipOn : {}), flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1 }}>{DAYS[d]}</span>
              {d === dow && <span style={{ width: 4, height: 4, borderRadius: 2, background: activeDay === d ? "#DDFB24" : "#656565" }} />}
            </button>
          ))}
        </div>
        <div style={{ padding: "8px 16px" }}>
          <h3 style={{ ...S.h5, marginBottom: 4 }}>{DAYS_FULL[activeDay]}</h3>
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
        <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} />
      </div>
    );
  }

  // ── COMMUNITY TAB (placeholder) ──
  if (tab === "community") return (
    <div style={S.wrap}>
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>👥</div>
        <h2 style={{ ...S.h3, marginTop: 16 }}>Community</h2>
        <p style={{ ...S.sm, color: "#ADADAD", marginTop: 8 }}>Coming soon. This is where challenges and friends will live.</p>
      </div>
      <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} />
    </div>
  );

  // ── WORKOUT DETAIL (when a day is tapped) ──
  if (viewDay !== null && exercises.length > 0) {
    const isToday = viewDay === dow;
    return (
      <div style={S.wrap}>
        <div style={{ padding: "16px" }}>
          <button onClick={() => setViewDay(null)} style={S.btnBack}>{I.back} Back</button>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{dc.tag}</span>
              <span style={{ ...S.xs, color: "#302F2F" }}>·</span>
              <span style={{ ...S.xs, color: "#8C8C8C" }}>Week {weekIdx + 1} — {WEEK_LABELS[weekIdx]}</span>
            </div>
            <h1 style={{ ...S.h2, marginTop: 6 }}>{dc.emoji} {dc.label}</h1>
            {isToday && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#DDFB24", borderRadius: 2, transition: "width 0.4s" }} />
                </div>
                <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600 }}>{pct}%</span>
              </div>
            )}
            {!isToday && <p style={{ ...S.xs, color: "#656565", marginTop: 8 }}>Preview — check off exercises on the day</p>}
          </div>

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {exercises.map((ex, idx) => {
              const done = isToday && donesToday.includes(idx);
              return (
                <div key={idx} onClick={() => isToday && toggle(idx)}
                  style={{ ...S.card, padding: "14px 16px", display: "flex", gap: 12, cursor: isToday ? "pointer" : "default",
                    opacity: done ? 0.4 : 1, transition: "opacity 0.3s" }}>
                  {isToday && (
                    <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                      border: done ? "none" : "1.5px solid rgba(255,255,255,0.15)",
                      background: done ? "#DDFB24" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {done && <span style={{ color: "#000" }}>{I.check}</span>}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ ...S.sm, fontWeight: 700, textDecoration: done ? "line-through" : "none" }}>{ex.name}</p>
                    <span style={{ ...S.xs, color: "#DDFB24", marginTop: 3, display: "inline-block" }}>{ex.sets}</span>
                    <p style={{ ...S.xs, color: "#656565", marginTop: 3 }}>{ex.notes}</p>
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
        <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} />
      </div>
    );
  }

  // ── HOME ──
  const todayConf = DAY_CONFIG[dow];
  const todayExercises = todayConf.type ? (WORKOUTS[todayConf.type]?.[weekIdx] || []) : [];

  return (
    <div style={S.wrap}>
      <div style={{ padding: "24px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15 }}>☀️</span>
          <span style={{ ...S.xs, color: "#ADADAD", fontWeight: 600, letterSpacing: 1 }}>{DAYS[dow]}  {now.getDate()} {MONTHS[now.getMonth()]}</span>
        </div>
        <h1 style={{ ...S.h2, marginTop: 8 }}>Let's Crush Today's Goals!</h1>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(221,251,36,0.06)", borderRadius: 20, padding: "5px 14px", marginTop: 10 }}>
          <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 600 }}>Week {weekIdx + 1}: {WEEK_LABELS[weekIdx]}</span>
          <span style={{ ...S.xs, color: "#302F2F" }}>·</span>
          <span style={{ ...S.xs, color: "#8C8C8C" }}>4-week cycle</span>
        </div>
      </div>

      {/* Today's card */}
      <div style={{ padding: "8px 16px" }}>
        {!todayConf.type ? (
          <div style={{ ...S.card, padding: 28, textAlign: "center" }}>
            <div style={{ fontSize: 44 }}>{todayConf.emoji}</div>
            <h3 style={{ ...S.h4, marginTop: 10 }}>{todayConf.label}</h3>
            <p style={{ ...S.sm, color: "#ADADAD", marginTop: 6 }}>{todayConf.msg}</p>
          </div>
        ) : (
          <button onClick={() => setViewDay(dow)}
            style={{ ...S.card, padding: 20, width: "100%", textAlign: "left", cursor: "pointer", border: "1px solid rgba(221,251,36,0.12)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span style={S.pill}>{todayConf.tag}</span>
              <span style={S.pill}>{todayExercises.length} exercises</span>
            </div>
            <h3 style={S.h3}>{todayConf.emoji} {todayConf.label}</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 100, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#DDFB24", borderRadius: 2 }} />
                </div>
                <span style={{ ...S.xs, color: pct === 100 ? "#DDFB24" : "#8C8C8C" }}>{pct === 100 ? "Done!" : `${donesToday.length}/${todayExercises.length}`}</span>
              </div>
              <div style={S.startBtn}>
                <span>{pct > 0 && pct < 100 ? "Continue" : "Start"}</span>
                <span style={S.startIcon}>{I.right}</span>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Week */}
      <div style={{ padding: "16px 16px 0" }}>
        <h3 style={{ ...S.h4, marginBottom: 12 }}>This Week</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[1,2,3,4,5,6,0].map(d => {
            const di = DAY_CONFIG[d];
            const isT = d === dow;
            const has = !!di.type;
            return (
              <button key={d} onClick={() => has && setViewDay(d)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 14,
                  border: isT ? "1px solid rgba(221,251,36,0.15)" : "1px solid transparent",
                  background: isT ? "rgba(221,251,36,0.05)" : "transparent",
                  cursor: has ? "pointer" : "default", width: "100%", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                <span style={{ ...S.xs, color: isT ? "#DDFB24" : "#656565", width: 32, fontWeight: 600 }}>{DAYS[d]}</span>
                <span style={{ fontSize: 14 }}>{di.emoji}</span>
                <span style={{ ...S.sm, color: isT ? "#fff" : "#ADADAD", flex: 1 }}>{di.label}</span>
                {isT && <span style={{ ...S.xs, color: "#DDFB24", fontWeight: 700, fontSize: 10 }}>TODAY</span>}
                {has && !isT && <span style={{ color: "#302F2F" }}>{I.right}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: 120 }} />
      <Nav tab={tab} setTab={setTab} setViewDay={setViewDay} />
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────
function Nav({ tab, setTab, setViewDay }) {
  const items = [
    { id: "home", icon: I.home },
    { id: "nutrition", icon: I.nutrition },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430,
      padding: "12px 20px 28px", display: "flex", justifyContent: "center",
      background: "linear-gradient(transparent 0%, #090903 35%)", zIndex: 50 }}>
      <div style={{ background: "#141414", border: "1px solid #302F2F", borderRadius: 100, padding: 8,
        display: "flex", gap: 12, alignItems: "center",
        boxShadow: "0 4px 8px rgba(221,251,36,0.08), 0 2px 4px rgba(221,251,36,0.04)" }}>
        {items.map(it => {
          const on = tab === it.id;
          return (
            <button key={it.id}
              onClick={() => { setTab(it.id); setViewDay(null); }}
              style={{ width: 56, height: 56, borderRadius: 100, border: "none",
                background: on ? "rgba(255,255,255,0.1)" : "transparent",
                color: on ? "#DDFB24" : "#656565",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
              {it.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────
const S = {
  wrap: { background: "#090903", minHeight: "100vh", maxWidth: 430, margin: "0 auto", fontFamily: "'DM Sans',sans-serif", color: "#fff", WebkitFontSmoothing: "antialiased" },
  h2: { fontSize: 28, fontWeight: 700, lineHeight: 1.3, margin: 0 },
  h3: { fontSize: 24, fontWeight: 700, lineHeight: 1.35, margin: 0 },
  h4: { fontSize: 20, fontWeight: 700, lineHeight: 1.3, margin: 0 },
  h5: { fontSize: 16, fontWeight: 700, lineHeight: 1.35, margin: 0 },
  md: { fontSize: 16, lineHeight: 1.4, margin: 0 },
  sm: { fontSize: 14, lineHeight: 1.4, margin: 0 },
  xs: { fontSize: 12, lineHeight: 1.4, margin: 0 },
  card: { background: "linear-gradient(180deg,#141414,#0a0707)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 24 },
  pill: { background: "rgba(245,245,245,0.05)", borderRadius: 40, padding: "4px 10px", fontSize: 12, color: "#fff" },
  chip: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 12px", color: "#8C8C8C",
    cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 44 },
  chipOn: { background: "rgba(221,251,36,0.08)", border: "1px solid rgba(221,251,36,0.25)", color: "#DDFB24" },
  btnPrimary: { background: "#DDFB24", color: "#000", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", width: "100%" },
  startBtn: { display: "inline-flex", alignItems: "center", gap: 4, background: "#DDFB24", color: "#000", borderRadius: 12, padding: "8px 8px 8px 14px", fontSize: 12, fontWeight: 600 },
  startIcon: { background: "#000", borderRadius: 100, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  btnBack: { display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#DDFB24", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0" },
};

if (typeof document !== "undefined" && !document.getElementById("dms")) {
  const l = document.createElement("link"); l.id = "dms"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}
