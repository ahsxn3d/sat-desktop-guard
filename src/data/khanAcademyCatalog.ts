// src/data/khanAcademyCatalog.ts
// Official Khan Academy Digital SAT Curriculum Architecture
// Math: 4 Chapters across 3 Difficulty Tiers (Foundations, Medium, Advanced) = 12 Units (+ Intro = 13 Units)
// Reading & Writing: 4 Chapters across Tiered Units (Foundations, Medium, Hard, Advanced Conventions)

export interface KhanLessonItem {
  code: string; // e.g. "Math U5.1", "R&W U5.1"
  unitNumber: number;
  lessonNumber: number;
  title: string;
  domain: string; // 'algebra' | 'problem-solving' | 'advanced-math' | 'geometry-trig' | 'craft-structure' | 'information-ideas' | 'expression-ideas' | 'conventions'
  tier: 'foundations' | 'medium' | 'advanced' | 'conventions';
  recommendedMinutes: number;
  description: string;
}

export interface KhanUnitInfo {
  unitNumber: number;
  title: string;
  subject: 'math' | 'rw';
  tier: 'foundations' | 'medium' | 'advanced' | 'conventions';
  domain: string;
  description: string;
  lessons: KhanLessonItem[];
}

export const KHAN_MATH_UNITS: KhanUnitInfo[] = [
  // FOUNDATIONS TIER
  {
    unitNumber: 2,
    title: 'Foundations: Algebra',
    subject: 'math',
    tier: 'foundations',
    domain: 'algebra',
    description: 'Core linear relationships, solving single-variable equations, and introductory inequalities.',
    lessons: [
      { code: 'Math U2.1', unitNumber: 2, lessonNumber: 1, title: 'Solving linear equations and inequalities', domain: 'algebra', tier: 'foundations', recommendedMinutes: 20, description: 'Single-variable linear equations and inequalities with integer and fractional coefficients.' },
      { code: 'Math U2.2', unitNumber: 2, lessonNumber: 2, title: 'Linear equation word problems', domain: 'algebra', tier: 'foundations', recommendedMinutes: 20, description: 'Translating real-world situations into linear equations.' },
      { code: 'Math U2.3', unitNumber: 2, lessonNumber: 3, title: 'Linear relationship word problems', domain: 'algebra', tier: 'foundations', recommendedMinutes: 20, description: 'Constructing rate-of-change and initial-value models.' },
      { code: 'Math U2.4', unitNumber: 2, lessonNumber: 4, title: 'Graphs of linear equations and functions', domain: 'algebra', tier: 'foundations', recommendedMinutes: 20, description: 'Slope-intercept form, point-slope form, and finding intercepts.' },
      { code: 'Math U2.5', unitNumber: 2, lessonNumber: 5, title: 'Solving systems of linear equations', domain: 'algebra', tier: 'foundations', recommendedMinutes: 20, description: 'Solving 2x2 systems by substitution and elimination.' },
      { code: 'Math U2.6', unitNumber: 2, lessonNumber: 6, title: 'Systems of linear equations word problems', domain: 'algebra', tier: 'foundations', recommendedMinutes: 20, description: 'Setting up dual equations for quantities and prices.' },
      { code: 'Math U2.7', unitNumber: 2, lessonNumber: 7, title: 'Linear inequality word problems', domain: 'algebra', tier: 'foundations', recommendedMinutes: 20, description: 'Boundary conditions and constraint modeling.' },
      { code: 'Math U2.8', unitNumber: 2, lessonNumber: 8, title: 'Graphs of linear systems and inequalities', domain: 'algebra', tier: 'foundations', recommendedMinutes: 20, description: 'Shaded half-planes and points of intersection.' }
    ]
  },
  {
    unitNumber: 3,
    title: 'Foundations: Problem Solving and Data Analysis',
    subject: 'math',
    tier: 'foundations',
    domain: 'problem-solving',
    description: 'Ratios, unit conversions, percentages, statistical distributions, and table data.',
    lessons: [
      { code: 'Math U3.1', unitNumber: 3, lessonNumber: 1, title: 'Ratios, rates, and proportions', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Proportional reasoning and cross-multiplication.' },
      { code: 'Math U3.2', unitNumber: 3, lessonNumber: 2, title: 'Unit conversion', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Dimensional analysis and multi-step metric/imperial unit conversions.' },
      { code: 'Math U3.3', unitNumber: 3, lessonNumber: 3, title: 'Percentages', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Percentage change, discount, tax, and base value identification.' },
      { code: 'Math U3.4', unitNumber: 3, lessonNumber: 4, title: 'Center, spread, and shape of distributions', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Mean, median, range, standard deviation, and skewness.' },
      { code: 'Math U3.5', unitNumber: 3, lessonNumber: 5, title: 'Data representations', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Reading histograms, box plots, dot plots, and frequency tables.' },
      { code: 'Math U3.6', unitNumber: 3, lessonNumber: 6, title: 'Scatterplots', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Interpreting trendlines, lines of best fit, and outliers.' },
      { code: 'Math U3.7', unitNumber: 3, lessonNumber: 7, title: 'Linear and exponential growth', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Distinguishing between constant additive and constant multiplicative change.' },
      { code: 'Math U3.8', unitNumber: 3, lessonNumber: 8, title: 'Probability and relative frequency', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Two-way conditional probability tables and fractions.' },
      { code: 'Math U3.9', unitNumber: 3, lessonNumber: 9, title: 'Data inferences', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Generalizing from random samples to larger populations.' },
      { code: 'Math U3.10', unitNumber: 3, lessonNumber: 10, title: 'Evaluating statistical claims', domain: 'problem-solving', tier: 'foundations', recommendedMinutes: 20, description: 'Margin of error and experimental validity.' }
    ]
  },
  {
    unitNumber: 4,
    title: 'Foundations: Advanced Math',
    subject: 'math',
    tier: 'foundations',
    domain: 'advanced-math',
    description: 'Quadratic equations, polynomials, radicals, and isolating quantities.',
    lessons: [
      { code: 'Math U4.1', unitNumber: 4, lessonNumber: 1, title: 'Factoring quadratic and polynomial expressions', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Factoring by grouping, difference of squares, and AC method.' },
      { code: 'Math U4.2', unitNumber: 4, lessonNumber: 2, title: 'Radicals and rational exponents', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Exponent rules, fractional exponents, and simplifying square roots.' },
      { code: 'Math U4.3', unitNumber: 4, lessonNumber: 3, title: 'Operations with polynomials', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Polynomial addition, subtraction, expansion, and long division.' },
      { code: 'Math U4.4', unitNumber: 4, lessonNumber: 4, title: 'Operations with rational expressions', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Finding common denominators and simplifying algebraic fractions.' },
      { code: 'Math U4.5', unitNumber: 4, lessonNumber: 5, title: 'Nonlinear functions', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Evaluating composite and piecewise functions.' },
      { code: 'Math U4.6', unitNumber: 4, lessonNumber: 6, title: 'Isolating quantities', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Manipulating formulas to solve for a specific variable.' },
      { code: 'Math U4.7', unitNumber: 4, lessonNumber: 7, title: 'Solving quadratic equations', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Factoring, quadratic formula, completing the square, and discriminant.' },
      { code: 'Math U4.8', unitNumber: 4, lessonNumber: 8, title: 'Linear and quadratic systems', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Finding points of intersection between a line and a parabola.' },
      { code: 'Math U4.9', unitNumber: 4, lessonNumber: 9, title: 'Radical, rational, and absolute value equations', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Solving with extraneous solutions check.' },
      { code: 'Math U4.10', unitNumber: 4, lessonNumber: 10, title: 'Quadratic and exponential word problems', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Modeling trajectory heights, maximum profit, and compound growth.' },
      { code: 'Math U4.11', unitNumber: 4, lessonNumber: 11, title: 'Quadratic graphs', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Vertex form, axis of symmetry, x-intercepts, and y-intercept.' },
      { code: 'Math U4.12', unitNumber: 4, lessonNumber: 12, title: 'Exponential graphs', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'Growth factor, decay rate, and horizontal asymptotes.' },
      { code: 'Math U4.13', unitNumber: 4, lessonNumber: 13, title: 'Polynomial and other nonlinear graphs', domain: 'advanced-math', tier: 'foundations', recommendedMinutes: 25, description: 'End behavior, multiplicities, and turning points.' }
    ]
  },
  {
    unitNumber: 5,
    title: 'Foundations: Geometry and Trigonometry',
    subject: 'math',
    tier: 'foundations',
    domain: 'geometry-trig',
    description: 'Area, perimeter, volume, triangle similarity, right triangle trig, and circle equations.',
    lessons: [
      { code: 'Math U5.1', unitNumber: 5, lessonNumber: 1, title: 'Area and volume', domain: 'geometry-trig', tier: 'foundations', recommendedMinutes: 30, description: 'Geometric formulas for cylinders, cones, spheres, prisms, and composite shapes.' },
      { code: 'Math U5.2', unitNumber: 5, lessonNumber: 2, title: 'Congruence, similarity, and angle relationships', domain: 'geometry-trig', tier: 'foundations', recommendedMinutes: 30, description: 'Parallel lines with transversals, similar triangle ratios, and scale factors.' },
      { code: 'Math U5.3', unitNumber: 5, lessonNumber: 3, title: 'Right triangle trigonometry', domain: 'geometry-trig', tier: 'foundations', recommendedMinutes: 30, description: 'SOH CAH TOA, special right triangles 30-60-90 & 45-45-90, and co-function identities.' },
      { code: 'Math U5.4', unitNumber: 5, lessonNumber: 4, title: 'Circle theorems', domain: 'geometry-trig', tier: 'foundations', recommendedMinutes: 30, description: 'Arc length, sector area, central angles, inscribed angles, and tangents.' },
      { code: 'Math U5.5', unitNumber: 5, lessonNumber: 5, title: 'Unit circle trigonometry', domain: 'geometry-trig', tier: 'foundations', recommendedMinutes: 30, description: 'Radian to degree conversions, reference angles, and exact trigonometric coordinates.' },
      { code: 'Math U5.6', unitNumber: 5, lessonNumber: 6, title: 'Circle equations', domain: 'geometry-trig', tier: 'foundations', recommendedMinutes: 30, description: 'Standard form (x-h)² + (y-k)² = r² and completing the square for general forms.' }
    ]
  },

  // MEDIUM TIER (Units 6, 7, 8, 9)
  {
    unitNumber: 6,
    title: 'Medium: Algebra',
    subject: 'math',
    tier: 'medium',
    domain: 'algebra',
    description: 'Multi-step linear systems, parameter conditions, and combined constraint modeling.',
    lessons: [
      { code: 'Math U6.1', unitNumber: 6, lessonNumber: 1, title: 'Solving linear equations and inequalities', domain: 'algebra', tier: 'medium', recommendedMinutes: 25, description: 'Intermediate equations with distributed fractions and no solution/infinite solutions conditions.' },
      { code: 'Math U6.2', unitNumber: 6, lessonNumber: 2, title: 'Linear equation word problems', domain: 'algebra', tier: 'medium', recommendedMinutes: 25, description: 'Two-variable constraint equations and per-unit cost models.' },
      { code: 'Math U6.3', unitNumber: 6, lessonNumber: 3, title: 'Linear relationship word problems', domain: 'algebra', tier: 'medium', recommendedMinutes: 25, description: 'Interpreting constants and coefficients in context.' },
      { code: 'Math U6.4', unitNumber: 6, lessonNumber: 4, title: 'Graphs of linear equations and functions', domain: 'algebra', tier: 'medium', recommendedMinutes: 25, description: 'Parallel and perpendicular slopes, shifting lines, and domain restrictions.' },
      { code: 'Math U6.5', unitNumber: 6, lessonNumber: 5, title: 'Solving systems of linear equations', domain: 'algebra', tier: 'medium', recommendedMinutes: 25, description: 'Systems with infinite or no solutions: matching coefficients and constants.' },
      { code: 'Math U6.6', unitNumber: 6, lessonNumber: 6, title: 'Systems of linear equations word problems', domain: 'algebra', tier: 'medium', recommendedMinutes: 25, description: 'Mixture problems, rate-time-distance, and simultaneous budget constraints.' },
      { code: 'Math U6.7', unitNumber: 6, lessonNumber: 7, title: 'Linear inequality word problems', domain: 'algebra', tier: 'medium', recommendedMinutes: 25, description: 'Multi-variable budget bounds and minimum threshold targets.' },
      { code: 'Math U6.8', unitNumber: 6, lessonNumber: 8, title: 'Graphs of linear systems and inequalities', domain: 'algebra', tier: 'medium', recommendedMinutes: 25, description: 'Feasible region vertices and system boundary evaluations.' }
    ]
  },
  {
    unitNumber: 7,
    title: 'Medium: Problem Solving and Data Analysis',
    subject: 'math',
    tier: 'medium',
    domain: 'problem-solving',
    description: 'Advanced percentage modeling, unit ratios, probability calculations, and sample error.',
    lessons: [
      { code: 'Math U7.1', unitNumber: 7, lessonNumber: 1, title: 'Ratios, rates, and proportions', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Complex rate combinations and scale models.' },
      { code: 'Math U7.2', unitNumber: 7, lessonNumber: 2, title: 'Unit conversion', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Area and volume unit conversions (e.g. square feet to square yards).' },
      { code: 'Math U7.3', unitNumber: 7, lessonNumber: 3, title: 'Percentages', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Sequential percentage changes (increase followed by decrease) and reverse percentages.' },
      { code: 'Math U7.4', unitNumber: 7, lessonNumber: 4, title: 'Center, spread, and shape of distributions', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Impact of outliers on mean vs. median.' },
      { code: 'Math U7.5', unitNumber: 7, lessonNumber: 5, title: 'Data representations', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Extracting exact frequencies and medians from frequency tables.' },
      { code: 'Math U7.6', unitNumber: 7, lessonNumber: 6, title: 'Scatterplots', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Calculating residuals (actual minus predicted) from linear models.' },
      { code: 'Math U7.7', unitNumber: 7, lessonNumber: 7, title: 'Linear and exponential growth', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Writing exponential models from two data points.' },
      { code: 'Math U7.8', unitNumber: 7, lessonNumber: 8, title: 'Probability and relative frequency', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Conditional probability given a specific subgroup.' },
      { code: 'Math U7.9', unitNumber: 7, lessonNumber: 9, title: 'Data inferences', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Generalizing survey findings and avoiding sampling bias.' },
      { code: 'Math U7.10', unitNumber: 7, lessonNumber: 10, title: 'Evaluating statistical claims', domain: 'problem-solving', tier: 'medium', recommendedMinutes: 25, description: 'Interpreting confidence intervals and study conclusions.' }
    ]
  },
  {
    unitNumber: 8,
    title: 'Medium: Advanced Math',
    subject: 'math',
    tier: 'medium',
    domain: 'advanced-math',
    description: 'Quadratic systems, root theorems, vertex optimization, and rational operations.',
    lessons: [
      { code: 'Math U8.1', unitNumber: 8, lessonNumber: 1, title: 'Factoring quadratic and polynomial expressions', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Factoring higher-degree polynomials using u-substitution.' },
      { code: 'Math U8.2', unitNumber: 8, lessonNumber: 2, title: 'Radicals and rational exponents', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Equations with radical expressions and checking extraneous solutions.' },
      { code: 'Math U8.3', unitNumber: 8, lessonNumber: 3, title: 'Operations with polynomials', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Remainder theorem and finding polynomial coefficients.' },
      { code: 'Math U8.4', unitNumber: 8, lessonNumber: 4, title: 'Operations with rational expressions', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Simplifying complex fractions with algebraic terms in numerators and denominators.' },
      { code: 'Math U8.5', unitNumber: 8, lessonNumber: 5, title: 'Nonlinear functions', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Transformations of functions: f(x-h) + k shifts and reflections.' },
      { code: 'Math U8.6', unitNumber: 8, lessonNumber: 6, title: 'Isolating quantities', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Formulas involving square roots and fractions with the target variable on both sides.' },
      { code: 'Math U8.7', unitNumber: 8, lessonNumber: 7, title: 'Solving quadratic equations', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Using discriminant b² - 4ac to count real roots and find parameter values.' },
      { code: 'Math U8.8', unitNumber: 8, lessonNumber: 8, title: 'Linear and quadratic systems', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Algebraic substitution leading to quadratic equations with 0, 1, or 2 solutions.' },
      { code: 'Math U8.9', unitNumber: 8, lessonNumber: 9, title: 'Radical, rational, and absolute value equations', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Equations where isolated terms produce double cases or extraneous roots.' },
      { code: 'Math U8.10', unitNumber: 8, lessonNumber: 10, title: 'Quadratic and exponential word problems', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Finding the optimal vertex value vs. finding the zero.' },
      { code: 'Math U8.11', unitNumber: 8, lessonNumber: 11, title: 'Quadratic graphs', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Converting standard form ax² + bx + c to vertex form a(x-h)² + k.' },
      { code: 'Math U8.12', unitNumber: 8, lessonNumber: 12, title: 'Exponential graphs', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Interpreting base multiplier a(b)^(t/k) when time is scaled.' },
      { code: 'Math U8.13', unitNumber: 8, lessonNumber: 13, title: 'Polynomial and other nonlinear graphs', domain: 'advanced-math', tier: 'medium', recommendedMinutes: 30, description: 'Finding polynomial equations given root coordinates and one other point.' }
    ]
  },
  {
    unitNumber: 9,
    title: 'Medium: Geometry and Trigonometry',
    subject: 'math',
    tier: 'medium',
    domain: 'geometry-trig',
    description: 'Volume ratios, complementary angle trigonometry, circle sectors, and completing the square for circles.',
    lessons: [
      { code: 'Math U9.1', unitNumber: 9, lessonNumber: 1, title: 'Area and volume', domain: 'geometry-trig', tier: 'medium', recommendedMinutes: 35, description: 'Geometric scaling: if length scales by k, area scales by k² and volume scales by k³.' },
      { code: 'Math U9.2', unitNumber: 9, lessonNumber: 2, title: 'Congruence, similarity, and angle relationships', domain: 'geometry-trig', tier: 'medium', recommendedMinutes: 35, description: 'Nested similar triangles sharing a common angle.' },
      { code: 'Math U9.3', unitNumber: 9, lessonNumber: 3, title: 'Right triangle trigonometry', domain: 'geometry-trig', tier: 'medium', recommendedMinutes: 35, description: 'Complementary angle identity: sin(x) = cos(90° - x).' },
      { code: 'Math U9.4', unitNumber: 9, lessonNumber: 4, title: 'Circle theorems', domain: 'geometry-trig', tier: 'medium', recommendedMinutes: 35, description: 'Tangent lines perpendicular to radii at contact points.' },
      { code: 'Math U9.5', unitNumber: 9, lessonNumber: 5, title: 'Unit circle trigonometry', domain: 'geometry-trig', tier: 'medium', recommendedMinutes: 35, description: 'Sign of trig ratios in quadrants I, II, III, and IV.' },
      { code: 'Math U9.6', unitNumber: 9, lessonNumber: 6, title: 'Circle equations', domain: 'geometry-trig', tier: 'medium', recommendedMinutes: 35, description: 'Completing the square on x² + y² + Ax + By + C = 0 to extract radius.' }
    ]
  },

  // ADVANCED TIER (Units 10, 11, 12, 13)
  {
    unitNumber: 10,
    title: 'Advanced: Algebra',
    subject: 'math',
    tier: 'advanced',
    domain: 'algebra',
    description: 'Hard multi-variable constraints, infinite solutions parameters, and Desmos regression hacks.',
    lessons: [
      { code: 'Math U10.1', unitNumber: 10, lessonNumber: 1, title: 'Solving linear equations and inequalities', domain: 'algebra', tier: 'advanced', recommendedMinutes: 30, description: 'Parametric constants k and c where the equation has no solution for all x.' },
      { code: 'Math U10.2', unitNumber: 10, lessonNumber: 2, title: 'Linear equation word problems', domain: 'algebra', tier: 'advanced', recommendedMinutes: 30, description: 'Multi-condition rate models with fractional unit conversions.' },
      { code: 'Math U10.3', unitNumber: 10, lessonNumber: 3, title: 'Linear relationship word problems', domain: 'algebra', tier: 'advanced', recommendedMinutes: 30, description: 'Interpreting non-standard coefficients in scientific and economic models.' },
      { code: 'Math U10.4', unitNumber: 10, lessonNumber: 4, title: 'Graphs of linear equations and functions', domain: 'algebra', tier: 'advanced', recommendedMinutes: 30, description: 'Rotating lines and determining bounded area with coordinate axes.' },
      { code: 'Math U10.5', unitNumber: 10, lessonNumber: 5, title: 'Solving systems of linear equations', domain: 'algebra', tier: 'advanced', recommendedMinutes: 30, description: 'Constant ratio systems where equations are multiples of each other.' },
      { code: 'Math U10.6', unitNumber: 10, lessonNumber: 6, title: 'Systems of linear equations word problems', domain: 'algebra', tier: 'advanced', recommendedMinutes: 30, description: 'Optimization with integer constraints and multi-variable dependencies.' },
      { code: 'Math U10.7', unitNumber: 10, lessonNumber: 7, title: 'Linear inequality word problems', domain: 'algebra', tier: 'advanced', recommendedMinutes: 30, description: 'Determining the maximum possible integer value that satisfies multiple inequalities.' },
      { code: 'Math U10.8', unitNumber: 10, lessonNumber: 8, title: 'Graphs of linear systems and inequalities', domain: 'algebra', tier: 'advanced', recommendedMinutes: 30, description: 'Area of bounded polygonal regions formed by multiple intersecting linear inequalities.' }
    ]
  },
  {
    unitNumber: 11,
    title: 'Advanced: Problem Solving and Data Analysis',
    subject: 'math',
    tier: 'advanced',
    domain: 'problem-solving',
    description: 'Complex statistical modeling, exponential decay constants, and advanced standard deviation comparison.',
    lessons: [
      { code: 'Math U11.1', unitNumber: 11, lessonNumber: 1, title: 'Ratios, rates, and proportions', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Density, speed, and multi-stage work-rate problems.' },
      { code: 'Math U11.2', unitNumber: 11, lessonNumber: 2, title: 'Unit conversion', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Complex scientific compound rate conversions.' },
      { code: 'Math U11.3', unitNumber: 11, lessonNumber: 3, title: 'Percentages', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Compound interest with variable compounding frequencies: A = P(1 + r/n)^(nt).' },
      { code: 'Math U11.4', unitNumber: 11, lessonNumber: 4, title: 'Center, spread, and shape of distributions', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Comparing standard deviations across frequency distributions with shifted clusters.' },
      { code: 'Math U11.5', unitNumber: 11, lessonNumber: 5, title: 'Data representations', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Reconstructing sample sets from box plots and quartile differences.' },
      { code: 'Math U11.6', unitNumber: 11, lessonNumber: 6, title: 'Scatterplots', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Exponential and quadratic regressions using Desmos regression models.' },
      { code: 'Math U11.7', unitNumber: 11, lessonNumber: 7, title: 'Linear and exponential growth', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Converting half-life models to daily percentage decay rates.' },
      { code: 'Math U11.8', unitNumber: 11, lessonNumber: 8, title: 'Probability and relative frequency', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Complex multi-stage conditional probability with dependent outcomes.' },
      { code: 'Math U11.9', unitNumber: 11, lessonNumber: 9, title: 'Data inferences', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Evaluating validity of randomized controlled experiments vs. observational studies.' },
      { code: 'Math U11.10', unitNumber: 11, lessonNumber: 10, title: 'Evaluating statistical claims', domain: 'problem-solving', tier: 'advanced', recommendedMinutes: 30, description: 'Margin of error scaling: why quadrupling sample size halves margin of error.' }
    ]
  },
  {
    unitNumber: 12,
    title: 'Advanced: Advanced Math',
    subject: 'math',
    tier: 'advanced',
    domain: 'advanced-math',
    description: 'Discriminant constants, Vieta’s root formulas, polynomial remainder synthesis, and nonlinear systems.',
    lessons: [
      { code: 'Math U12.1', unitNumber: 12, lessonNumber: 1, title: 'Factoring quadratic and polynomial expressions', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Advanced polynomial identities: x³ - y³ = (x - y)(x² + xy + y²).' },
      { code: 'Math U12.2', unitNumber: 12, lessonNumber: 2, title: 'Radicals and rational exponents', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'High-degree radical equations and nested root simplifications.' },
      { code: 'Math U12.3', unitNumber: 12, lessonNumber: 3, title: 'Operations with polynomials', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Polynomial remainder theorem: evaluating P(a) directly to find remainder.' },
      { code: 'Math U12.4', unitNumber: 12, lessonNumber: 4, title: 'Operations with rational expressions', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Equating coefficients across decomposed rational fractions.' },
      { code: 'Math U12.5', unitNumber: 12, lessonNumber: 5, title: 'Nonlinear functions', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Inverting functions and solving composite equations f(g(x)) = c.' },
      { code: 'Math U12.6', unitNumber: 12, lessonNumber: 6, title: 'Isolating quantities', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Multi-term rational physics equations solved for nested denominator terms.' },
      { code: 'Math U12.7', unitNumber: 12, lessonNumber: 7, title: 'Solving quadratic equations', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Vieta’s formulas: sum of roots = -b/a and product of roots = c/a.' },
      { code: 'Math U12.8', unitNumber: 12, lessonNumber: 8, title: 'Linear and quadratic systems', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Tangency condition where line is tangent to parabola (discriminant = 0).' },
      { code: 'Math U12.9', unitNumber: 12, lessonNumber: 9, title: 'Radical, rational, and absolute value equations', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Equations with nested absolute values and boundary root tests.' },
      { code: 'Math U12.10', unitNumber: 12, lessonNumber: 10, title: 'Quadratic and exponential word problems', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Multi-variable optimization and time-to-peak projectile problems.' },
      { code: 'Math U12.11', unitNumber: 12, lessonNumber: 11, title: 'Quadratic graphs', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Calculating y-intercept and vertex coordinates when equation contains unknown constants.' },
      { code: 'Math U12.12', unitNumber: 12, lessonNumber: 12, title: 'Exponential graphs', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Determining exact percentage growth rate when time exponent is divided by k.' },
      { code: 'Math U12.13', unitNumber: 12, lessonNumber: 13, title: 'Polynomial and other nonlinear graphs', domain: 'advanced-math', tier: 'advanced', recommendedMinutes: 35, description: 'Determining the minimum possible degree of a polynomial from its turning points.' }
    ]
  },
  {
    unitNumber: 13,
    title: 'Advanced: Geometry and Trigonometry',
    subject: 'math',
    tier: 'advanced',
    domain: 'geometry-trig',
    description: 'High-difficulty circle intersections, radian arc sectors, 3D volume synthesis, and trig identities.',
    lessons: [
      { code: 'Math U13.1', unitNumber: 13, lessonNumber: 1, title: 'Area and volume', domain: 'geometry-trig', tier: 'advanced', recommendedMinutes: 40, description: 'Water displacement, hollowed cylinders, and composite frustum volume.' },
      { code: 'Math U13.2', unitNumber: 13, lessonNumber: 2, title: 'Congruence, similarity, and angle relationships', domain: 'geometry-trig', tier: 'advanced', recommendedMinutes: 40, description: 'Multi-step proofs involving cyclic quadrilaterals and intersecting secants.' },
      { code: 'Math U13.3', unitNumber: 13, lessonNumber: 3, title: 'Right triangle trigonometry', domain: 'geometry-trig', tier: 'advanced', recommendedMinutes: 40, description: 'Using tangent and co-tangent ratios across dual right triangles sharing a common leg.' },
      { code: 'Math U13.4', unitNumber: 13, lessonNumber: 4, title: 'Circle theorems', domain: 'geometry-trig', tier: 'advanced', recommendedMinutes: 40, description: 'Inscribed angle subtending a diameter is always 90°; secant-tangent power of a point theorem.' },
      { code: 'Math U13.5', unitNumber: 13, lessonNumber: 5, title: 'Unit circle trigonometry', domain: 'geometry-trig', tier: 'advanced', recommendedMinutes: 40, description: 'Pythagorean identity: sin²(θ) + cos²(θ) = 1 and solving for coordinates on the unit circle.' },
      { code: 'Math U13.6', unitNumber: 13, lessonNumber: 6, title: 'Circle equations', domain: 'geometry-trig', tier: 'advanced', recommendedMinutes: 40, description: 'Line tangent to circle at point (x₁, y₁): finding line perpendicular to radius.' }
    ]
  }
];

export const KHAN_RW_UNITS: KhanUnitInfo[] = [
  // FOUNDATIONS TIER
  {
    unitNumber: 2,
    title: 'Foundations: Information and Ideas',
    subject: 'rw',
    tier: 'foundations',
    domain: 'information-ideas',
    description: 'Central themes, main claims, textual details, and direct table evidence.',
    lessons: [
      { code: 'R&W U2.1', unitNumber: 2, lessonNumber: 1, title: 'Central ideas and details', domain: 'information-ideas', tier: 'foundations', recommendedMinutes: 20, description: 'Isolating the primary thesis statement and key supporting details.' },
      { code: 'R&W U2.2', unitNumber: 2, lessonNumber: 2, title: 'Inferences', domain: 'information-ideas', tier: 'foundations', recommendedMinutes: 20, description: 'Drawing strictly logically necessary conclusions directly implied by the text.' },
      { code: 'R&W U2.3', unitNumber: 2, lessonNumber: 3, title: 'Command of textual evidence', domain: 'information-ideas', tier: 'foundations', recommendedMinutes: 20, description: 'Finding the exact quote or finding that directly supports a researcher’s claim.' },
      { code: 'R&W U2.4', unitNumber: 2, lessonNumber: 4, title: 'Command of quantitative evidence', domain: 'information-ideas', tier: 'foundations', recommendedMinutes: 20, description: 'Reading data tables, bar graphs, and charts to support an argument without misinterpreting units.' }
    ]
  },
  {
    unitNumber: 3,
    title: 'Foundations: Craft and Structure',
    subject: 'rw',
    tier: 'foundations',
    domain: 'craft-structure',
    description: 'Words in context, paragraph purpose, and author perspective.',
    lessons: [
      { code: 'R&W U3.1', unitNumber: 3, lessonNumber: 1, title: 'Words in context', domain: 'craft-structure', tier: 'foundations', recommendedMinutes: 20, description: 'Deciding vocabulary meaning strictly from contextual tone and sentence clues.' },
      { code: 'R&W U3.2', unitNumber: 3, lessonNumber: 2, title: 'Text structure and purpose', domain: 'craft-structure', tier: 'foundations', recommendedMinutes: 20, description: 'Analyzing the overarching organizational structure and function of underlined sentences.' },
      { code: 'R&W U3.3', unitNumber: 3, lessonNumber: 3, title: 'Cross-text connections', domain: 'craft-structure', tier: 'foundations', recommendedMinutes: 20, description: 'Comparing author perspectives between Text 1 and Text 2 on the same topic.' }
    ]
  },
  {
    unitNumber: 4,
    title: 'Foundations: Expression of Ideas & Conventions',
    subject: 'rw',
    tier: 'foundations',
    domain: 'expression-ideas',
    description: 'Transitions, rhetorical synthesis, and introductory sentence structure.',
    lessons: [
      { code: 'R&W U4.1', unitNumber: 4, lessonNumber: 1, title: 'Transitions', domain: 'expression-ideas', tier: 'foundations', recommendedMinutes: 20, description: 'Selecting appropriate transition words (contrast, continuation, causation) between sentences.' },
      { code: 'R&W U4.2', unitNumber: 4, lessonNumber: 2, title: 'Rhetorical synthesis', domain: 'expression-ideas', tier: 'foundations', recommendedMinutes: 20, description: 'Synthesizing bulleted research notes to satisfy a very specific writing goal.' },
      { code: 'R&W U4.3', unitNumber: 4, lessonNumber: 3, title: 'Form, structure, and sense', domain: 'conventions', tier: 'foundations', recommendedMinutes: 20, description: 'Basic subject-verb agreement and singular/plural pronoun consistency.' },
      { code: 'R&W U4.4', unitNumber: 4, lessonNumber: 4, title: 'Boundaries', domain: 'conventions', tier: 'foundations', recommendedMinutes: 20, description: 'Preventing run-on sentences, comma splices, and fragments using periods and semicolons.' }
    ]
  },

  // MEDIUM TIER (Units 5, 6, 7)
  {
    unitNumber: 5,
    title: 'Medium: Information and Ideas',
    subject: 'rw',
    tier: 'medium',
    domain: 'information-ideas',
    description: 'Complex textual claims, multi-sentence inferences, and scientific data tables.',
    lessons: [
      { code: 'R&W U5.1', unitNumber: 5, lessonNumber: 1, title: 'Command of textual evidence', domain: 'information-ideas', tier: 'medium', recommendedMinutes: 22, description: 'Identifying evidence that weakens, undermines, or substantiates a scientific hypothesis.' },
      { code: 'R&W U5.2', unitNumber: 5, lessonNumber: 2, title: 'Command of quantitative evidence', domain: 'information-ideas', tier: 'medium', recommendedMinutes: 22, description: 'Verifying comparative claims using multi-column data charts and percentage breakdowns.' },
      { code: 'R&W U5.3', unitNumber: 5, lessonNumber: 3, title: 'Central ideas and details', domain: 'information-ideas', tier: 'medium', recommendedMinutes: 22, description: 'Extracting nuanced secondary implications in dense humanities passages.' },
      { code: 'R&W U5.4', unitNumber: 5, lessonNumber: 4, title: 'Inferences', domain: 'information-ideas', tier: 'medium', recommendedMinutes: 22, description: 'Predicting the most logical conclusion of an argument without assuming unstated premises.' }
    ]
  },
  {
    unitNumber: 6,
    title: 'Medium: Craft and Structure',
    subject: 'rw',
    tier: 'medium',
    domain: 'craft-structure',
    description: 'Secondary word definitions, rhetorical shifts, and dual-passage rebuttals.',
    lessons: [
      { code: 'R&W U6.1', unitNumber: 6, lessonNumber: 1, title: 'Words in context', domain: 'craft-structure', tier: 'medium', recommendedMinutes: 22, description: 'High-frequency SAT vocabulary and words with multiple technical or poetic meanings.' },
      { code: 'R&W U6.2', unitNumber: 6, lessonNumber: 2, title: 'Text structure and purpose', domain: 'craft-structure', tier: 'medium', recommendedMinutes: 22, description: 'Tracking the progression of thought: hypothesis, counter-evidence, and revised thesis.' },
      { code: 'R&W U6.3', unitNumber: 6, lessonNumber: 3, title: 'Cross-text connections', domain: 'craft-structure', tier: 'medium', recommendedMinutes: 22, description: 'Predicting how the author of Text 2 would respond to a specific finding mentioned in Text 1.' }
    ]
  },
  {
    unitNumber: 7,
    title: 'Medium: Expression of Ideas & Conventions',
    subject: 'rw',
    tier: 'medium',
    domain: 'expression-ideas',
    description: 'Nuanced logical connectors, compound goals in synthesis, and punctuation rules.',
    lessons: [
      { code: 'R&W U7.1', unitNumber: 7, lessonNumber: 1, title: 'Transitions', domain: 'expression-ideas', tier: 'medium', recommendedMinutes: 22, description: 'Selecting subtle transitions such as "furthermore", "nonetheless", "conversely", and "subsequently".' },
      { code: 'R&W U7.2', unitNumber: 7, lessonNumber: 2, title: 'Rhetorical synthesis', domain: 'expression-ideas', tier: 'medium', recommendedMinutes: 22, description: 'Satisfying compound prompts: e.g. "introduce the scientist AND highlight her key discovery".' },
      { code: 'R&W U7.3', unitNumber: 7, lessonNumber: 3, title: 'Form, structure, and sense', domain: 'conventions', tier: 'medium', recommendedMinutes: 22, description: 'Subject-verb agreement when long prepositional or parenthetical phrases intervene.' },
      { code: 'R&W U7.4', unitNumber: 7, lessonNumber: 4, title: 'Boundaries', domain: 'conventions', tier: 'medium', recommendedMinutes: 22, description: 'Colons and dashes: introducing explanations, lists, or dramatic emphasis.' }
    ]
  },

  // HARD TIER (Units 8, 9, 10)
  {
    unitNumber: 8,
    title: 'Hard: Information and Ideas',
    subject: 'rw',
    tier: 'advanced',
    domain: 'information-ideas',
    description: 'High-density science experiments, dual-variable data graphs, and subtle argumentative gaps.',
    lessons: [
      { code: 'R&W U8.1', unitNumber: 8, lessonNumber: 1, title: 'Command of textual evidence', domain: 'information-ideas', tier: 'advanced', recommendedMinutes: 25, description: 'Distinguishing between direct textual proof and tempting answer choices that are true in reality but unmentioned.' },
      { code: 'R&W U8.2', unitNumber: 8, lessonNumber: 2, title: 'Command of quantitative evidence', domain: 'information-ideas', tier: 'advanced', recommendedMinutes: 25, description: 'Evaluating complex data relationships where axes have logarithmic scales or relative percentage baselines.' },
      { code: 'R&W U8.3', unitNumber: 8, lessonNumber: 3, title: 'Central ideas and details', domain: 'information-ideas', tier: 'advanced', recommendedMinutes: 25, description: 'Dissecting archaic 19th-century and philosophical prose.' },
      { code: 'R&W U8.4', unitNumber: 8, lessonNumber: 4, title: 'Inferences', domain: 'information-ideas', tier: 'advanced', recommendedMinutes: 25, description: 'Completing the final sentence of an academic research summary.' }
    ]
  },
  {
    unitNumber: 9,
    title: 'Hard: Craft and Structure',
    subject: 'rw',
    tier: 'advanced',
    domain: 'craft-structure',
    description: 'Archaic vocabulary, multi-layer text functions, and deep philosophical contrasts.',
    lessons: [
      { code: 'R&W U9.1', unitNumber: 9, lessonNumber: 1, title: 'Words in context', domain: 'craft-structure', tier: 'advanced', recommendedMinutes: 25, description: 'Extreme precision: choosing between four near-synonyms based on connotative nuance.' },
      { code: 'R&W U9.2', unitNumber: 9, lessonNumber: 2, title: 'Text structure and purpose', domain: 'craft-structure', tier: 'advanced', recommendedMinutes: 25, description: 'Deconstructing the dual function of an underlined phrase within the broader rhetorical architecture.' },
      { code: 'R&W U9.3', unitNumber: 9, lessonNumber: 3, title: 'Cross-text connections', domain: 'craft-structure', tier: 'advanced', recommendedMinutes: 25, description: 'Complex scholarly debates where Text 2 qualifies or limits the scope of Text 1’s general theory.' }
    ]
  },
  {
    unitNumber: 10,
    title: 'Hard: Expression of Ideas',
    subject: 'rw',
    tier: 'advanced',
    domain: 'expression-ideas',
    description: 'High-difficulty rhetorical synthesis constraints and advanced transitional flow.',
    lessons: [
      { code: 'R&W U10.1', unitNumber: 10, lessonNumber: 1, title: 'Transitions', domain: 'expression-ideas', tier: 'advanced', recommendedMinutes: 25, description: 'Eliminating transition traps where a word sounds smooth but violates logical direction.' },
      { code: 'R&W U10.2', unitNumber: 10, lessonNumber: 2, title: 'Rhetorical synthesis', domain: 'expression-ideas', tier: 'advanced', recommendedMinutes: 25, description: 'Strict audience-focused synthesis: adapting tone and eliminating irrelevant notes entirely.' },
      { code: 'R&W U10.3', unitNumber: 10, lessonNumber: 3, title: 'Form, structure, and sense', domain: 'conventions', tier: 'advanced', recommendedMinutes: 25, description: 'Inverted sentence structures and compound subject agreement traps.' },
      { code: 'R&W U10.4', unitNumber: 10, lessonNumber: 4, title: 'Boundaries', domain: 'conventions', tier: 'advanced', recommendedMinutes: 25, description: 'Parenthetical dashes vs. appositive commas and colon rules for independent clauses.' }
    ]
  },

  // ADVANCED CONVENTIONS (Units 11 & 12)
  {
    unitNumber: 11,
    title: 'Advanced: Comprehensive Conventions Mastery',
    subject: 'rw',
    tier: 'conventions',
    domain: 'conventions',
    description: 'Synthesizing all grammar, clause boundaries, and reading question types under timed conditions.',
    lessons: [
      { code: 'R&W U11.1', unitNumber: 11, lessonNumber: 1, title: 'Command of evidence', domain: 'information-ideas', tier: 'conventions', recommendedMinutes: 35, description: 'Mixed textual and quantitative evidence speed drills.' },
      { code: 'R&W U11.2', unitNumber: 11, lessonNumber: 2, title: 'Central ideas and details + inferences', domain: 'information-ideas', tier: 'conventions', recommendedMinutes: 35, description: 'High-speed paragraph thesis and implication extraction.' },
      { code: 'R&W U11.3', unitNumber: 11, lessonNumber: 3, title: 'Words in context', domain: 'craft-structure', tier: 'conventions', recommendedMinutes: 35, description: 'Rapid vocabulary identification under strict 60-second-per-question limits.' },
      { code: 'R&W U11.4', unitNumber: 11, lessonNumber: 4, title: 'Text structure and purpose + cross-text connections', domain: 'craft-structure', tier: 'conventions', recommendedMinutes: 35, description: 'Dual passage synthesis drills.' },
      { code: 'R&W U11.5', unitNumber: 11, lessonNumber: 5, title: 'Boundaries + form, structure, and sense', domain: 'conventions', tier: 'conventions', recommendedMinutes: 35, description: 'Rapid identification of clause independence and comma splices.' },
      { code: 'R&W U11.6', unitNumber: 11, lessonNumber: 6, title: 'Transitions + rhetorical synthesis', domain: 'expression-ideas', tier: 'conventions', recommendedMinutes: 35, description: 'Goal-driven synthesis and transition placement under pressure.' }
    ]
  },
  {
    unitNumber: 12,
    title: 'Advanced: Standard English Conventions Precision Drills',
    subject: 'rw',
    tier: 'conventions',
    domain: 'conventions',
    description: 'Targeted single-rule mastery: subject-verb, pronouns, plurals, verb forms, modifiers, linking clauses, supplements, and punctuation.',
    lessons: [
      { code: 'R&W U12.1', unitNumber: 12, lessonNumber: 1, title: 'Subject-verb agreement', domain: 'conventions', tier: 'conventions', recommendedMinutes: 15, description: 'Matching singular/plural verbs with compound, collective, and inverted subjects.' },
      { code: 'R&W U12.2', unitNumber: 12, lessonNumber: 2, title: 'Pronoun-antecedent agreement', domain: 'conventions', tier: 'conventions', recommendedMinutes: 15, description: 'Singular "they", pronoun ambiguity, and matching number and gender with true antecedents.' },
      { code: 'R&W U12.3', unitNumber: 12, lessonNumber: 3, title: 'Plurals and possessives', domain: 'conventions', tier: 'conventions', recommendedMinutes: 15, description: 'Apostrophe rules: distinguishing plural nouns, singular possessive (\'s), and plural possessive (s\').' },
      { code: 'R&W U12.4', unitNumber: 12, lessonNumber: 4, title: 'Verb forms', domain: 'conventions', tier: 'conventions', recommendedMinutes: 15, description: 'Past perfect (had done), simple past, conditionals (would have), and finite vs. non-finite verbs (-ing).' },
      { code: 'R&W U12.5', unitNumber: 12, lessonNumber: 5, title: 'Subject-modifier placement', domain: 'conventions', tier: 'conventions', recommendedMinutes: 15, description: 'Eliminating dangling and misplaced modifiers: whatever noun is modified must immediately follow the introductory comma.' },
      { code: 'R&W U12.6', unitNumber: 12, lessonNumber: 6, title: 'Linking clauses', domain: 'conventions', tier: 'conventions', recommendedMinutes: 15, description: 'Correct coordination using FANBOYS with commas vs. semicolons and subordinating conjunctions.' },
      { code: 'R&W U12.7', unitNumber: 12, lessonNumber: 7, title: 'Supplements', domain: 'conventions', tier: 'conventions', recommendedMinutes: 15, description: 'Setting off non-essential descriptive appositives and relative clauses using paired commas, parentheses, or paired dashes.' },
      { code: 'R&W U12.8', unitNumber: 12, lessonNumber: 8, title: 'Punctuation', domain: 'conventions', tier: 'conventions', recommendedMinutes: 15, description: 'Comprehensive punctuation checklist: colons, semicolons, dashes, apostrophes, and comma economy.' }
    ]
  }
];

export function getAllKhanLessons(): KhanLessonItem[] {
  const math = KHAN_MATH_UNITS.flatMap((u) => u.lessons);
  const rw = KHAN_RW_UNITS.flatMap((u) => u.lessons);
  return [...math, ...rw];
}
