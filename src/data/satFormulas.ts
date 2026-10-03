export type FormulaDifficulty = 'foundations' | 'medium' | 'advanced';

export type FormulaDomain = 'algebra' | 'problem-solving' | 'advanced-math' | 'geometry-trig';

export interface SATFormulaItem {
  id: string;
  name: string;
  domain: FormulaDomain;
  domainTitle: string;
  units: string;
  difficulty: FormulaDifficulty;
  difficultyBadge: 'Foundations' | 'Medium' | 'Advanced';
  difficultyWeight: number; // 1 = Foundations, 2 = Medium, 3 = Advanced
  formula: string;
  displayFormula: string;
  meaning: string;
  whyDifficultyDiffers: string;
  tierBreakdown: {
    foundations: string;
    medium: string;
    advanced: string;
  };
  satExample: {
    question: string;
    answer: string;
    proTip: string;
  };
  desmosShortcut: string;
  trapWarning: string;
}

export interface FormulaDomainCategory {
  id: FormulaDomain;
  title: string;
  units: string;
  badgeColor: string;
  summary: string;
  totalFormulas: number;
}

export const FORMULA_DOMAINS: FormulaDomainCategory[] = [
  {
    id: 'algebra',
    title: 'Algebra',
    units: 'Units 2, 6, 10',
    badgeColor: 'from-blue-600 to-sky-700',
    summary: 'Linear equations, slopes, systems, and inequalities across single-step and parametric tiers.',
    totalFormulas: 5,
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving & Data Analysis',
    units: 'Units 3, 7, 11',
    badgeColor: 'from-amber-600 to-yellow-600',
    summary: 'Ratios, percent changes, statistics, probability, and linear vs. exponential rates of growth.',
    totalFormulas: 7,
  },
  {
    id: 'advanced-math',
    title: 'Advanced Math',
    units: 'Units 4, 8, 12',
    badgeColor: 'from-purple-600 to-indigo-700',
    summary: 'Quadratics, parabolas, vertex forms, exponent rules, and polynomial root behavior.',
    totalFormulas: 5,
  },
  {
    id: 'geometry-trig',
    title: 'Geometry & Trigonometry',
    units: 'Units 5, 9, 13',
    badgeColor: 'from-emerald-600 to-teal-700',
    summary: 'Circles, right triangles, 3D volumes, SOH-CAH-TOA, radian arcs, and completing the square.',
    totalFormulas: 9,
  },
];

export const SAT_FORMULAS_DATA: SATFormulaItem[] = [
  // =========================================================================
  // CHAPTER 1: ALGEBRA (Units 2, 6, 10)
  // =========================================================================
  {
    id: 'alg-slope',
    name: 'Slope',
    domain: 'algebra',
    domainTitle: 'Algebra (Units 2, 6, 10)',
    units: 'Units 2, 6, 10',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'm = (y₂-y₁)/(x₂-x₁)',
    displayFormula: 'm = (y₂-y₁)/(x₂-x₁)',
    meaning: 'Measures the rate of change or steepness between any two coordinate points on a line.',
    whyDifficultyDiffers: 'In Foundations, two coordinates are explicitly given. In Medium, you solve backwards for a missing coordinate. In Hard, slope is tied to perpendicular slopes (-1/m) or parametric constants k.',
    tierBreakdown: {
      foundations: 'Direct points given e.g. (2, 5) and (6, 13). Calculate m = (13 - 5)/(6 - 2) = 8/4 = 2 in one step.',
      medium: 'Slope is given as -3/4 through (k, 7) and (2, -1). Work backwards: (-1 - 7)/(2 - k) = -3/4 to solve for k.',
      advanced: 'Line l is perpendicular to line k. Equation of line k has constants: ax + by = c. Find the slope of line l in terms of a and b.'
    },
    satExample: {
      question: 'A line passes through (3, 2k) and (7, 10) with slope 1/2. What is the value of k?',
      answer: 'k = 4. Set (10 - 2k)/(7 - 3) = 1/2 → 10 - 2k = 2 → 2k = 8 → k = 4.',
      proTip: 'In Desmos, type the table or type (10 - 2k)/(7 - 3) = 1/2 directly to see the vertical line at k = 4.'
    },
    desmosShortcut: 'Type both points into a Desmos table (x₁, y₁) or type the equation with variable k; Desmos draws a vertical line at the exact answer.',
    trapWarning: 'Subtracting coordinates in reverse order: (y₂ - y₁) / (x₁ - x₂) will give you the opposite sign.'
  },
  {
    id: 'alg-slope-intercept',
    name: 'Slope-intercept form',
    domain: 'algebra',
    domainTitle: 'Algebra (Units 2, 6, 10)',
    units: 'Units 2, 6, 10',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'y = mx + b',
    displayFormula: 'y = mx + b',
    meaning: 'm = slope, b = y-intercept (where the line crosses the y-axis).',
    whyDifficultyDiffers: 'In Foundations, m and b are read straight off a graph. In Medium, word problems hide b as a flat fee and m as a per-hour rate. In Hard, you must manipulate standard form Ax + By = C into y = (-A/B)x + (C/B).',
    tierBreakdown: {
      foundations: 'Graph shows line crossing y-axis at (0, 4) rising 3 for every 1 unit right. Equation is y = 3x + 4.',
      medium: 'A plumber charges a $75 consultation fee plus $45 per hour. Model cost C for h hours: C = 45h + 75.',
      advanced: 'Convert 4x - 6y = 15 into slope-intercept form to find the y-intercept: y = (2/3)x - 2.5. Intercept is (0, -2.5).'
    },
    satExample: {
      question: 'In the equation 3x - 5y = 20, what is the slope and the y-intercept of the line?',
      answer: 'Slope m = 3/5, y-intercept = (0, -4). Rewrite as -5y = -3x + 20 → y = (3/5)x - 4.',
      proTip: 'For any Ax + By = C line: Slope is always -A/B, and y-intercept is always C/B.'
    },
    desmosShortcut: 'Type 3x - 5y = 20 into Desmos directly. Click the grey dot on the y-axis to read (0, -4) instantly.',
    trapWarning: 'Forgetting to divide C by B, or confusing the x-intercept with the y-intercept.'
  },
  {
    id: 'alg-point-slope',
    name: 'Point-slope form',
    domain: 'algebra',
    domainTitle: 'Algebra (Units 2, 6, 10)',
    units: 'Units 2, 6, 10',
    difficulty: 'medium',
    difficultyBadge: 'Medium',
    difficultyWeight: 2,
    formula: 'y - y₁ = m(x - x₁)',
    displayFormula: 'y - y₁ = m(x - x₁)',
    meaning: 'Fastest way to write the equation of a line when given an arbitrary point (x₁, y₁) and a known slope m.',
    whyDifficultyDiffers: 'In Foundations, you rarely need this because (0, b) is given. In Medium, you are given a non-zero point like (4, -3) and m = 2. In Hard, you must find m from another perpendicular line, plug in (x₁, y₁), and rearrange into standard form Ax + By = C.',
    tierBreakdown: {
      foundations: 'Plug (2, 3) and m = 5: y - 3 = 5(x - 2).',
      medium: 'Line passes through (-3, 5) with slope -2. Write equation: y - 5 = -2(x - (-3)) → y = -2x - 1.',
      advanced: 'Find line perpendicular to 2x + 6y = 9 passing through (5, -2). Perpendicular slope = 3. Equation: y + 2 = 3(x - 5) → 3x - y = 17.'
    },
    satExample: {
      question: 'Which equation represents the line passing through (-4, 6) with slope 3/2?',
      answer: 'y - 6 = 3/2(x + 4) or 3x - 2y = -24.',
      proTip: 'Watch out for double negatives! x - (-4) becomes (x + 4).'
    },
    desmosShortcut: 'Type the given point (-4, 6) and test the 4 multiple choice options in Desmos to see which line passes right through it.',
    trapWarning: 'Flipping x₁ and y₁: writing y - x₁ = m(x - y₁).'
  },
  {
    id: 'alg-solving-systems',
    name: 'Solving systems',
    domain: 'algebra',
    domainTitle: 'Algebra (Units 2, 6, 10)',
    units: 'Units 2, 6, 10',
    difficulty: 'medium',
    difficultyBadge: 'Medium',
    difficultyWeight: 2,
    formula: 'substitution (solve one equation for a variable, plug into the other) or elimination (add/subtract equations to cancel a variable)',
    displayFormula: 'substitution (solve one equation for a variable, plug into the other) or elimination (add/subtract equations to cancel a variable)',
    meaning: 'Finding the simultaneous coordinate (x, y) where two linear equations intersect.',
    whyDifficultyDiffers: 'In Foundations, one variable is already isolated. In Medium, equations require scaling before elimination. In Hard, the question asks for combined values like x + y or 2x + 2y directly instead of individual variables.',
    tierBreakdown: {
      foundations: 'Given y = 2x and 3x + y = 15. Substitute 2x for y: 3x + 2x = 15 → 5x = 15 → x = 3, y = 6.',
      medium: 'Given 2x + 3y = 12 and 5x - 2y = 11. Multiply Eq 1 by 2 and Eq 2 by 3 to eliminate y: 4x + 6y = 24 and 15x - 6y = 33 → 19x = 57 → x = 3.',
      advanced: 'Given 7x + 3y = 22 and 5x + y = 14. What is 2x + 2y? Subtract Eq 2 from Eq 1 directly: 2x + 2y = 8 without solving for x or y!'
    },
    satExample: {
      question: 'If 3x + 2y = 18 and 2x + 3y = 12, what is the value of x + y?',
      answer: 'x + y = 6. Add both equations: 5x + 5y = 30 → divide by 5: x + y = 6. Takes 10 seconds!',
      proTip: 'Always check if adding or subtracting equations immediately yields the requested combination expression.'
    },
    desmosShortcut: 'Type both equations in Desmos. Click the intersection point to view (x, y) immediately.',
    trapWarning: 'Wasting 3 minutes solving for x and y individually when the problem only asked for a combined expression like x + y.'
  },
  {
    id: 'alg-inequalities',
    name: 'Inequalities',
    domain: 'algebra',
    domainTitle: 'Algebra (Units 2, 6, 10)',
    units: 'Units 2, 6, 10',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'same rules as equations, flip the inequality sign when multiplying or dividing by a negative',
    displayFormula: 'same rules as equations, flip the inequality sign when multiplying or dividing by a negative',
    meaning: 'Solving linear inequalities follows exact algebraic equation rules, with the mandatory rule to flip the sign when multiplying or dividing by a negative number.',
    whyDifficultyDiffers: 'In Foundations, 1-step linear inequality. In Medium, compound or fractional inequality. In Hard, system of linear inequalities defining a bounded region on the xy-plane.',
    tierBreakdown: {
      foundations: '-3x < 12 → divide by -3 and flip: x > -4.',
      medium: 'Solve -2 ≤ 3x + 4 < 19: subtract 4 from all sides → -6 ≤ 3x < 15 → divide by 3: -2 ≤ x < 5.',
      advanced: 'Which point (x, y) satisfies y > 2x - 3 and y ≤ -x + 5? Test vertices or integer coordinates inside the overlapping shaded region.'
    },
    satExample: {
      question: 'If -4x + 7 ≤ 23, what is the smallest possible value of x?',
      answer: '-4x ≤ 16 → divide by -4 and FLIP: x ≥ -4. Smallest value is -4.',
      proTip: 'If you want to avoid flipping signs, add the negative term to the other side to make it positive!'
    },
    desmosShortcut: 'Type inequalities like y > 2x - 3 into Desmos directly; Desmos shades the region and shows solid vs dashed boundary lines.',
    trapWarning: 'Forgetting to flip the inequality sign when dividing or multiplying across a negative number.'
  },

  // =========================================================================
  // CHAPTER 2: PROBLEM SOLVING & DATA ANALYSIS (Units 3, 7, 11)
  // =========================================================================
  {
    id: 'psda-proportion',
    name: 'Proportion',
    domain: 'problem-solving',
    domainTitle: 'Problem Solving & Data Analysis (Units 3, 7, 11)',
    units: 'Units 3, 7, 11',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'a/b = c/d → cross multiply: ad = bc',
    displayFormula: 'a/b = c/d → cross multiply: ad = bc',
    meaning: 'Equating two ratios to solve for an unknown quantity via cross-multiplication.',
    whyDifficultyDiffers: 'In Foundations, simple 3-knowns 1-unknown. In Medium, unit conversion factors chained together. In Hard, algebraic expressions in numerators or denominators like (x+2)/(x-1) = 3/4.',
    tierBreakdown: {
      foundations: '3/5 = x/20 → 5x = 60 → x = 12.',
      medium: 'A recipe uses 2.5 cups of flour for 12 cookies. How many cups for 30 cookies? 2.5 / 12 = x / 30 → 12x = 75 → x = 6.25 cups.',
      advanced: 'Solve (x + 3) / (2x - 1) = 5 / 4 → 4(x + 3) = 5(2x - 1) → 4x + 12 = 10x - 5 → 6x = 17 → x = 17/6.'
    },
    satExample: {
      question: 'If 8 meters of fabric cost $36, how much will 14 meters cost at the same rate?',
      answer: '8 / 36 = 14 / x → 8x = 504 → x = $63.',
      proTip: 'Keep units aligned on top and bottom: meters/dollars = meters/dollars.'
    },
    desmosShortcut: 'Type the proportional equation 8/36 = 14/x directly into Desmos to read the vertical line solution at x = 63.',
    trapWarning: 'Inverting units on one side (e.g. putting dollars on top on the left but meters on top on the right).'
  },
  {
    id: 'psda-percent-change',
    name: 'Percent change',
    domain: 'problem-solving',
    domainTitle: 'Problem Solving & Data Analysis (Units 3, 7, 11)',
    units: 'Units 3, 7, 11',
    difficulty: 'medium',
    difficultyBadge: 'Medium',
    difficultyWeight: 2,
    formula: '(new − old) / old × 100',
    displayFormula: '(new − old) / old × 100',
    meaning: 'Relative percentage increase (positive) or decrease (negative) compared to original baseline.',
    whyDifficultyDiffers: 'In Foundations, finding simple percent increase from 50 to 65. In Medium, consecutive discounts or sales tax. In Hard, solving backwards from final value when a percent decrease occurred.',
    tierBreakdown: {
      foundations: 'Price goes from $40 to $50. (50 - 40) / 40 × 100 = 10 / 40 × 100 = 25% increase.',
      medium: 'A jacket is discounted 20%, then an extra 10% off. Total multiplier: (0.80)(0.90) = 0.72 → 28% total discount, NOT 30%!',
      advanced: 'After a 15% discount, a computer costs $680. What was original price? 0.85x = 680 → x = 680 / 0.85 = $800.'
    },
    satExample: {
      question: 'A stock was valued at $120 and dropped to $90. What was the percent decrease?',
      answer: '(90 - 120) / 120 × 100 = -30 / 120 × 100 = -25% (a 25% decrease).',
      proTip: 'Always divide by the OLD (original) value, never by the new value!'
    },
    desmosShortcut: 'In Desmos, typing (90 - 120) / 120 gives -0.25 (-25%) instantly.',
    trapWarning: 'Dividing by the new value instead of the old value.'
  },
  {
    id: 'psda-mean',
    name: 'Mean',
    domain: 'problem-solving',
    domainTitle: 'Problem Solving & Data Analysis (Units 3, 7, 11)',
    units: 'Units 3, 7, 11',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'Mean = sum of values / number of values',
    displayFormula: 'Mean = sum of values / number of values',
    meaning: 'Arithmetic average of a data set. Total sum = Mean × number of values.',
    whyDifficultyDiffers: 'In Foundations, calculate average of 5 numbers. In Medium, finding a missing score needed to achieve a target average. In Hard, weighted average combining two groups of different sizes.',
    tierBreakdown: {
      foundations: 'Scores: 80, 85, 90. Mean = (80 + 85 + 90) / 3 = 255 / 3 = 85.',
      medium: 'A student scored 78, 82, and 85 on 3 tests. What score on the 4th test achieves an average of 84? Total needed = 84 × 4 = 336. Current sum = 245. 4th test = 336 - 245 = 91.',
      advanced: 'Class A (20 students) averages 75. Class B (30 students) averages 85. Combined mean = (20×75 + 30×85) / 50 = (1500 + 2550) / 50 = 4050 / 50 = 81.'
    },
    satExample: {
      question: 'The mean of 5 numbers is 18. If one number is removed, the mean of the remaining 4 numbers is 19. What number was removed?',
      answer: 'Initial sum = 5 × 18 = 90. New sum = 4 × 19 = 76. Removed number = 90 - 76 = 14.',
      proTip: 'Whenever an SAT question mentions average, immediately calculate: Sum = Mean × Count!'
    },
    desmosShortcut: 'Use mean([80, 85, 90]) in Desmos to calculate the mean of any list instantly.',
    trapWarning: 'Averaging two averages directly when group sizes are unequal.'
  },
  {
    id: 'psda-range',
    name: 'Range',
    domain: 'problem-solving',
    domainTitle: 'Problem Solving & Data Analysis (Units 3, 7, 11)',
    units: 'Units 3, 7, 11',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'Range = max − min',
    displayFormula: 'Range = max − min',
    meaning: 'Measures statistical dispersion by subtracting the smallest data value from the largest data value.',
    whyDifficultyDiffers: 'In Foundations, read min and max from a simple list. In Medium, read range from frequency table or dot plot. In Hard, determine how adding an extreme outlier affects range vs median vs standard deviation.',
    tierBreakdown: {
      foundations: 'Data: 12, 18, 25, 41, 55. Range = 55 - 12 = 43.',
      medium: 'A frequency table lists values 10 through 50 with frequencies. Range is simply maximum value 50 minus minimum value 10 = 40 (frequencies do not change min or max).',
      advanced: 'Adding an outlier changes the Range and Mean dramatically, but has almost no effect on the Median.'
    },
    satExample: {
      question: 'Data Set A has values 4, 8, 12, 16. Data Set B is formed by multiplying each value in A by 3. What is the range of Data Set B?',
      answer: 'Range of A = 16 - 4 = 12. Range of B = (16×3) - (4×3) = 48 - 12 = 36 (or 12 × 3 = 36).',
      proTip: 'Adding a constant to all data values does NOT change range; multiplying all values by c multiplies range by |c|.'
    },
    desmosShortcut: 'Type max([4, 8, 12, 16]) - min([4, 8, 12, 16]) in Desmos for instant range.',
    trapWarning: 'Subtracting frequencies instead of the actual data values on a frequency chart.'
  },
  {
    id: 'psda-probability',
    name: 'Probability',
    domain: 'problem-solving',
    domainTitle: 'Problem Solving & Data Analysis (Units 3, 7, 11)',
    units: 'Units 3, 7, 11',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'Probability = favorable outcomes / total outcomes',
    displayFormula: 'Probability = favorable outcomes / total outcomes',
    meaning: 'Likelihood of an event occurring, expressed as a fraction or decimal between 0 and 1.',
    whyDifficultyDiffers: 'In Foundations, single draw from a jar. In Medium, two-way table conditional probability where the denominator is restricted to a specific row or column. In Hard, probability without replacement or multiple independent criteria.',
    tierBreakdown: {
      foundations: 'A bag has 4 red and 6 blue marbles. P(red) = 4 / 10 = 2/5 = 0.4.',
      medium: 'In a survey of 100 students, 40 are seniors. Of the seniors, 15 play sports. Given that a selected student is a senior, what is the probability they play sports? P = 15 / 40 = 3/8 (denominator is ONLY the 40 seniors!).',
      advanced: 'Two cards drawn without replacement: P(both aces) = (4/52) × (3/51).'
    },
    satExample: {
      question: 'A table shows 25 males and 35 females. If 10 males and 14 females prefer online testing, what is the probability that a randomly chosen female prefers online testing?',
      answer: 'Denominator is strictly females = 35. Favorable = 14. Probability = 14 / 35 = 2/5 = 0.4.',
      proTip: 'Look for phrases like "Given that...", "Of the students who...", or "If a female is selected..." — this specifies the restricted denominator!'
    },
    desmosShortcut: 'Desmos simplifies fractions automatically: type 14/35 and click the fraction icon to see 2/5.',
    trapWarning: 'Using the entire grand total as the denominator when the question specifies a conditional sub-group.'
  },
  {
    id: 'psda-linear-growth',
    name: 'Linear growth',
    domain: 'problem-solving',
    domainTitle: 'Problem Solving & Data Analysis (Units 3, 7, 11)',
    units: 'Units 3, 7, 11',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'y = a + bx',
    displayFormula: 'y = a + bx',
    meaning: 'Growth by a constant AMOUNT per unit time (constant first differences).',
    whyDifficultyDiffers: 'In Foundations, identify constant increase like $5 per year. In Medium, distinguishing between linear and exponential models given a data table. In Hard, interpreting slope b and intercept a in real-world contexts.',
    tierBreakdown: {
      foundations: 'A tree is 10 feet tall and grows 2 feet every year: y = 10 + 2x.',
      medium: 'A table shows values: x=1: 12, x=2: 17, x=3: 22. Difference is constant +5, so the relationship is strictly LINEAR.',
      advanced: 'Contextual interpretation: in y = 24.5 + 3.2x, 24.5 is baseline value, and 3.2 is rate of increase per unit.'
    },
    satExample: {
      question: 'A car rental company charges $30 baseline fee plus $0.25 per mile driven. Which model represents cost C for m miles?',
      answer: 'C = 30 + 0.25m.',
      proTip: 'Linear growth = increases by a constant NUMBER/AMOUNT; Exponential growth = increases by a constant PERCENTAGE/FACTOR.'
    },
    desmosShortcut: 'Graph y = 30 + 0.25x in Desmos to visualize the constant straight-line growth.',
    trapWarning: 'Confusing constant amount growth (+5 per month) with constant percentage growth (+5% per month).'
  },
  {
    id: 'psda-exponential-growth-decay',
    name: 'Exponential growth/decay',
    domain: 'problem-solving',
    domainTitle: 'Problem Solving & Data Analysis (Units 3, 7, 11)',
    units: 'Units 3, 7, 11',
    difficulty: 'advanced',
    difficultyBadge: 'Advanced',
    difficultyWeight: 3,
    formula: 'y = a(1 + r)ˣ (growth) or y = a(1 − r)ˣ (decay)',
    displayFormula: 'y = a(1 + r)ˣ (growth) or y = a(1 − r)ˣ (decay)',
    meaning: 'Growth or decay by a constant PERCENTAGE rate r per time period x, with initial amount a.',
    whyDifficultyDiffers: 'In Foundations, simple annual 5% growth: y = a(1.05)ˣ. In Medium, decay where base is less than 1, like 15% annual loss → 1 - 0.15 = 0.85. In Hard, compounding periods where exponent is scaled, like every 3 years (x/3) or quarterly (4x).',
    tierBreakdown: {
      foundations: 'Initial deposit $500 grows 6% annually: y = 500(1 + 0.06)ˣ = 500(1.06)ˣ.',
      medium: 'A car depreciates by 12% per year from $20,000: y = 20,000(1 - 0.12)ˣ = 20,000(0.88)ˣ.',
      advanced: 'A bacteria colony doubles every 4 hours. Model: y = N₀(2)^(t/4).'
    },
    satExample: {
      question: 'A population of 4,000 increases by 7% each year. What will the population be after 5 years?',
      answer: 'y = 4000(1.07)⁵ ≈ 5,610.',
      proTip: 'If growth rate is r%, multiplier is 1 + r/100. If decay rate is r%, multiplier is 1 - r/100.'
    },
    desmosShortcut: 'Type 4000*(1.07)^5 directly into Desmos for immediate numerical result.',
    trapWarning: 'Using 0.07 instead of 1.07 for growth: multiplying by 0.07 gives just the single-year increase, not the total!'
  },

  // =========================================================================
  // CHAPTER 3: ADVANCED MATH (Units 4, 8, 12)
  // =========================================================================
  {
    id: 'adv-quadratic-formula',
    name: 'Quadratic formula',
    domain: 'advanced-math',
    domainTitle: 'Advanced Math (Units 4, 8, 12)',
    units: 'Units 4, 8, 12',
    difficulty: 'advanced',
    difficultyBadge: 'Advanced',
    difficultyWeight: 3,
    formula: 'x = [−b ± √(b² − 4ac)] / 2a',
    displayFormula: 'x = [−b ± √(b² − 4ac)] / 2a',
    meaning: 'Universal solution for roots/x-intercepts of any standard quadratic equation ax² + bx + c = 0.',
    whyDifficultyDiffers: 'In Foundations, a=1 and equation factors cleanly. In Medium, radical answers that cannot be factored by hand. In Hard, evaluating discriminant b² - 4ac for number of real solutions (>0: two, =0: one, <0: zero/complex).',
    tierBreakdown: {
      foundations: 'x² - 5x + 6 = 0 factors to (x - 2)(x - 3) = 0 → x = 2, 3.',
      medium: '2x² - 4x - 1 = 0 → x = [4 ± √(16 - 4(2)(-1))] / 4 = [4 ± √24] / 4 = 1 ± √6 / 2.',
      advanced: 'For what value of c does 3x² - 6x + c = 0 have exactly one real solution? b² - 4ac = 0 → (-6)² - 4(3)(c) = 0 → 36 - 12c = 0 → c = 3.'
    },
    satExample: {
      question: 'What are the solutions to 3x² + 5x - 2 = 0?',
      answer: 'x = [-5 ± √(25 - 4(3)(-2))] / 6 = [-5 ± √49] / 6 = [-5 ± 7] / 6 → x = 1/3 and x = -2.',
      proTip: 'Desmos graphs parabolas in 0.5 seconds: type 3x² + 5x - 2 = 0 and click the x-intercepts to read solutions directly!'
    },
    desmosShortcut: 'Graph y = ax² + bx + c in Desmos and click the grey dots on the x-axis to find roots instantly.',
    trapWarning: 'Sign error on -b: if b = -6, then -b = +6!'
  },
  {
    id: 'adv-difference-of-squares',
    name: 'Difference of squares',
    domain: 'advanced-math',
    domainTitle: 'Advanced Math (Units 4, 8, 12)',
    units: 'Units 4, 8, 12',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'a² − b² = (a−b)(a+b)',
    displayFormula: 'a² − b² = (a−b)(a+b)',
    meaning: 'Factoring identity where the difference of two squared terms factors into conjugate binomials with zero middle term.',
    whyDifficultyDiffers: 'In Foundations, basic x² - 9 = (x - 3)(x + 3). In Medium, coefficients on both terms like 4x² - 25y² = (2x - 5y)(2x + 5y). In Hard, higher-order powers like x⁴ - 16 = (x² + 4)(x - 2)(x + 2).',
    tierBreakdown: {
      foundations: 'Factor x² - 49 = (x - 7)(x + 7).',
      medium: 'Factor 9x² - 64 = (3x - 8)(3x + 8).',
      advanced: 'Simplify (x² - 25) / (x - 5) for x ≠ 5: (x - 5)(x + 5) / (x - 5) = x + 5.'
    },
    satExample: {
      question: 'If x² - y² = 28 and x - y = 4, what is the value of x + y?',
      answer: 'x² - y² = (x - y)(x + y) → 28 = 4(x + y) → x + y = 7.',
      proTip: 'Whenever you see x² - y² on the SAT, immediately write (x - y)(x + y).'
    },
    desmosShortcut: 'You can test equivalence in Desmos by graphing y = x² - 49 and y = (x - 7)(x + 7) to see they overlap completely.',
    trapWarning: 'Thinking that sum of squares a² + b² factors as (a + b)(a + b) — that produces a middle term 2ab!'
  },
  {
    id: 'adv-exponent-rules',
    name: 'Exponent rules',
    domain: 'advanced-math',
    domainTitle: 'Advanced Math (Units 4, 8, 12)',
    units: 'Units 4, 8, 12',
    difficulty: 'medium',
    difficultyBadge: 'Medium',
    difficultyWeight: 2,
    formula: 'aᵐ·aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁻ⁿ = 1/aⁿ, a^(1/n) = ⁿ√a',
    displayFormula: 'aᵐ·aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁻ⁿ = 1/aⁿ, a^(1/n) = ⁿ√a',
    meaning: 'Fundamental algebraic laws for manipulating powers, fractional exponents (radicals), and negative reciprocals.',
    whyDifficultyDiffers: 'In Foundations, simple product rule x³ · x⁴ = x⁷. In Medium, fractional powers like 16^(3/4) = (⁴√16)³ = 2³ = 8. In Hard, rewriting equations with different bases into common bases (e.g., 8ˣ = 2^(3x)).',
    tierBreakdown: {
      foundations: 'Simplify x⁵ · x³ = x⁵⁺³ = x⁸ and (x⁴)² = x⁸.',
      medium: 'Evaluate 27^(2/3) = (³√27)² = 3² = 9.',
      advanced: 'If 2^(2x) · 2^(3y) = 32, find 2x + 3y: 2^(2x + 3y) = 2⁵ → 2x + 3y = 5.'
    },
    satExample: {
      question: 'If 8^x / 2^y = 64, what is the value of 3x - y?',
      answer: 'Rewrite 8 as 2³: (2³)^x / 2^y = 2^(3x) / 2^y = 2^(3x - y). Since 64 = 2⁶, 2^(3x - y) = 2⁶ → 3x - y = 6.',
      proTip: 'When solving exponential equations with different bases, convert all numbers to powers of their common prime base (2, 3, or 5).'
    },
    desmosShortcut: 'Type expressions with numbers into Desmos (e.g. 27^(2/3)) to evaluate radicals instantaneously.',
    trapWarning: 'Adding exponents when raising a power to a power: (x³)² is x⁶, NOT x⁵!'
  },
  {
    id: 'adv-vertex-form',
    name: 'Vertex form',
    domain: 'advanced-math',
    domainTitle: 'Advanced Math (Units 4, 8, 12)',
    units: 'Units 4, 8, 12',
    difficulty: 'advanced',
    difficultyBadge: 'Advanced',
    difficultyWeight: 3,
    formula: 'y = a(x−h)² + k, vertex is (h, k)',
    displayFormula: 'y = a(x−h)² + k, vertex is (h, k)',
    meaning: 'Parabola equation where vertex (maximum if a < 0, minimum if a > 0) is immediately identifiable as (h, k).',
    whyDifficultyDiffers: 'In Foundations, read vertex from y = 2(x - 3)² + 5 → (3, 5). In Medium, identify axis of symmetry x = h or minimum value k. In Hard, converting from standard form y = ax² + bx + c by completing the square.',
    tierBreakdown: {
      foundations: 'Vertex of y = (x - 4)² + 7 is (4, 7). Minimum value is 7 at x = 4.',
      medium: 'A projectile follows h(t) = -16(t - 2)² + 64. Maximum height is 64 feet, reached at t = 2 seconds.',
      advanced: 'Convert y = x² - 6x + 13 into vertex form: y = (x² - 6x + 9) + 4 = (x - 3)² + 4. Vertex is (3, 4).'
    },
    satExample: {
      question: 'Which equation shows the minimum value of f(x) = x² - 8x + 19 as a constant or coefficient?',
      answer: 'y = (x - 4)² + 3. The minimum value 3 is displayed directly as a constant.',
      proTip: 'On the SAT, when a question asks "which form reveals the vertex / minimum / maximum as a constant", the answer is ALWAYS Vertex Form!'
    },
    desmosShortcut: 'Graph the parabola in Desmos and click the vertex dot; Desmos shows (h, k) coordinates directly.',
    trapWarning: 'Sign mistake inside the bracket: in (x + 3)², h = -3, NOT +3!'
  },
  {
    id: 'adv-vertex-x-coord',
    name: 'Vertex x-coordinate (from standard form)',
    domain: 'advanced-math',
    domainTitle: 'Advanced Math (Units 4, 8, 12)',
    units: 'Units 4, 8, 12',
    difficulty: 'medium',
    difficultyBadge: 'Medium',
    difficultyWeight: 2,
    formula: 'x = −b/2a',
    displayFormula: 'x = −b/2a',
    meaning: 'Line of symmetry and x-coordinate of the vertex of a standard parabola y = ax² + bx + c.',
    whyDifficultyDiffers: 'In Foundations, finding axis of symmetry for y = x² - 6x + 5. In Medium, finding maximum height by finding x = -b/2a then plugging back in to find y. In Hard, finding constant c when vertex or line of symmetry is given.',
    tierBreakdown: {
      foundations: 'y = x² - 6x + 8. Axis of symmetry: x = -(-6) / (2·1) = 6 / 2 = 3.',
      medium: 'Find the maximum of y = -2x² + 8x - 1. x = -8 / (2(-2)) = 2. Plug in x=2: y = -2(4) + 8(2) - 1 = 7.',
      advanced: 'Parabola y = ax² + bx + c has vertex at x = 4 and passes through (0, 3) and (2, -5). Use x = -b/(2a) = 4 → b = -8a to solve the system.'
    },
    satExample: {
      question: 'A ball thrown upward has height h(t) = -5t² + 20t + 2. At what time t does it reach maximum height?',
      answer: 't = -b / (2a) = -20 / (2(-5)) = -20 / -10 = 2 seconds.',
      proTip: 'The vertex x-coordinate is also always exactly midway between the two x-intercepts: (x₁ + x₂) / 2!'
    },
    desmosShortcut: 'Graph the equation in Desmos and click the peak/valley to verify the vertex coordinate.',
    trapWarning: 'Forgetting the negative sign in x = -b/(2a).'
  },

  // =========================================================================
  // CHAPTER 4: GEOMETRY & TRIGONOMETRY (Units 5, 9, 13)
  // =========================================================================
  {
    id: 'geo-circle-area-circ',
    name: 'Circle area & Circumference',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'Circle area: πr² | Circumference: 2πr',
    displayFormula: 'Circle area: πr² | Circumference: 2πr',
    meaning: 'Area enclosed by a circle and perimeter around its boundary, where r is radius (r = d/2).',
    whyDifficultyDiffers: 'In Foundations, calculate area or circumference given radius. In Medium, work backwards from circumference to find area. In Hard, concentric circles or combining with inscribed squares.',
    tierBreakdown: {
      foundations: 'Radius 5: Area = π(5)² = 25π. Circumference = 2π(5) = 10π.',
      medium: 'A circle has circumference 16π. Find its area: 2πr = 16π → r = 8 → Area = π(8)² = 64π.',
      advanced: 'A square of side 8 is inscribed in a circle. Diagonal of square = diameter = 8√2 → radius = 4√2. Circle area = 32π. Shaded region = 32π - 64.'
    },
    satExample: {
      question: 'If the area of a circle is 49π, what is its circumference?',
      answer: 'πr² = 49π → r = 7. Circumference = 2π(7) = 14π.',
      proTip: 'Always check if the problem gives DIAMETER or RADIUS. If diameter is given, divide by 2 first!'
    },
    desmosShortcut: 'Use pi in Desmos calculations: type 2*pi*7 to get exact or numerical decimal values.',
    trapWarning: 'Using the diameter instead of the radius in the area formula: πd² is WRONG (it is πr²).'
  },
  {
    id: 'geo-triangle-area',
    name: 'Triangle area',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: '½ × base × height',
    displayFormula: '½ × base × height',
    meaning: 'Standard 2D area of any triangle, where height is perpendicular to the chosen base.',
    whyDifficultyDiffers: 'In Foundations, base and height are explicitly given. In Medium, right triangle legs serve as base and height. In Hard, equilateral triangle area (s²√3)/4 or using Pythagorean theorem to solve for unknown height first.',
    tierBreakdown: {
      foundations: 'Base 10, height 6: Area = 1/2 × 10 × 6 = 30.',
      medium: 'Right triangle with hypotenuse 13 and one leg 5. Other leg = √(169 - 25) = 12. Area = 1/2 × 5 × 12 = 30.',
      advanced: 'Equilateral triangle with side 6. Height = 3√3. Area = 1/2 × 6 × 3√3 = 9√3.'
    },
    satExample: {
      question: 'An isosceles triangle has base 16 and legs of length 10. What is its area?',
      answer: 'Altitude splits base into two 8s. Height = √(10² - 8²) = √(100 - 64) = √36 = 6. Area = 1/2 × 16 × 6 = 48.',
      proTip: 'In any isosceles triangle, dropping an altitude creates two congruent right triangles!'
    },
    desmosShortcut: 'In Desmos, typing (1/2)*16*6 calculates area immediately.',
    trapWarning: 'Using the slanted leg length as the height: height MUST be perpendicular to the base.'
  },
  {
    id: 'geo-3d-volumes',
    name: '3D Volumes',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'medium',
    difficultyBadge: 'Medium',
    difficultyWeight: 2,
    formula: 'Cylinder volume: πr²h | Cone: ⅓πr²h | Sphere: 4/3πr³',
    displayFormula: 'Cylinder volume: πr²h | Cone: ⅓πr²h | Sphere: 4/3πr³',
    meaning: 'Standard volume formulas for circular 3D solids (provided on SAT Math reference sheet).',
    whyDifficultyDiffers: 'In Foundations, direct volume calculation given dimensions. In Medium, solve for missing height or radius given volume. In Hard, comparing volume ratios when linear dimensions scale by factor k (volume scales by k³).',
    tierBreakdown: {
      foundations: 'Cylinder with r=3, h=5: V = π(3)²(5) = 45π.',
      medium: 'A cone has volume 36π and radius 6. Find height: 1/3π(6)²h = 36π → 12h = 36 → h = 3.',
      advanced: 'If the radius of a sphere is doubled, its volume increases by 2³ = 8 times.'
    },
    satExample: {
      question: 'A cylinder has radius 4 and height 10. A sphere has the same volume. What is the radius of the sphere?',
      answer: 'V_cyl = π(4)²(10) = 160π. 4/3πr³ = 160π → r³ = 160 × 3/4 = 120 → r = ³√120 ≈ 4.93.',
      proTip: 'These formulas are provided at the start of each SAT Math module, but knowing them by heart saves crucial test minutes.'
    },
    desmosShortcut: 'Type (4/3)*pi*r^3 in Desmos to calculate sphere volumes instantly.',
    trapWarning: 'Forgetting the 1/3 on cone or 4/3 on sphere, or forgetting to divide diameter by 2.'
  },
  {
    id: 'geo-pythagorean',
    name: 'Pythagorean theorem',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: 'a² + b² = c²',
    displayFormula: 'a² + b² = c²',
    meaning: 'In any right-angled triangle, the square of the hypotenuse c equals the sum of squares of the other two legs a and b.',
    whyDifficultyDiffers: 'In Foundations, finding hypotenuse given legs 3 and 4. In Medium, solving for a missing leg e.g. 5² + b² = 13² → b = 12. In Hard, 3D distance inside a rectangular prism: d² = l² + w² + h².',
    tierBreakdown: {
      foundations: 'Legs 6 and 8: c = √(36 + 64) = √100 = 10.',
      medium: 'Right triangle with leg 7 and hypotenuse 25: b = √(625 - 49) = √576 = 24.',
      advanced: 'Diagonal of a box with dimensions 3, 4, 12: d = √(3² + 4² + 12²) = √(9 + 16 + 144) = √169 = 13.'
    },
    satExample: {
      question: 'In right triangle ABC, the hypotenuse is 17 and one leg is 8. What is the length of the third side?',
      answer: 'b = √(17² - 8²) = √(289 - 64) = √225 = 15.',
      proTip: 'Memorize the core SAT Pythagorean triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25 and their multiples (e.g. 6-8-10)!'
    },
    desmosShortcut: 'Type sqrt(17^2 - 8^2) directly into Desmos for instant calculation.',
    trapWarning: 'Adding legs when solving for a missing leg: it is c² - a² = b², NOT c² + a²!'
  },
  {
    id: 'geo-soh-cah-toa',
    name: 'SOH-CAH-TOA',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'medium',
    difficultyBadge: 'Medium',
    difficultyWeight: 2,
    formula: 'sin = opp/hyp, cos = adj/hyp, tan = opp/adj',
    displayFormula: 'sin = opp/hyp, cos = adj/hyp, tan = opp/adj',
    meaning: 'Trigonometric ratios of acute angles in a right-angled triangle.',
    whyDifficultyDiffers: 'In Foundations, read sin/cos/tan off a labeled triangle. In Medium, find side length using trig ratio (e.g. opp = hyp · sinθ). In Hard, co-function identity where sin(A) = cos(B) in right triangle.',
    tierBreakdown: {
      foundations: 'In a 3-4-5 right triangle with angle θ opposite 3: sinθ = 3/5, cosθ = 4/5, tanθ = 3/4.',
      medium: 'Right triangle has hypotenuse 10 and angle 30°. Opposite side = 10 · sin(30°) = 10 · 0.5 = 5.',
      advanced: 'If sin(x°) = cos(y°) and x and y are acute angles, then x + y = 90°.'
    },
    satExample: {
      question: 'In right triangle ABC with right angle C, sin(A) = 5/13. What is cos(B)?',
      answer: 'cos(B) = 5/13. Angles A and B are complementary acute angles, so sin(A) = cos(B).',
      proTip: 'Whenever an SAT question says sin(x) = cos(y), immediately set x + y = 90°!'
    },
    desmosShortcut: 'Desmos evaluates sin(30) or cos(60) in DEGREE mode. Click the wrench icon to ensure Degrees mode is selected.',
    trapWarning: 'Leaving Desmos in Radians mode when testing degree problems.'
  },
  {
    id: 'geo-triangle-angle-sum',
    name: 'Triangle angle sum',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'foundations',
    difficultyBadge: 'Foundations',
    difficultyWeight: 1,
    formula: '180°',
    displayFormula: 'Triangle angle sum = 180°',
    meaning: 'The interior angles of any Euclidean triangle always sum to 180 degrees.',
    whyDifficultyDiffers: 'In Foundations, two angles given, find the third: 180 - A - B. In Medium, angles given in algebraic expressions like 2x, 3x, 4x. In Hard, exterior angle theorem (exterior angle equals sum of two remote interior angles).',
    tierBreakdown: {
      foundations: 'Triangle has angles 50° and 70°. Third angle = 180 - 50 - 70 = 60°.',
      medium: 'Angles are x, 2x, and 3x: x + 2x + 3x = 180 → 6x = 180 → x = 30°.',
      advanced: 'An exterior angle of a triangle is 115°. One remote interior angle is 45°. The other remote interior angle = 115 - 45 = 70°.'
    },
    satExample: {
      question: 'In triangle ABC, angle A is 40° and angle B is 75°. What is the measure of angle C?',
      answer: 'Angle C = 180° - 40° - 75° = 65°.',
      proTip: 'Exterior angle theorem shortcut: The exterior angle of any triangle equals the sum of the two opposite interior angles!'
    },
    desmosShortcut: 'Type 180 - 40 - 75 in Desmos for immediate result.',
    trapWarning: 'Confusing triangle angle sum (180°) with quadrilateral angle sum (360°).'
  },
  {
    id: 'geo-circle-equation',
    name: 'Circle equation',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'advanced',
    difficultyBadge: 'Advanced',
    difficultyWeight: 3,
    formula: '(x−h)² + (y−k)² = r²',
    displayFormula: '(x−h)² + (y−k)² = r²',
    meaning: 'Standard equation of a circle with center (h, k) and radius r.',
    whyDifficultyDiffers: 'In Foundations, read center and radius from (x - 3)² + (y + 2)² = 25 → center (3, -2), radius 5. In Medium, find equation from center and one point. In Hard, completing the square on expanded form x² + y² + Dx + Ey + F = 0.',
    tierBreakdown: {
      foundations: 'Given (x - 2)² + (y + 5)² = 49. Center is (2, -5), radius is √49 = 7.',
      medium: 'Center is (1, -3) and passes through (4, 1). r² = (4 - 1)² + (1 - (-3))² = 9 + 16 = 25. Equation: (x - 1)² + (y + 3)² = 25.',
      advanced: 'Given x² + y² - 6x + 8y = 0. Complete squares: (x - 3)² + (y + 4)² = 9 + 16 = 25. Radius = 5.'
    },
    satExample: {
      question: 'What is the radius of the circle with equation (x + 4)² + (y - 7)² = 36?',
      answer: 'r² = 36 → radius r = √36 = 6.',
      proTip: 'Watch signs: (x + 4) means center x-coordinate is -4, and (y - 7) means center y-coordinate is +7!'
    },
    desmosShortcut: 'Type the circle equation directly into Desmos; click the circle to see center and boundary extents.',
    trapWarning: 'Forgetting to take the square root of the right side: if right side is 36, radius is 6, NOT 36!'
  },
  {
    id: 'geo-pythagorean-identity',
    name: 'Pythagorean identity',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'advanced',
    difficultyBadge: 'Advanced',
    difficultyWeight: 3,
    formula: 'sin²θ + cos²θ = 1',
    displayFormula: 'sin²θ + cos²θ = 1',
    meaning: 'Fundamental trigonometric identity on the unit circle relating sine and cosine of any angle.',
    whyDifficultyDiffers: 'In Foundations, not tested. In Medium, find cosθ given sinθ for an acute angle: cosθ = √(1 - sin²θ). In Hard, algebraic simplification of expressions like (1 - sin²θ) / cos²θ = 1.',
    tierBreakdown: {
      foundations: 'Verify identity for 30°: (0.5)² + (√3/2)² = 0.25 + 0.75 = 1.',
      medium: 'If sinθ = 3/5 for acute angle θ, find cosθ: cosθ = √(1 - (3/5)²) = √(16/25) = 4/5.',
      advanced: 'Simplify (1 - cos²x) / sin(x): identity gives sin²x / sin(x) = sin(x).'
    },
    satExample: {
      question: 'If sin(θ) = 0.6 for an acute angle θ, what is the value of cos²(θ)?',
      answer: 'cos²(θ) = 1 - sin²(θ) = 1 - (0.6)² = 1 - 0.36 = 0.64.',
      proTip: 'Whenever you see 1 - sin²θ or 1 - cos²θ on the SAT, immediately replace it with cos²θ or sin²θ.'
    },
    desmosShortcut: 'Test with any angle in Desmos: (sin(35°))² + (cos(35°))² evaluates to 1.',
    trapWarning: 'Writing sinθ + cosθ = 1 (the squares are mandatory: sin²θ + cos²θ = 1).'
  },
  {
    id: 'geo-arc-sector',
    name: 'Arc length & Sector area',
    domain: 'geometry-trig',
    domainTitle: 'Geometry & Trigonometry (Units 5, 9, 13)',
    units: 'Units 5, 9, 13',
    difficulty: 'medium',
    difficultyBadge: 'Medium',
    difficultyWeight: 2,
    formula: 'Arc length: (θ/360) × 2πr | Sector area: (θ/360) × πr²',
    displayFormula: 'Arc length: (θ/360) × 2πr | Sector area: (θ/360) × πr²',
    meaning: 'Fraction of a circle’s circumference (arc length) or total area (sector area) for central angle θ in degrees.',
    whyDifficultyDiffers: 'In Foundations, basic fraction e.g. 90° is 90/360 = 1/4 of circle. In Medium, angle given in degrees or radians. In Hard, finding central angle or radius when sector area is given.',
    tierBreakdown: {
      foundations: 'Radius 12, angle 60°. Arc length = (60/360) × 2π(12) = 1/6 × 24π = 4π.',
      medium: 'Radius 6, angle 90°. Sector area = (90/360) × π(6)² = 1/4 × 36π = 9π.',
      advanced: 'An arc of length 15π has central angle 100°. Find radius: (100/360) × 2πr = 15π → (5/18) × 2r = 15 → r = 27.'
    },
    satExample: {
      question: 'A circle with radius 10 has a sector with central angle 72°. What is the area of the sector?',
      answer: 'Sector area = (72 / 360) × π(10)² = (1 / 5) × 100π = 20π.',
      proTip: 'Fraction of circle is always central angle / 360° (or θ / 2π in radians)!'
    },
    desmosShortcut: 'In Desmos, type (72/360)*pi*10^2 to get 20pi directly.',
    trapWarning: 'Using 2πr for area or πr² for arc length.'
  }
];
