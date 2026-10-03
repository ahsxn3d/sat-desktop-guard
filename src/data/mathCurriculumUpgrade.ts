export interface MathFormulaItem {
  label: string;
  formula: string;
  explanation: string;
}

export interface MathDifficultyEscalation {
  foundations: {
    unitLabel: string;
    description: string;
    example?: string;
  };
  medium: {
    unitLabel: string;
    description: string;
    example?: string;
  };
  hard: {
    unitLabel: string;
    description: string;
    example?: string;
  };
}

export interface OfficialMathLesson {
  id: string;
  domainId: 'algebra' | 'problem-solving' | 'advanced-math' | 'geometry-trig';
  domainTitle: string;
  domainNumber: 1 | 2 | 3 | 4;
  lessonNumber: number;
  totalLessonsInDomain: number;
  lessonTitle: string;
  badge: string;
  subtitle: string;
  formulasAndRules: MathFormulaItem[];
  solvingMethod: string;
  difficultyEscalation: MathDifficultyEscalation;
  desmosHack?: string;
  conceptsForLogging: string[];
}

export interface OfficialMathDomain {
  domainId: 'algebra' | 'problem-solving' | 'advanced-math' | 'geometry-trig';
  domainNumber: 1 | 2 | 3 | 4;
  domainTitle: string;
  badge: string;
  description: string;
  foundationsUnit: number;
  mediumUnit: number;
  advancedUnit: number;
  lessons: OfficialMathLesson[];
}

// ==============================================================================
// DOMAIN 1: ALGEBRA (8 LESSONS)
// Units 2 (Foundations), 6 (Medium), 10 (Advanced)
// ==============================================================================
export const DOMAIN_1_ALGEBRA_LESSONS: OfficialMathLesson[] = [
  {
    id: 'alg-l1-solving-linear-equations-inequalities',
    domainId: 'algebra',
    domainTitle: 'Domain 1: Algebra',
    domainNumber: 1,
    lessonNumber: 1,
    totalLessonsInDomain: 8,
    lessonTitle: 'Solving Linear Equations and Linear Inequalities',
    badge: 'Core Foundation',
    subtitle: 'Variable isolation mechanics, negative multiplier sign flips, and single-variable constraint analysis.',
    formulasAndRules: [
      {
        label: 'Isolate x',
        formula: 'ax + b = c ──► ax = c - b ──► x = (c - b) / a',
        explanation: 'Subtract constant b from both sides, then divide by variable coefficient a.'
      },
      {
        label: 'Negative Multiplication / Division Sign Flip',
        formula: '-ax ≥ b ──► x ≤ -b / a  (FLIP the sign!)',
        explanation: 'Multiplying or dividing both sides by a negative number ALWAYS reverses the inequality symbol.'
      }
    ],
    solvingMethod: 'Distribute parentheses, combine like terms, move all variable terms to one side and constants to the other, then divide by the coefficient.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 2: Foundations',
        description: 'Simple integers with direct 1-step or 2-step isolation.',
        example: '3x + 5 = 20  ──►  3x = 15  ──►  x = 5'
      },
      medium: {
        unitLabel: 'Unit 6: Medium',
        description: 'Equations containing multiple fractions or requiring common denominators.',
        example: '(2/3)x - (1/4) = 5/6  ──►  Multiply through by LCD 12: 8x - 3 = 10'
      },
      hard: {
        unitLabel: 'Unit 10: Advanced (750+)',
        description: 'Equations with unknown constants a and b where you determine constraints for which no real value of x exists (or infinitely many values exist).',
        example: 'ax + 3 = 2(x - b) has no solution when a = 2 and 3 ≠ -2b'
      }
    },
    desmosHack: 'Type left side into row 1 (y = Left) and right side into row 2 (y = Right). Click the intersection point; the x-coordinate is your exact answer without manual algebra.',
    conceptsForLogging: [
      'Linear equation isolation: ax + b = c',
      'Inequality negative sign flip: -ax ≥ b → x ≤ -b/a',
      'Fractional linear equations with LCD',
      'Equations with unknown constants a and b',
      'No solution / infinite solution linear constraints'
    ]
  },
  {
    id: 'alg-l2-linear-equation-word-problems',
    domainId: 'algebra',
    domainTitle: 'Domain 1: Algebra',
    domainNumber: 1,
    lessonNumber: 2,
    totalLessonsInDomain: 8,
    lessonTitle: 'Linear Equation Word Problems',
    badge: 'Word Problems',
    subtitle: 'Translating real-world scenarios into y = mx + b, fixed fees, and variable rate equations.',
    formulasAndRules: [
      {
        label: 'Total Cost / Value Model',
        formula: 'y = m · x + b',
        explanation: 'm = Rate per unit (variable change), b = Flat fee / starting amount (constant baseline at x = 0).'
      }
    ],
    solvingMethod: 'Identify what is constant (starting amount b) and what changes repeatedly with each unit (m · x). Set up the linear equation y = mx + b and solve for the requested quantity.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 2: Foundations',
        description: 'Clear, direct rates with easily identifiable starting values.',
        example: '$50 flat fee plus $15 per hour  ──►  Total = 15h + 50'
      },
      medium: {
        unitLabel: 'Unit 6: Medium',
        description: 'Budgets with limits and inequality thresholds.',
        example: '15x + 50 ≤ 200  ──►  Solve for maximum integer units x possible'
      },
      hard: {
        unitLabel: 'Unit 10: Advanced (750+)',
        description: 'Multi-tiered rates with piecewise changes across intervals.',
        example: '$20 flat fee for the first 2 hours, then $8 per additional half-hour: y = 20 + 8 · 2(h - 2) for h > 2'
      }
    },
    conceptsForLogging: [
      'Linear model: Total = mx + b',
      'Flat fee vs variable unit rate identification',
      'Linear budget constraint inequalities',
      'Multi-tiered / piecewise rate word problems'
    ]
  },
  {
    id: 'alg-l3-linear-relationship-word-problems',
    domainId: 'algebra',
    domainTitle: 'Domain 1: Algebra',
    domainNumber: 1,
    lessonNumber: 3,
    totalLessonsInDomain: 8,
    lessonTitle: 'Linear Relationship Word Problems',
    badge: 'Context Interpretation',
    subtitle: 'Interpreting slope rates of change and y-intercept constants in scientific and economic contexts.',
    formulasAndRules: [
      {
        label: 'Slope (m) in Context',
        formula: 'm = Δy / Δx (Rate of Change)',
        explanation: 'Amount that y increases or decreases for every 1-unit increase in x.'
      },
      {
        label: 'y-Intercept (b) in Context',
        formula: 'b = Value of y when x = 0',
        explanation: 'Baseline, initial value, or starting measurement before any change occurs.'
      }
    ],
    solvingMethod: 'The SAT often gives a formula like H = 1.5t + 20 and asks: "What does the number 1.5 mean in this context?" Match m directly to the unit of x (e.g., increase in height per year). Match b to the baseline value when t = 0.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 2: Foundations',
        description: 'Identify the starting value (b) or constant rate (m) directly from a straightforward formula.',
        example: 'In P = 40 + 5w, the starting weight is 40 lbs.'
      },
      medium: {
        unitLabel: 'Unit 6: Medium',
        description: 'Calculate m from a table of values and describe its real-world meaning with units.',
        example: 'Given table of (time, temp), compute slope m = ΔT/Δt and express as "degrees drop per minute".'
      },
      hard: {
        unitLabel: 'Unit 10: Advanced (750+)',
        description: 'Interpret formulas with shifted arguments or grouped variables where the rate only applies after an initial threshold.',
        example: 'In y = 4(x - 5) + 12, the rate of 4 only applies to units beyond the initial 5 units.'
      }
    },
    conceptsForLogging: [
      'Interpreting slope m as unit rate of change',
      'Interpreting y-intercept b as initial baseline at x=0',
      'Contextual matching of coefficients',
      'Shifted argument interpretations: a(x - h) + k'
    ]
  },
  {
    id: 'alg-l4-graphs-of-linear-equations-functions',
    domainId: 'algebra',
    domainTitle: 'Domain 1: Algebra',
    domainNumber: 1,
    lessonNumber: 4,
    totalLessonsInDomain: 8,
    lessonTitle: 'Graphs of Linear Equations and Functions',
    badge: 'Graph Mechanics',
    subtitle: 'Slope calculations, slope-intercept form, standard form conversions, and parallel/perpendicular lines.',
    formulasAndRules: [
      {
        label: 'Slope Formula',
        formula: 'm = (y₂ - y₁) / (x₂ - x₁) = Δy / Δx',
        explanation: 'Rise over run between any two points on the line.'
      },
      {
        label: 'Standard Form to Slope Shortcut',
        formula: 'Ax + By = C ──► Slope = -A/B, y-int = C/B, x-int = C/A',
        explanation: 'Instantly determine slope and intercepts without converting to y = mx + b by hand.'
      },
      {
        label: 'Parallel Lines',
        formula: 'm₁ = m₂',
        explanation: 'Lines have identical slopes and different y-intercepts.'
      },
      {
        label: 'Perpendicular Lines',
        formula: 'm₂ = -1 / m₁  (Negative Reciprocal)',
        explanation: 'Slopes multiply to -1 (e.g., -3/4 becomes +4/3).'
      }
    ],
    solvingMethod: 'Convert any given line into y = mx + b to immediately read the slope and intercept. For standard form Ax + By = C, use slope = -A/B.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 2: Foundations',
        description: 'Find the slope given two simple coordinate points.',
        example: 'Find slope between (2, 3) and (6, 11)  ──►  m = (11 - 3)/(6 - 2) = 8/4 = 2'
      },
      medium: {
        unitLabel: 'Unit 6: Medium',
        description: 'Write the equation of a line perpendicular to a given line passing through a specific point.',
        example: 'Line perpendicular to y = -(3/4)x + 2 passing through (3, -1)  ──►  New slope = +4/3'
      },
      hard: {
        unitLabel: 'Unit 10: Advanced (750+)',
        description: 'A line passes through unknown coordinates with parameter variables and is perpendicular to another line; solve for the parameter.',
        example: 'A line passes through (a, 2a) and (4, a + 1) and is perpendicular to y = 3x - 5; solve for a.'
      }
    },
    conceptsForLogging: [
      'Slope formula m = (y₂ - y₁) / (x₂ - x₁)',
      'Standard form Ax + By = C: slope = -A/B',
      'Parallel line slopes m₁ = m₂',
      'Perpendicular negative reciprocal m₂ = -1/m₁',
      'Parametric coordinate slopes with variable a'
    ]
  },
  {
    id: 'alg-l5-solving-systems-of-linear-equations',
    domainId: 'algebra',
    domainTitle: 'Domain 1: Algebra',
    domainNumber: 1,
    lessonNumber: 5,
    totalLessonsInDomain: 8,
    lessonTitle: 'Solving Systems of Linear Equations',
    badge: 'High Frequency',
    subtitle: 'The 3 solution types, ratio condition criteria, elimination, and substitution.',
    formulasAndRules: [
      {
        label: '1 Unique Solution Condition',
        formula: 'a₁ / a₂ ≠ b₁ / b₂',
        explanation: 'Lines have different slopes and intersect at exactly 1 coordinate point (x, y).'
      },
      {
        label: '0 Solutions (No Solution / Parallel)',
        formula: 'a₁ / a₂ = b₁ / b₂ ≠ c₁ / c₂',
        explanation: 'Lines have identical slopes but different y-intercepts (parallel lines that never meet).'
      },
      {
        label: 'Infinitely Many Solutions',
        formula: 'a₁ / a₂ = b₁ / b₂ = c₁ / c₂',
        explanation: 'Lines have identical slopes and identical y-intercepts (the same exact line).'
      }
    ],
    solvingMethod: 'Use elimination by multiplying one row to match coefficients, or substitution if a variable is already isolated. For "no solution" or "infinite solutions" questions, set up coefficient ratios.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 2: Foundations',
        description: 'Add or subtract two equations directly to eliminate a variable.',
        example: 'x + y = 10 and x - y = 4  ──►  2x = 14  ──►  x = 7, y = 3'
      },
      medium: {
        unitLabel: 'Unit 6: Medium',
        description: 'Multiply both rows by different integers to eliminate a term with fractional solutions.',
        example: '3x + 4y = 11 and 2x - 5y = 19'
      },
      hard: {
        unitLabel: 'Unit 10: Advanced (750+)',
        description: 'Find the unknown constant k that results in "no solution" or "infinitely many solutions".',
        example: 'Given 4x - 6y = 10 and 2x - ky = 7, set 4/2 = -6/(-k)  ──►  2 = 6/k  ──►  k = 3'
      }
    },
    desmosHack: 'Type both equations into Desmos. Click the gray intersection point to read (x, y) immediately. For unknown k, add a slider for k and adjust until lines become parallel.',
    conceptsForLogging: [
      'Linear systems: elimination and substitution',
      '1 unique solution: a₁/a₂ ≠ b₁/b₂',
      'No solution condition: a₁/a₂ = b₁/b₂ ≠ c₁/c₂',
      'Infinite solutions condition: a₁/a₂ = b₁/b₂ = c₁/c₂',
      'Desmos intersection and slider hack for systems'
    ]
  },
  {
    id: 'alg-l6-systems-linear-equations-word-problems',
    domainId: 'algebra',
    domainTitle: 'Domain 1: Algebra',
    domainNumber: 1,
    lessonNumber: 6,
    totalLessonsInDomain: 8,
    lessonTitle: 'Systems of Linear Equations Word Problems',
    badge: 'Word Problems',
    subtitle: 'Quantity vs. value equations, secondary question traps, and mixture problems.',
    formulasAndRules: [
      {
        label: 'Quantity Equation',
        formula: 'x + y = Total Items',
        explanation: 'Represents total headcount, tickets, coins, or units.'
      },
      {
        label: 'Total Value / Cost Equation',
        formula: '(Price₁ · x) + (Price₂ · y) = Total Cost',
        explanation: 'Weights each variable by its monetary value, weight, or percentage.'
      }
    ],
    solvingMethod: 'Set up the quantity equation first, then the value equation. Solve for the requested variable using elimination or substitution.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 2: Foundations',
        description: 'Direct setup of standard tickets or coin counts.',
        example: 'Adult tickets x ($10) and child tickets y ($5): x + y = 100, 10x + 5y = 800'
      },
      medium: {
        unitLabel: 'Unit 6: Medium',
        description: 'Solve for variables, then answer a secondary question (e.g., "What is 3x - y?" or "How many more adults than children?").',
        example: 'Solve for x and y, then compute the difference x - y rather than just x.'
      },
      hard: {
        unitLabel: 'Unit 10: Advanced (750+)',
        description: 'Word problems involving percentage mixtures and chemical solutions.',
        example: 'A 20% acid solution (x) is mixed with a 60% acid solution (y) to make 100 mL of 30% acid solution: x + y = 100, 0.20x + 0.60y = 0.30(100)'
      }
    },
    conceptsForLogging: [
      'Two-equation setup: quantity equation and value equation',
      'Secondary question trap: finding 2x + y instead of x',
      'Percentage mixture systems: c₁x + c₂y = c_total(x + y)',
      'Ticket, coin, and asset allocation word problems'
    ]
  },
  {
    id: 'alg-l7-linear-inequality-word-problems',
    domainId: 'algebra',
    domainTitle: 'Domain 1: Algebra',
    domainNumber: 1,
    lessonNumber: 7,
    totalLessonsInDomain: 8,
    lessonTitle: 'Linear Inequality Word Problems',
    badge: 'Constraint Modeling',
    subtitle: 'Translating English constraint keywords (at least, at most, exceeds) into mathematical inequalities.',
    formulasAndRules: [
      {
        label: 'Minimum Constraints (≥)',
        formula: '"At least", "Minimum", "No less than" ──► ≥',
        explanation: 'Must meet or exceed the threshold value.'
      },
      {
        label: 'Maximum Constraints (≤)',
        formula: '"At most", "Maximum", "No more than" ──► ≤',
        explanation: 'Must stay under or equal to the ceiling value.'
      },
      {
        label: 'Strict Inequalities (> and <)',
        formula: '"Greater than", "Exceeds" ──► >  |  "Fewer than", "Less than" ──► <',
        explanation: 'Strict inequality where equality is not permitted.'
      }
    ],
    solvingMethod: 'Identify constraints in the word problem and match them to the correct inequality symbols. Pay close attention to boundary conditions ("inclusive" vs "strict").',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 2: Foundations',
        description: 'Translate a single constraint directly into an algebraic inequality.',
        example: '"John must earn at least $500"  ──►  E ≥ 500'
      },
      medium: {
        unitLabel: 'Unit 6: Medium',
        description: 'Two simultaneous constraints combining hours and earnings.',
        example: 'Working maximum 40 hours total (x + y ≤ 40) while earning minimum $600 (15x + 20y ≥ 600)'
      },
      hard: {
        unitLabel: 'Unit 10: Advanced (750+)',
        description: 'Identify which coordinate point (x, y) satisfies both constraints simultaneously under edge-case boundary conditions.',
        example: 'Testing corner boundary points to find maximum profit under resource constraints.'
      }
    },
    conceptsForLogging: [
      'Inequality keyword translation: at least (≥), at most (≤)',
      'Multi-constraint systems of linear inequalities',
      'Feasible region corner point testing',
      'Strict vs non-strict boundary conditions'
    ]
  },
  {
    id: 'alg-l8-graphs-linear-systems-inequalities',
    domainId: 'algebra',
    domainTitle: 'Domain 1: Algebra',
    domainNumber: 1,
    lessonNumber: 8,
    totalLessonsInDomain: 8,
    lessonTitle: 'Graphs of Linear Systems and Inequalities',
    badge: 'Feasible Regions',
    subtitle: 'Dashed vs. solid boundary lines, half-plane shading, and polygonal feasible regions.',
    formulasAndRules: [
      {
        label: 'Boundary Line Rules',
        formula: '< or > ──► Dashed line  |  ≤ or ≥ ──► Solid line',
        explanation: 'Dashed line means points on line are NOT solutions; solid line means points on line ARE solutions.'
      },
      {
        label: 'Half-Plane Shading',
        formula: 'y ≥ mx + b ──► Shade ABOVE  |  y ≤ mx + b ──► Shade BELOW',
        explanation: 'Shade the half-plane that satisfies the inequality. Origin test (0, 0) verifies correct region.'
      }
    ],
    solvingMethod: 'Graph the boundary lines, determine shading for each inequality, and locate the overlapping intersection region (feasible set).',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 2: Foundations',
        description: 'Identify which quadrant or region represents a single inequality.',
        example: 'Identify region for y > 2x + 1 (dashed line, shaded above).'
      },
      medium: {
        unitLabel: 'Unit 6: Medium',
        description: 'Find the overlapping intersection region of two linear inequalities.',
        example: 'Find the region satisfying y ≥ -x + 3 and y < 2x - 1.'
      },
      hard: {
        unitLabel: 'Unit 10: Advanced (750+)',
        description: 'Given a system of 3 inequalities forming a shaded polygon, find coordinates of its vertices or test whether a specific point is inside the region.',
        example: 'A shaded triangular region defined by x ≥ 0, y ≥ 0, and 2x + 3y ≤ 12; find area or vertex coordinates.'
      }
    },
    conceptsForLogging: [
      'Dashed boundary (<, >) vs solid boundary (≤, ≥)',
      'Shading above (y ≥) vs shading below (y ≤)',
      'Testing test point (0, 0) in inequality systems',
      'Polygonal feasible regions and vertex coordinate identification'
    ]
  }
];

// ==============================================================================
// DOMAIN 2: PROBLEM SOLVING & DATA ANALYSIS (10 LESSONS)
// Units 3 (Foundations), 7 (Medium), 11 (Advanced)
// ==============================================================================
export const DOMAIN_2_DATA_ANALYSIS_LESSONS: OfficialMathLesson[] = [
  {
    id: 'psda-l1-ratios-rates-proportions',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 1,
    totalLessonsInDomain: 10,
    lessonTitle: 'Ratios, Rates, and Proportions',
    badge: 'Proportions',
    subtitle: 'Cross-multiplication, unit rate conversions, part-to-part vs. part-to-whole ratios, and chained ratios.',
    formulasAndRules: [
      {
        label: 'Proportion Cross-Multiplication',
        formula: 'a / b = c / d ──► a · d = b · c',
        explanation: 'Set cross-products equal to solve for the missing variable.'
      },
      {
        label: 'Part-to-Whole Ratio',
        formula: 'Part / (Part₁ + Part₂)',
        explanation: 'Divide individual part by the total sum of all parts.'
      }
    ],
    solvingMethod: 'Set up a clean proportion with matching units in the numerators and denominators, then cross-multiply to solve.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Simple cross-multiplication with whole numbers.',
        example: '3 / 4 = x / 20  ──►  4x = 60  ──►  x = 15'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Unit rate conversions (e.g., cost per pound or miles per gallon) across mixed quantities.',
        example: '$14.40 for 3.2 lbs  ──►  $4.50 per pound'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Multi-variable chained ratios with shared intermediary variables.',
        example: 'If a : b = 2 : 3 and b : c = 4 : 5, scale b to LCD 12 ──► a : b : c = 8 : 12 : 15 ──► a : c = 8 : 15'
      }
    },
    conceptsForLogging: [
      'Proportion cross-multiplication: a/b = c/d',
      'Part-to-whole ratio calculations',
      'Chained ratios: linking a:b and b:c via common LCD',
      'Unit rates: cost per unit, speed per hour'
    ]
  },
  {
    id: 'psda-l2-unit-conversion',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 2,
    totalLessonsInDomain: 10,
    lessonTitle: 'Unit Conversion & Dimensional Analysis',
    badge: 'Dimensional Flow',
    subtitle: 'Diagonal unit cancellation, compound speed rates, and squared/cubed area and volume conversions.',
    formulasAndRules: [
      {
        label: 'Diagonal Cancellation Law',
        formula: '(miles / hour) · (5280 ft / 1 mile) · (1 hour / 3600 sec)',
        explanation: 'Place target units on the opposite side (top vs bottom) so unwanted units cancel out cleanly.'
      },
      {
        label: 'Area & Volume Unit Multipliers',
        formula: '1 yd = 3 ft  ──►  1 yd² = 9 ft²  ──►  1 yd³ = 27 ft³',
        explanation: 'When converting square units, square the conversion ratio; for cubic units, cube the ratio!'
      }
    ],
    solvingMethod: 'Chain conversion factors as multiplying fractions so every unwanted unit appears in both numerator and denominator, leaving only target units.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Single-step conversions like minutes to hours or inches to feet.',
        example: '180 minutes · (1 hour / 60 min) = 3 hours'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Compound rate conversions changing both numerator and denominator simultaneously.',
        example: 'Convert 25 meters per second to miles per hour using (1 mile = 1609 m).'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Area and volume unit conversions requiring squaring or cubing the conversion ratio.',
        example: 'Convert 5 cubic yards to cubic feet: 5 · (3)³ = 5 · 27 = 135 ft³ (NOT 15 ft³!)'
      }
    },
    conceptsForLogging: [
      'Dimensional analysis: diagonal unit cancellation',
      'Compound rate conversions: m/s to mph',
      'Area unit squaring rule: 1 yd² = 9 ft²',
      'Volume unit cubing rule: 1 yd³ = 27 ft³'
    ]
  },
  {
    id: 'psda-l3-percentages',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 3,
    totalLessonsInDomain: 10,
    lessonTitle: 'Percentages, Percent Change & Multipliers',
    badge: 'High Frequency',
    subtitle: 'Direct percentage multipliers, percent change formulas, sequential shifts, and reverse solving.',
    formulasAndRules: [
      {
        label: 'Percent Formula',
        formula: 'Part = (Percent / 100) · Whole',
        explanation: 'Direct multiplication of decimal percent by whole base.'
      },
      {
        label: 'Percent Change Formula',
        formula: '% Change = ( |New - Old| / Old ) · 100%',
        explanation: 'Always divide the difference by the ORIGINAL (Old) baseline value.'
      },
      {
        label: 'Multipliers Shortcut',
        formula: 'Increase by x% ──► × (1 + x/100)  |  Decrease by x% ──► × (1 - x/100)',
        explanation: 'Increase by 15% ──► multiply by 1.15. Decrease by 20% ──► multiply by 0.80.'
      }
    ],
    solvingMethod: 'Use decimal multipliers directly rather than calculating the percent and adding/subtracting in two separate steps.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Calculate a direct single percentage of a number.',
        example: '15% of 80 = 0.15 · 80 = 12'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Consecutive sequential percent changes.',
        example: 'Increase by 20%, then decrease by 10% ──► (1.20)(0.90) = 1.08 (an 8% net increase, NOT 10%!)'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Reverse percentage solving where final discounted price is given and original price is requested.',
        example: 'An item costs $72 after a 20% discount; find original price: 0.80x = 72  ──►  x = $90 (NOT 72 · 1.20!)'
      }
    },
    conceptsForLogging: [
      'Percent change formula: (|New - Old| / Old) × 100%',
      'Percentage multiplier: (1 + r) and (1 - r)',
      'Consecutive sequential percentage shifts',
      'Reverse percentage solving: Final / (1 ± r) = Original'
    ]
  },
  {
    id: 'psda-l4-center-spread-shape-distributions',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 4,
    totalLessonsInDomain: 10,
    lessonTitle: 'Center, Spread, and Shape of Distributions',
    badge: 'Statistics',
    subtitle: 'Mean vs. median, outlier pull, range, and standard deviation spread comparisons.',
    formulasAndRules: [
      {
        label: 'Mean (x̄)',
        formula: 'x̄ = (Sum of all values) / (Total count n)',
        explanation: 'Arithmetic average of all data points.'
      },
      {
        label: 'Median',
        formula: 'Middle number when ordered from least to greatest',
        explanation: 'If n is even, average the two middle numbers.'
      },
      {
        label: 'Outlier Effect',
        formula: 'Mean is heavily pulled by outliers; Median is resistant',
        explanation: 'An extreme high value drags the mean up, while the median barely changes.'
      },
      {
        label: 'Standard Deviation (σ)',
        formula: 'Measures spread/dispersion of data around the mean',
        explanation: 'Higher dispersion/spread ──► Larger σ. Tightly clustered data ──► Smaller σ.'
      }
    ],
    solvingMethod: 'Order values from smallest to largest to find the median. For spread questions, inspect how far data values are clustered away from the center.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Calculate mean, median, and range of 5 given numbers.',
        example: 'Given [2, 5, 8, 11, 14]: Mean = 8, Median = 8, Range = 12'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Identify which of two visual bar graphs or dot plots has a larger standard deviation based on visual spread.',
        example: 'A graph with data pushed to the extremes has a larger σ than a graph centered around the middle.'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Explain how adding an extreme outlier changes the mean versus the median, or analyzing linear transformations on σ.',
        example: 'Adding 500 to a list of numbers between 10 and 20 dramatically increases mean but leaves median unchanged.'
      }
    },
    conceptsForLogging: [
      'Mean: x̄ = Σx / n',
      'Median: middle value in ordered sequence',
      'Outlier impact: mean is pulled, median is resistant',
      'Standard deviation: measure of clustering vs spread',
      'Data transformations: adding constant preserves σ'
    ]
  },
  {
    id: 'psda-l5-data-representations',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 5,
    totalLessonsInDomain: 10,
    lessonTitle: 'Data Representations (Tables & Plots)',
    badge: 'Data Literacy',
    subtitle: 'Reading and analyzing bar charts, histograms, frequency tables, and dot plots.',
    formulasAndRules: [
      {
        label: 'Frequency Table Weighted Mean',
        formula: 'Mean = Σ(Value · Frequency) / Σ(Frequency)',
        explanation: 'Multiply each value by its count, sum them up, and divide by total counts.'
      }
    ],
    solvingMethod: 'Check axis labels, bin widths on histograms, and scale increments before performing calculations.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Read values directly from bar chart or histogram axes.',
        example: 'Read frequency of students scoring between 80 and 90.'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Calculate the median or range from a dot plot or frequency table.',
        example: 'Find the middle data point in a dot plot of 25 values by counting to the 13th dot.'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Combine two frequency tables or determine missing frequencies given a combined weighted average.',
        example: 'Given two classes of 20 and 30 students with averages 80 and 90, find combined average: (20·80 + 30·90) / 50 = 86.'
      }
    },
    conceptsForLogging: [
      'Reading histograms and bin intervals',
      'Dot plot median counting technique',
      'Weighted mean from frequency tables: Σ(v·f)/Σf',
      'Combining datasets with different sample sizes'
    ]
  },
  {
    id: 'psda-l6-scatterplots',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 6,
    totalLessonsInDomain: 10,
    lessonTitle: 'Scatterplots, Trend Lines & Residuals',
    badge: 'Regression Analysis',
    subtitle: 'Lines of best fit, positive/negative correlation, and calculating residuals.',
    formulasAndRules: [
      {
        label: 'Line of Best Fit',
        formula: 'y = m x + b',
        explanation: 'm = predicted rate of change, b = predicted initial value at x = 0.'
      },
      {
        label: 'Residual Formula',
        formula: 'Residual = Actual y - Predicted y',
        explanation: 'Vertical distance from the data point to the trend line (positive if point is above line, negative if below).'
      }
    ],
    solvingMethod: 'Substitute the given x-value into the trend line equation to find the predicted y. Compare with the actual point coordinate.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Identify whether correlation is positive, negative, or zero.',
        example: 'Points rising from left to right indicate positive correlation.'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Use the line of best fit equation to predict y for a given x-value.',
        example: 'Given y = 1.8x + 12, predict y when x = 10 ──► y = 30.'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Find the data point with the greatest absolute residual (furthest vertical distance from the trend line).',
        example: 'Compare vertical gaps |y_actual - y_predicted| for four specific points on the scatterplot.'
      }
    },
    conceptsForLogging: [
      'Scatterplot correlation: positive, negative, non-linear',
      'Line of best fit predictions: y = mx + b',
      'Residual calculation: Actual y - Predicted y',
      'Greatest absolute residual identification'
    ]
  },
  {
    id: 'psda-l7-linear-exponential-growth',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 7,
    totalLessonsInDomain: 10,
    lessonTitle: 'Linear and Exponential Growth',
    badge: 'Growth Models',
    subtitle: 'Constant addition vs. constant percentage multiplication, and hybrid rate scenarios.',
    formulasAndRules: [
      {
        label: 'Linear Growth Rule',
        formula: 'y = mx + b (Adds/Subtracts Constant)',
        explanation: 'Changes by a constant fixed amount per unit of time (e.g., adds 5 items each year).'
      },
      {
        label: 'Exponential Growth Rule',
        formula: 'y = a · (b)ᵗ (Multiplies by Constant Factor)',
        explanation: 'Multiplies by a constant ratio or percentage per unit of time (e.g., grows by 5% each year).'
      }
    ],
    solvingMethod: 'Inspect whether differences (y₂ - y₁) are constant (Linear) or ratios (y₂ / y₁) are constant (Exponential).',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Classify a verbal description as linear or exponential.',
        example: 'A population increasing by 200 people/year is linear; increasing by 5%/year is exponential.'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Write the functional model from a table of values.',
        example: 'Table values doubling every step: y = 3 · 2^x.'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Word problems that switch between linear and exponential rates over different time intervals.',
        example: 'Grows exponentially for 3 years, then continues with a constant linear increase thereafter.'
      }
    },
    conceptsForLogging: [
      'Linear: constant difference Δy per unit time',
      'Exponential: constant ratio multiplier b per unit time',
      'Table recognition: linear vs exponential',
      'Hybrid piecewise growth models'
    ]
  },
  {
    id: 'psda-l8-probability-relative-frequency',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 8,
    totalLessonsInDomain: 10,
    lessonTitle: 'Probability and Relative Frequency',
    badge: 'Probability',
    subtitle: 'Two-way contingency tables, conditional probability restrictions, and algebraic cell solving.',
    formulasAndRules: [
      {
        label: 'Basic Probability',
        formula: 'P = Favorable Outcomes / Total Outcomes',
        explanation: 'Ratio of target outcomes to total possible outcomes in sample space.'
      },
      {
        label: 'Conditional Probability',
        formula: 'P(A given B) = Count of (A and B) / Total Count of B',
        explanation: 'Crucial: Restrict the denominator ONLY to the group specified after "given that" or "of the".'
      }
    ],
    solvingMethod: 'Highlight the group specified in the prompt. That group count is your denominator. The overlap is your numerator.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Simple single-variable probability from a two-way table.',
        example: 'Probability of selecting a junior from a school of 400 students: 120 / 400 = 0.30'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Conditional probability restricting the denominator to a specific row or column.',
        example: '"Given that the person tested positive, what is the probability they are healthy?" (Denominator = total positive tests only).'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Fill in missing table cells algebraically using marginal totals before calculating the probability.',
        example: 'Use row and column sum equations to solve for x and y in an incomplete 2x2 table, then find P(A|B).'
      }
    },
    conceptsForLogging: [
      'Basic probability: favorable / total',
      'Conditional probability denominator restriction: P(A|B)',
      'Two-way contingency table navigation',
      'Algebraic completion of missing table cells'
    ]
  },
  {
    id: 'psda-l9-data-inferences',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 9,
    totalLessonsInDomain: 10,
    lessonTitle: 'Data Inferences & Margin of Error',
    badge: 'Inference',
    subtitle: 'Population proportion estimation, sample size relationships, and margin of error confidence intervals.',
    formulasAndRules: [
      {
        label: 'Population Estimate',
        formula: 'Estimated Total = Sample Proportion · Total Population',
        explanation: 'Multiply sample rate by the entire population size.'
      },
      {
        label: 'Margin of Error Interval',
        formula: 'Confidence Interval = Estimate ± Margin of Error',
        explanation: 'The true population parameter is expected to fall between (Estimate - MOE) and (Estimate + MOE).'
      },
      {
        label: 'Sample Size vs. Margin of Error Law',
        formula: 'Larger Sample Size (n) ──► Smaller Margin of Error',
        explanation: 'Increasing sample size reduces uncertainty and narrows the margin of error.'
      }
    ],
    solvingMethod: 'Results from a sample can only be generalized to the population if the sample was chosen randomly. Check sample size effects on confidence precision.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Estimate a population total from a sample proportion.',
        example: 'In a random sample of 200 voters, 60% support a bill. In a city of 10,000, estimate = 0.60 · 10,000 = 6,000.'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Interpret margin of error intervals to determine plausible population values.',
        example: 'Estimate is 52% with margin of error ±3%  ──►  Plausible interval is 49% to 55%.'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Determine whether increasing sample size reduces the margin of error or evaluating whether two confidence intervals overlap significantly.',
        example: 'Doubling sample size from 500 to 1,000 decreases the margin of error, making the estimate more precise.'
      }
    },
    conceptsForLogging: [
      'Population estimation from sample proportion',
      'Margin of error confidence intervals: Estimate ± MOE',
      'Sample size law: larger n → smaller margin of error',
      'Generalizability requirements (random sampling)'
    ]
  },
  {
    id: 'psda-l10-evaluating-statistical-claims',
    domainId: 'problem-solving',
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    domainNumber: 2,
    lessonNumber: 10,
    totalLessonsInDomain: 10,
    lessonTitle: 'Evaluating Statistical Claims & Study Design',
    badge: 'Study Design',
    subtitle: 'Random selection vs. random assignment, correlation vs. causation, and confounding bias.',
    formulasAndRules: [
      {
        label: 'Random Selection Rule',
        formula: 'Random Selection ──► Generalize to Entire Population',
        explanation: 'Allows generalizing findings to the broader population from which subjects were sampled.'
      },
      {
        label: 'Random Assignment Rule',
        formula: 'Random Assignment (Treatment vs Control) ──► Proves Causation',
        explanation: 'Proves a cause-and-effect relationship. Observational studies prove correlation only!'
      }
    ],
    solvingMethod: 'Look for two keywords: "Random Selection" (generalize to population) and "Random Assignment" (cause and effect). If no random assignment, eliminate choices claiming causation.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 3: Foundations',
        description: 'Identify obvious sample bias in survey setups.',
        example: 'Surveying only gym members about the town’s average fitness creates selection bias.'
      },
      medium: {
        unitLabel: 'Unit 7: Medium',
        description: 'Distinguish between correlation and causation in survey claims.',
        example: 'People who drink tea sleep better (observational study): tea correlates with better sleep, but does not necessarily cause it.'
      },
      hard: {
        unitLabel: 'Unit 11: Advanced (750+)',
        description: 'Identify confounding variables or undercoverage bias in experimental study setups.',
        example: 'Evaluate an experiment where voluntary self-selection creates confounding lurking variables.'
      }
    },
    conceptsForLogging: [
      'Random selection: generalizability to population',
      'Random assignment: establishes cause-and-effect',
      'Correlation vs causation distinction',
      'Selection bias and confounding variables'
    ]
  }
];

// ==============================================================================
// DOMAIN 3: ADVANCED MATH (13 LESSONS)
// Units 4 (Foundations), 8 (Medium), 12 (Advanced)
// ==============================================================================
export const DOMAIN_3_ADVANCED_MATH_LESSONS: OfficialMathLesson[] = [
  {
    id: 'adv-l1-factoring-quadratics-polynomials',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 1,
    totalLessonsInDomain: 13,
    lessonTitle: 'Factoring Quadratic and Polynomial Expressions',
    badge: 'Core Factoring',
    subtitle: 'Difference of squares, perfect square trinomials, grouping, and higher-degree factoring.',
    formulasAndRules: [
      {
        label: 'Difference of Squares',
        formula: 'a² - b² = (a - b)(a + b)',
        explanation: 'Two perfect squares subtracted factor into conjugate binomials.'
      },
      {
        label: 'Perfect Square Trinomials',
        formula: 'a² ± 2ab + b² = (a ± b)²',
        explanation: 'Square of first, twice the product of both, square of last.'
      },
      {
        label: 'Factoring by Grouping',
        formula: 'ax² + bx + c ──► Split middle term into two factors',
        explanation: 'Find two numbers that multiply to a·c and add to b.'
      }
    ],
    solvingMethod: 'Look for a common factor (GCF) first. Then inspect for difference of squares or split the middle term for quadratics.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Simple factoring where leading coefficient a = 1.',
        example: 'x² - 9 = (x - 3)(x + 3)  or  x² + 5x + 6 = (x + 2)(x + 3)'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Factoring quadratics where leading coefficient a > 1.',
        example: '2x² + 7x + 3  ──►  (2x + 1)(x + 3)'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Higher-degree difference of squares and nested polynomial factors.',
        example: 'x⁴ - 81 = (x² - 9)(x² + 9) = (x - 3)(x + 3)(x² + 9)'
      }
    },
    conceptsForLogging: [
      'Difference of squares: a² - b² = (a - b)(a + b)',
      'Perfect square trinomials: (a ± b)²',
      'Factoring trinomials with a > 1',
      'Higher-degree polynomial factoring: x⁴ - c'
    ]
  },
  {
    id: 'adv-l2-radicals-rational-exponents',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 2,
    totalLessonsInDomain: 13,
    lessonTitle: 'Radicals and Rational Exponents',
    badge: 'Exponent Laws',
    subtitle: 'The 6 core laws of exponents, rational powers, and common base rewriting.',
    formulasAndRules: [
      {
        label: 'Product & Quotient Rules',
        formula: 'xᵃ · xᵇ = xᵃ⁺ᵇ  |  xᵃ / xᵇ = xᵃ⁻ᵇ',
        explanation: 'Add exponents when multiplying; subtract when dividing.'
      },
      {
        label: 'Power to a Power',
        formula: '(xᵃ)ᵇ = xᵃᵇ',
        explanation: 'Multiply exponents when raising a power to another power.'
      },
      {
        label: 'Negative Exponent Rule',
        formula: 'x⁻ᵃ = 1 / xᵃ',
        explanation: 'Invert the base into the denominator.'
      },
      {
        label: 'Rational Exponent (Fractional Power)',
        formula: 'xᵃᐟᵇ = ᵇ√(xᵃ) = (ᵇ√x)ᵃ',
        explanation: 'Numerator = power, Denominator = root index.'
      },
      {
        label: 'Zero Power Rule',
        formula: 'x⁰ = 1  (for x ≠ 0)',
        explanation: 'Any non-zero base to the 0 power equals 1.'
      }
    ],
    solvingMethod: 'Convert all radicals to fractional exponents to combine using exponent laws. Rewrite different bases into common prime bases (e.g. 4 and 8 into base 2).',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Rewrite rational exponents as radicals or vice versa.',
        example: 'Rewrite x^(2/3) as ³√(x²)'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Simplify expressions combining negative and fractional powers.',
        example: 'Simplify (16x⁴)^(-1/2) = 1 / √(16x⁴) = 1 / (4x²)'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Solve exponent equations with different bases by converting to a common prime base.',
        example: '2^(3x) = 8^(x - 1)  ──►  2^(3x) = (2³)^(x - 1) = 2^(3x - 3)  ──►  3x = 3x - 3 (no solution)'
      }
    },
    conceptsForLogging: [
      'Exponent laws: product, quotient, power rules',
      'Negative exponent inversion: x⁻ᵃ = 1/xᵃ',
      'Rational exponent conversion: xᵃᐟᵇ = ᵇ√(xᵃ)',
      'Common prime base conversion technique (4, 8, 16 → base 2)'
    ]
  },
  {
    id: 'adv-l3-operations-with-polynomials',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 3,
    totalLessonsInDomain: 13,
    lessonTitle: 'Operations with Polynomials',
    badge: 'Algebraic Operations',
    subtitle: 'Polynomial addition, subtraction, FOIL expansion, and coefficient matching.',
    formulasAndRules: [
      {
        label: 'Combine Like Terms',
        formula: 'axⁿ + bxⁿ = (a + b)xⁿ',
        explanation: 'Only terms with the exact same variable and exponent can be combined.'
      },
      {
        label: 'Polynomial Expansion (FOIL)',
        formula: '(a + b)(c + d) = ac + ad + bc + bd',
        explanation: 'Distribute every term in the first polynomial across every term in the second.'
      }
    ],
    solvingMethod: 'Distribute negative signs across parentheses carefully. For coefficient matching, equate corresponding degree terms on both sides.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Add or subtract simple polynomials.',
        example: '(2x² + 3x) + (x² - 5x) = 3x² - 2x'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Multiply a binomial by a trinomial.',
        example: '(x - 2)(x² + 3x - 4) = x³ + 3x² - 4x - 2x² - 6x + 8 = x³ + x² - 10x + 8'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Match polynomial coefficients on both sides of an identity equation to solve for constants.',
        example: 'If (2x + a)(3x + b) = 6x² + cx + 12 and a + b = 7, find possible values of c.'
      }
    },
    conceptsForLogging: [
      'Polynomial addition and subtraction with sign distribution',
      'Binomial times trinomial expansion',
      'Polynomial coefficient matching identity technique'
    ]
  },
  {
    id: 'adv-l4-operations-with-rational-expressions',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 4,
    totalLessonsInDomain: 13,
    lessonTitle: 'Operations with Rational Expressions',
    badge: 'Rational Functions',
    subtitle: 'Factoring rational fractions, polynomial long division, and the Remainder Theorem.',
    formulasAndRules: [
      {
        label: 'Rational Fraction Simplification',
        formula: 'P(x) / Q(x) ──► Factor both, cancel common factors',
        explanation: 'Only common FACTORS can be cancelled, never individual terms!'
      },
      {
        label: 'Polynomial Division Identity',
        formula: 'P(x) / D(x) = Q(x) + R(x) / D(x)',
        explanation: 'Quotient plus Remainder over Divisor.'
      },
      {
        label: 'Polynomial Remainder Theorem',
        formula: 'Remainder of P(x) ÷ (x - a) equals P(a)',
        explanation: 'Plug in x = a directly to find the remainder without performing long division.'
      }
    ],
    solvingMethod: 'Factor numerator and denominator completely before simplifying. For improper rational fractions, use polynomial long division or synthetic division.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Simplify a basic rational fraction by factoring.',
        example: '(x² - 4) / (x - 2) = (x - 2)(x + 2) / (x - 2) = x + 2'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Add or subtract rational expressions with different denominators.',
        example: '2 / (x + 1) + 3 / (x - 2)  ──►  Find common denominator (x + 1)(x - 2)'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Use polynomial long division to rewrite rational expressions into quotient and remainder form, or apply Remainder Theorem.',
        example: '(2x² + 7x + 5) / (x + 2) = 2x + 3 - 1 / (x + 2)'
      }
    },
    conceptsForLogging: [
      'Rational expression factoring and cancellation',
      'Common denominators for rational fractions',
      'Polynomial long division: Q(x) + R(x)/D(x)',
      'Remainder Theorem: P(a) equals remainder when divided by (x - a)'
    ]
  },
  {
    id: 'adv-l5-nonlinear-functions',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 5,
    totalLessonsInDomain: 13,
    lessonTitle: 'Nonlinear Functions & Composition',
    badge: 'Function Mechanics',
    subtitle: 'Function notation, composite functions (f ∘ g)(x), and solving for unknown inputs.',
    formulasAndRules: [
      {
        label: 'Function Evaluation',
        formula: 'f(a) ──► Replace every x with a',
        explanation: 'Substitute the input value into every occurrence of the variable.'
      },
      {
        label: 'Composite Functions',
        formula: '(f ∘ g)(x) = f(g(x))',
        explanation: 'Evaluate inside function g(x) first, then plug that output into outside function f.'
      }
    ],
    solvingMethod: 'Work from the inside out for composite functions: calculate g(x) first, then apply f to that result.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Evaluate f(a) for a given numerical input.',
        example: 'Given f(x) = 2x² - 5, find f(3) = 2(9) - 5 = 13'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Evaluate composite functions f(g(x)) using given formulas, tables, or graphs.',
        example: 'Given f(x) = x + 4 and g(x) = x², find f(g(2)) = f(4) = 8'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Solve for an unknown input x such that a composite function equals a target value.',
        example: 'Find all values of x such that f(g(x)) = 10 when f(u) = 2u - 4 and g(x) = x² - 1'
      }
    },
    conceptsForLogging: [
      'Function evaluation notation: f(a)',
      'Composite functions: f(g(x)) inside-out evaluation',
      'Solving for unknown input x in f(g(x)) = k',
      'Table-based function composition'
    ]
  },
  {
    id: 'adv-l6-isolating-quantities',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 6,
    totalLessonsInDomain: 13,
    lessonTitle: 'Isolating Quantities (Literal Equations)',
    badge: 'Formula Rearrangement',
    subtitle: 'Rearranging multi-variable formulas, clearing denominators, and factoring out target variables.',
    formulasAndRules: [
      {
        label: 'Literal Equation Strategy',
        formula: 'Isolate target variable by reversing operations in PEMDAS order',
        explanation: 'Clear denominators first, group all terms containing the target variable on one side, factor it out, and divide.'
      }
    ],
    solvingMethod: 'Multiply through by common denominators. Collect all terms containing the target variable on one side, factor out the variable, then divide by the remaining expression.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Rearrange a simple formula for one variable.',
        example: 'Solve for w in P = 2l + 2w  ──►  2w = P - 2l  ──►  w = (P - 2l) / 2'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Solve for a variable inside a radical or squared term.',
        example: 'Solve for r in V = (1/3)πr²h  ──►  3V = πr²h  ──►  r = √(3V / πh)'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Solve for target variable when it appears in both numerator and denominator.',
        example: 'Solve for x in y = (2x + 1) / (x - 3)  ──►  y(x - 3) = 2x + 1  ──►  yx - 2x = 3y + 1  ──►  x = (3y + 1) / (y - 2)'
      }
    },
    conceptsForLogging: [
      'Literal equation rearrangement',
      'Solving for variable in numerator and denominator',
      'Factoring out common variable: x(y - 2) = c',
      'Radical formula rearrangement: r = √(V / πh)'
    ]
  },
  {
    id: 'adv-l7-solving-quadratic-equations',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 7,
    totalLessonsInDomain: 13,
    lessonTitle: 'Solving Quadratic Equations & The Discriminant',
    badge: 'High Frequency',
    subtitle: 'The quadratic formula, square root method, and discriminant (b² - 4ac) root analysis.',
    formulasAndRules: [
      {
        label: 'Quadratic Formula',
        formula: 'x = [ -b ± √(b² - 4ac) ] / (2a)',
        explanation: 'Solves any quadratic equation in standard form ax² + bx + c = 0.'
      },
      {
        label: 'The Discriminant (D)',
        formula: 'D = b² - 4ac',
        explanation: 'D > 0 ──► 2 Distinct Real Solutions | D = 0 ──► 1 Real Solution | D < 0 ──► 0 Real Solutions (2 Complex)'
      }
    ],
    solvingMethod: 'Set the equation equal to 0. Identify a, b, and c. Compute D = b² - 4ac to check the nature of roots before applying the quadratic formula.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Solve by taking the square root directly.',
        example: 'x² = 49  ──►  x = ±7'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Solve equations requiring the quadratic formula with radical solutions.',
        example: 'x² - 4x - 7 = 0  ──►  x = [4 ± √(16 - 4(1)(-7))] / 2 = [4 ± √44] / 2 = 2 ± √11'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Find the unknown constant k such that the quadratic has exactly one real solution.',
        example: 'x² + kx + 9 = 0 has 1 real solution when D = 0  ──►  k² - 4(1)(9) = 0  ──►  k² = 36  ──►  k = ±6'
      }
    },
    conceptsForLogging: [
      'Quadratic formula x = (-b ± √(b² - 4ac)) / 2a',
      'Discriminant D = b² - 4ac diagnostics',
      'D = 0: exactly 1 real solution (tangency)',
      'D > 0: 2 real solutions, D < 0: 0 real solutions'
    ]
  },
  {
    id: 'adv-l8-linear-quadratic-systems',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 8,
    totalLessonsInDomain: 13,
    lessonTitle: 'Linear and Quadratic Systems',
    badge: 'System Synthesis',
    subtitle: 'Substitution between lines and parabolas, intersection points, and tangency constraints.',
    formulasAndRules: [
      {
        label: 'System Substitution Setup',
        formula: 'Set mx + b = ax² + bx + c ──► ax² + (b - m)x + (c - b) = 0',
        explanation: 'Substitute line equation for y in the parabola equation to create a single quadratic.'
      },
      {
        label: 'Tangency Discriminant Condition',
        formula: 'Line tangent to parabola ──► Discriminant D = 0',
        explanation: 'A tangent line touches the parabola at exactly ONE point.'
      }
    ],
    solvingMethod: 'Substitute the linear expression for y into the quadratic equation. Set equal to 0 and solve for x using factoring or quadratic formula.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Find intersection points graphically by inspecting a diagram.',
        example: 'Read (x, y) coordinates where a line crosses a parabola on a graph.'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Solve algebraically using substitution to find two intersection coordinates.',
        example: 'y = 2x + 1 and y = x² - 2  ──►  x² - 2x - 3 = 0  ──►  x = 3, -1'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Find constant c such that a line is tangent to a parabola.',
        example: 'Line y = 2x + c is tangent to y = x²  ──►  x² - 2x - c = 0  ──►  D = (-2)² - 4(1)(-c) = 0  ──►  4 + 4c = 0  ──►  c = -1'
      }
    },
    conceptsForLogging: [
      'Linear-quadratic substitution: mx + b = ax² + bx + c',
      'Tangency between line and parabola: D = 0',
      'Intersection count: 0, 1, or 2 points',
      'Desmos intersection reading for quadratic systems'
    ]
  },
  {
    id: 'adv-l9-radical-rational-absolute-value-equations',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 9,
    totalLessonsInDomain: 13,
    lessonTitle: 'Radical, Rational, and Absolute Value Equations',
    badge: 'Trap Warning',
    subtitle: 'Extraneous roots, two-case absolute values, and zero-denominator domain restrictions.',
    formulasAndRules: [
      {
        label: 'Absolute Value Definition',
        formula: '|ax + b| = c ──► ax + b = c  OR  ax + b = -c  (for c ≥ 0)',
        explanation: 'Must split into two separate linear equations.'
      },
      {
        label: 'Extraneous Solution Warning',
        formula: 'Squaring both sides can introduce false solutions: Check in original equation!',
        explanation: 'When solving √(f(x)) = g(x), any solution making g(x) negative is extraneous.'
      }
    ],
    solvingMethod: 'Isolate the radical or absolute value first. Square both sides (for radicals) or branch into two cases (for absolute values). ALWAYS plug answers back into the original equation.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Solve simple absolute value equations directly.',
        example: '|x - 3| = 7  ──►  x - 3 = 7 or x - 3 = -7  ──►  x = 10, -4'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Solve radical equations and eliminate the extraneous root.',
        example: '√(2x + 6) = x - 1  ──►  2x + 6 = x² - 2x + 1  ──►  x² - 4x - 5 = 0  ──►  x = 5, -1 (x = -1 is extraneous because √4 ≠ -2!)'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Rational equations where an apparent algebraic solution creates a zero denominator.',
        example: 'Solving (x² - 4)/(x - 2) = 4 yields apparent root x = 2, which is undefined (zero denominator).'
      }
    },
    conceptsForLogging: [
      'Absolute value branching: |u| = c → u = c or u = -c',
      'Extraneous solutions from squaring radical equations',
      'Zero denominator domain restrictions in rational equations',
      'Verifying roots in original unmodified equation'
    ]
  },
  {
    id: 'adv-l10-quadratic-exponential-word-problems',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 10,
    totalLessonsInDomain: 13,
    lessonTitle: 'Quadratic and Exponential Word Problems',
    badge: 'Word Problems',
    subtitle: 'Projectile trajectories, maximum vertex heights, and exponential time unit conversions.',
    formulasAndRules: [
      {
        label: 'Projectile Trajectory Model',
        formula: 'h(t) = -16t² + v₀t + h₀',
        explanation: 'h₀ = initial launch height, v₀ = initial vertical velocity. Time to max height = -v₀ / (2 · (-16)).'
      },
      {
        label: 'Exponential Population / Interest',
        formula: 'P(t) = P₀ · (b)ᵗ',
        explanation: 'P₀ = initial value at t = 0, b = growth factor (1 + r) or decay factor (1 - r).'
      }
    ],
    solvingMethod: 'For quadratic maximums, calculate the vertex x-coordinate x = -b/(2a). For exponentials, rewrite the exponent to match the desired time units.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Identify the initial launch height or starting population from the formula.',
        example: 'In h(t) = -16t² + 64t + 80, the initial height is 80 feet.'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Find maximum height by calculating the vertex coordinates.',
        example: 'Time to max height = -64 / (2 · (-16)) = 2 seconds. Max height = h(2) = 144 feet.'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Convert annual growth models to monthly or daily models in the exponent.',
        example: 'Convert annual growth (1.05)^t to monthly model: (1.05^(1/12))^(12t) ≈ (1.004)^12t'
      }
    },
    conceptsForLogging: [
      'Projectile model h(t) = -16t² + v₀t + h₀',
      'Time to maximum height t = -b / (2a)',
      'Maximum vertex height h(t_max)',
      'Exponential time-base conversions: (1 + r)^(t/k)'
    ]
  },
  {
    id: 'adv-l11-quadratic-graphs',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 11,
    totalLessonsInDomain: 13,
    lessonTitle: 'Quadratic Graphs & The Three Forms',
    badge: 'Parabola Anatomy',
    subtitle: 'Standard, vertex, and factored forms, and which form reveals features as explicit constants.',
    formulasAndRules: [
      {
        label: 'Standard Form',
        formula: 'y = ax² + bx + c ──► y-intercept is (0, c)',
        explanation: 'Displays the y-intercept as an explicit constant.'
      },
      {
        label: 'Vertex Form',
        formula: 'y = a(x - h)² + k ──► Vertex is (h, k)',
        explanation: 'Displays the maximum or minimum value (k) as an explicit constant.'
      },
      {
        label: 'Factored Form',
        formula: 'y = a(x - r₁)(x - r₂) ──► x-intercepts are (r₁, 0) and (r₂, 0)',
        explanation: 'Displays the roots / zeros as explicit constants.'
      }
    ],
    solvingMethod: 'Match the question request to the form: "reveals minimum/maximum" ──► Vertex form. "reveals x-intercepts" ──► Factored form. "reveals y-intercept" ──► Standard form.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Read the vertex directly from vertex form.',
        example: 'In y = (x - 3)² + 4, vertex is (3, 4).'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Match parabola graphs to their factored or vertex equations.',
        example: 'Parabola with roots at 2 and -5 matches y = a(x - 2)(x + 5).'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Questions asking which equivalent algebraic form reveals the vertex or intercepts as explicit constants without calculating.',
        example: '"Which equivalent form displays the minimum value of f(x) as a constant?" ──► Choose Vertex Form!'
      }
    },
    conceptsForLogging: [
      'Standard form reveals y-intercept (0, c)',
      'Vertex form reveals min/max (h, k)',
      'Factored form reveals x-intercepts (r₁, 0), (r₂, 0)',
      'Equivalent forms: identifying constants and coefficients'
    ]
  },
  {
    id: 'adv-l12-exponential-graphs',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 12,
    totalLessonsInDomain: 13,
    lessonTitle: 'Exponential Graphs & Asymptotes',
    badge: 'Asymptote Analysis',
    subtitle: 'Horizontal asymptotes, y-intercepts, and horizontal/vertical curve transformations.',
    formulasAndRules: [
      {
        label: 'General Exponential Equation',
        formula: 'y = a · bˣ + c',
        explanation: 'a = vertical stretch, b = growth/decay base, c = vertical shift.'
      },
      {
        label: 'Horizontal Asymptote',
        formula: 'y = c',
        explanation: 'The line the curve approaches as x approaches negative infinity (growth) or positive infinity (decay).'
      },
      {
        label: 'y-Intercept',
        formula: '(0, a + c)',
        explanation: 'Plug in x = 0: y = a · b⁰ + c = a(1) + c = a + c.'
      }
    ],
    solvingMethod: 'Look at the horizontal line the curve levels off toward; that horizontal line is y = c. Look at the y-intercept at x = 0.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Identify whether an exponential graph represents growth (b > 1) or decay (0 < b < 1).',
        example: 'A curve flattening out toward the left and exploding upward to the right is growth.'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Identify the horizontal asymptote from the equation.',
        example: 'In y = 3 · 2^x - 5, the horizontal asymptote is y = -5.'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Determine graph transformations under both horizontal and vertical shifts.',
        example: 'Graph y = 2^(x - 3) + 4: shifted right by 3 units, up by 4 units, asymptote y = 4.'
      }
    },
    conceptsForLogging: [
      'Exponential form y = a·bˣ + c',
      'Horizontal asymptote y = c',
      'Exponential y-intercept (0, a + c)',
      'Transformations: horizontal shift (x - h) and vertical shift c'
    ]
  },
  {
    id: 'adv-l13-polynomial-nonlinear-graphs',
    domainId: 'advanced-math',
    domainTitle: 'Domain 3: Advanced Math',
    domainNumber: 3,
    lessonNumber: 13,
    totalLessonsInDomain: 13,
    lessonTitle: 'Polynomial and Other Nonlinear Graphs',
    badge: 'Multiplicity & Behavior',
    subtitle: 'Root multiplicity (cross vs. tangent turn), end behavior, and degree-4 polynomials.',
    formulasAndRules: [
      {
        label: 'Odd Multiplicity (Linear Root)',
        formula: '(x - r)¹ ──► Graph CROSSES the x-axis',
        explanation: 'Changes sign across the x-axis.'
      },
      {
        label: 'Even Multiplicity (Repeated Root)',
        formula: '(x - r)² ──► Graph TOUCHES and TURNS AROUND (Tangent)',
        explanation: 'Does not change sign; vertex is tangent to the x-axis.'
      },
      {
        label: 'Vertical Asymptotes',
        formula: 'Occur where denominator equals 0',
        explanation: 'Values of x for which the rational function is undefined.'
      }
    ],
    solvingMethod: 'Identify where the graph crosses the x-axis (odd power root) versus where it touches and turns around (even power root). Write the factored equation and solve for stretch factor a using a given point.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 4: Foundations',
        description: 'Count real roots (x-intercepts) on a polynomial graph.',
        example: 'A cubic curve crossing the x-axis at 3 distinct points has 3 real roots.'
      },
      medium: {
        unitLabel: 'Unit 8: Medium',
        description: 'Match a cubic polynomial equation to its graph.',
        example: 'Graph crossing at -2 and tangent at 3 corresponds to y = a(x + 2)(x - 3)².'
      },
      hard: {
        unitLabel: 'Unit 12: Advanced (750+)',
        description: 'Determine the complete equation of a degree-4 polynomial from intercept tangencies and a given coordinate point.',
        example: 'Tangent at x = -1 and x = 2 with y-intercept (0, 8): y = a(x + 1)²(x - 2)² ──► 8 = a(1)(4) ──► a = 2'
      }
    },
    conceptsForLogging: [
      'Root multiplicity: odd (cross) vs even (tangent turn)',
      'Polynomial end behavior based on degree and sign of a',
      'Degree-4 polynomial equation modeling from graph',
      'Rational function vertical asymptotes'
    ]
  }
];

// ==============================================================================
// DOMAIN 4: GEOMETRY & TRIGONOMETRY (6 LESSONS)
// Units 5 (Foundations), 9 (Medium), 13 (Advanced)
// ==============================================================================
export const DOMAIN_4_GEOMETRY_TRIG_LESSONS: OfficialMathLesson[] = [
  {
    id: 'geom-l1-area-and-volume',
    domainId: 'geometry-trig',
    domainTitle: 'Domain 4: Geometry & Trigonometry',
    domainNumber: 4,
    lessonNumber: 1,
    totalLessonsInDomain: 6,
    lessonTitle: 'Area, Volume & Dimensional Scaling',
    badge: '3D Solid Mechanics',
    subtitle: 'Cylinders, cones, spheres, pyramids, and the cubic dimensional scaling law.',
    formulasAndRules: [
      {
        label: 'Right Cylinder Volume',
        formula: 'V = π r² h',
        explanation: 'Circular base area (πr²) multiplied by height h.'
      },
      {
        label: 'Right Circular Cone Volume',
        formula: 'V = (1/3) π r² h',
        explanation: 'Exactly one-third the volume of a cylinder with identical dimensions.'
      },
      {
        label: 'Sphere Volume',
        formula: 'V = (4/3) π r³',
        explanation: 'Four-thirds times pi times radius cubed.'
      },
      {
        label: 'Pyramid Volume',
        formula: 'V = (1/3) B h',
        explanation: 'B represents the area of the base polygon.'
      },
      {
        label: 'The Dimensional Scaling Law',
        formula: 'Lengths scale by k ──► Area scales by k² ──► Volume scales by k³',
        explanation: 'When every linear dimension is multiplied by k, surface area scales by k² and volume scales by k³.'
      }
    ],
    solvingMethod: 'Identify the solid type. Substitute known dimensions into the reference formula. For scaling problems, apply k³ for volume and k² for surface area.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 5: Foundations',
        description: 'Direct volume calculation given radius and height.',
        example: 'Find volume of cylinder with r = 3 and h = 10 ──► V = π(9)(10) = 90π'
      },
      medium: {
        unitLabel: 'Unit 9: Medium',
        description: 'Solve backwards for height or diameter given the volume.',
        example: 'Given V = 100π and h = 4 for a cylinder, solve for r: 100π = πr²(4) ──► r² = 25 ──► r = 5'
      },
      hard: {
        unitLabel: 'Unit 13: Advanced (750+)',
        description: 'Percent-based non-uniform dimensional changes across radius and height.',
        example: 'Radius increases by 10% and height decreases by 20%: V_new = π(1.1r)²(0.8h) = 1.21 · 0.8 · πr²h = 0.968 V (a 3.2% net decrease!)'
      }
    },
    conceptsForLogging: [
      '3D Volume: Cylinder V = πr²h, Cone V = (1/3)πr²h',
      '3D Volume: Sphere V = (4/3)πr³, Pyramid V = (1/3)Bh',
      'Dimensional scaling law: linear k, area k², volume k³',
      'Non-uniform percent scaling: (1 + r_r)²(1 - r_h)'
    ]
  },
  {
    id: 'geom-l2-congruence-similarity-angles',
    domainId: 'geometry-trig',
    domainTitle: 'Domain 4: Geometry & Trigonometry',
    domainNumber: 4,
    lessonNumber: 2,
    totalLessonsInDomain: 6,
    lessonTitle: 'Congruence, Similarity, and Angle Relationships',
    badge: 'Similarity Ratios',
    subtitle: 'Triangle sum, transversal theorems, and similar triangle side-length proportions.',
    formulasAndRules: [
      {
        label: 'Triangle Angle Sum',
        formula: '∠A + ∠B + ∠C = 180°',
        explanation: 'The interior angles of any triangle always sum to 180°.'
      },
      {
        label: 'Similar Triangles Proportion',
        formula: 'AB / DE = BC / EF = AC / DF',
        explanation: 'Corresponding angles are EQUAL; corresponding side lengths are strictly PROPORTIONAL.'
      },
      {
        label: 'Transversal Angles',
        formula: 'Alternate interior angles are equal; linear pairs sum to 180°',
        explanation: 'Parallel lines cut by a transversal create pairs of equal alternate angles.'
      }
    ],
    solvingMethod: 'Match corresponding vertices between similar triangles. Set up side length ratios to solve for the missing segment.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 5: Foundations',
        description: 'Find supplementary linear pairs or simple interior triangle angles.',
        example: 'Given two angles of a triangle are 50° and 70°, the third angle is 180° - 120° = 60°.'
      },
      medium: {
        unitLabel: 'Unit 9: Medium',
        description: 'Solve for missing sides in nested similar triangles formed by parallel lines.',
        example: 'A small triangle nested inside a large triangle with parallel bases: solve for the base using x / 12 = 4 / 6.'
      },
      hard: {
        unitLabel: 'Unit 13: Advanced (750+)',
        description: 'Rotated overlapping similar triangles with algebraic side lengths requiring quadratic solutions.',
        example: 'Triangles sharing a vertex where side lengths are expressed as (x + 3) and (2x - 1); cross-multiply to solve for x.'
      }
    },
    conceptsForLogging: [
      'Triangle interior angle sum = 180°',
      'Similar triangles: AB/DE = BC/EF = AC/DF',
      'Nested similar triangles with parallel transversal base',
      'Rotated similar triangles algebraic solving'
    ]
  },
  {
    id: 'geom-l3-right-triangle-trigonometry',
    domainId: 'geometry-trig',
    domainTitle: 'Domain 4: Geometry & Trigonometry',
    domainNumber: 4,
    lessonNumber: 3,
    totalLessonsInDomain: 6,
    lessonTitle: 'Right Triangle Trigonometry & Special Triangles',
    badge: 'Guaranteed 750+ Topic',
    subtitle: 'SOH-CAH-TOA, 4 core triples, 30°-60°-90° & 45°-45°-90° ratios, and the Complementary Angle identity.',
    formulasAndRules: [
      {
        label: 'SOH - CAH - TOA Definitions',
        formula: 'sin θ = O / H  |  cos θ = A / H  |  tan θ = O / A',
        explanation: 'O = Opposite, A = Adjacent, H = Hypotenuse.'
      },
      {
        label: 'Core Pythagorean Triples',
        formula: '3-4-5  |  5-12-13  |  8-15-17  |  7-24-25',
        explanation: 'Multiples also form valid triples: 6-8-10, 9-12-15, 10-24-26, 30-40-50.'
      },
      {
        label: 'Special Right Triangles',
        formula: '30°-60°-90°: x : x√3 : 2x  |  45°-45°-90°: x : x : x√2',
        explanation: 'Short leg = x (opposite 30°), long leg = x√3 (opposite 60°), hypotenuse = 2x.'
      },
      {
        label: 'The Complementary Angle Theorem',
        formula: 'sin(A) = cos(B) ──► A + B = 90°  (or π/2 rad)',
        explanation: 'The sine of an acute angle equals the cosine of its complementary angle.'
      }
    ],
    solvingMethod: 'For any right triangle, label Opposite, Adjacent, and Hypotenuse relative to angle θ. For complementary problems, set arguments to sum to 90° immediately.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 5: Foundations',
        description: 'Identify sin θ, cos θ, or tan θ directly from a labeled right triangle diagram.',
        example: 'In a 3-4-5 triangle, sin θ = 3/5.'
      },
      medium: {
        unitLabel: 'Unit 9: Medium',
        description: 'Use special 30-60-90 or 45-45-90 ratios to find a missing altitude or hypotenuse.',
        example: 'Given hypotenuse 10 in a 30-60-90 triangle, short leg = 5, long leg = 5√3.'
      },
      hard: {
        unitLabel: 'Unit 13: Advanced (750+)',
        description: 'Solve algebraic complementary angle equations with multi-step expressions.',
        example: 'If sin(3x - 10°) = cos(2x + 20°), then (3x - 10) + (2x + 20) = 90°  ──►  5x + 10 = 90  ──►  5x = 80  ──►  x = 16'
      }
    },
    conceptsForLogging: [
      'SOH-CAH-TOA definitions',
      'Pythagorean triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25',
      '30-60-90 ratio x : x√3 : 2x',
      '45-45-90 ratio x : x : x√2',
      'Complementary theorem: sin(A) = cos(B) → A + B = 90°'
    ]
  },
  {
    id: 'geom-l4-circle-theorems',
    domainId: 'geometry-trig',
    domainTitle: 'Domain 4: Geometry & Trigonometry',
    domainNumber: 4,
    lessonNumber: 4,
    totalLessonsInDomain: 6,
    lessonTitle: 'Circle Theorems (Arcs, Sectors, Angles)',
    badge: 'Master Proportion',
    subtitle: 'The 4-way circle proportion, radian arc/sector formulas, tangent perpendicularity, and semicircle theorems.',
    formulasAndRules: [
      {
        label: 'The Master Circle Proportion (Degrees)',
        formula: 'θ° / 360° = s / (2πr) = A / (πr²)',
        explanation: 'Central angle over 360° equals arc length s over circumference (2πr) equals sector area A over total area (πr²).'
      },
      {
        label: 'Radian Arc Length & Sector Area',
        formula: 'Arc Length: s = r · θ  |  Sector Area: A = (1/2) · r² · θ',
        explanation: 'Applies exclusively when central angle θ is in radians.'
      },
      {
        label: 'Tangent Line Perpendicularity',
        formula: 'Tangent meets radius at exactly 90°',
        explanation: 'Forms a right angle with the radius at the point of contact.'
      },
      {
        label: 'Inscribed Angle & Semicircle Theorems',
        formula: 'Inscribed Angle = (1/2) · (Central Angle)  |  Angle facing diameter = 90°',
        explanation: 'Any angle inscribed inside a semicircle is always a 90° right angle.'
      }
    ],
    solvingMethod: 'Set any two fractions in the 4-way proportion equal to each other to solve for the missing variable. Look for right triangles formed by tangent lines and radii.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 5: Foundations',
        description: 'Find circumference or full circle area given the radius.',
        example: 'Find area of circle with r = 6 ──► A = π(6)² = 36π'
      },
      medium: {
        unitLabel: 'Unit 9: Medium',
        description: 'Calculate sector area or arc length from a central angle in degrees.',
        example: 'Central angle 60° in circle with r = 6: Arc s = (60/360) · 2π(6) = 2π'
      },
      hard: {
        unitLabel: 'Unit 13: Advanced (750+)',
        description: 'Right triangles formed by tangent lines to circle radii, solved via the Pythagorean theorem.',
        example: 'A tangent segment of length 12 meets a circle of radius 5; distance from external point to center is hypotenuse c = √(5² + 12²) = 13.'
      }
    },
    conceptsForLogging: [
      'Master circle proportion: θ/360 = s/2πr = A/πr²',
      'Radian formulas: s = rθ and A = (1/2)r²θ',
      'Tangent meets radius at 90°',
      'Inscribed angle = 1/2 central angle',
      'Angle facing diameter = 90° (semicircle theorem)'
    ]
  },
  {
    id: 'geom-l5-unit-circle-trigonometry',
    domainId: 'geometry-trig',
    domainTitle: 'Domain 4: Geometry & Trigonometry',
    domainNumber: 4,
    lessonNumber: 5,
    totalLessonsInDomain: 6,
    lessonTitle: 'Unit Circle Trigonometry & Radians',
    badge: 'Coordinate Trig',
    subtitle: 'Radian conversions, special angle benchmark values, and unit circle coordinates (cos θ, sin θ).',
    formulasAndRules: [
      {
        label: 'Degree-Radian Conversions',
        formula: 'Radians = Degrees × (π / 180°)  |  Degrees = Radians × (180° / π)',
        explanation: 'Multiply by π/180 to get radians; multiply by 180/π to get degrees.'
      },
      {
        label: 'Unit Circle Coordinates (r = 1)',
        formula: 'x = cos θ  |  y = sin θ  |  tan θ = sin θ / cos θ',
        explanation: 'On the unit circle, the x-coordinate is cos θ and the y-coordinate is sin θ.'
      },
      {
        label: 'Benchmark Radians',
        formula: '30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2, 180° = π, 360° = 2π',
        explanation: 'Key angles to memorize for instant recall.'
      }
    ],
    solvingMethod: 'Determine the reference angle in Quadrant I, evaluate the trig value, then apply the quadrant sign (+ or -) based on coordinates.',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 5: Foundations',
        description: 'Convert degrees to radians directly.',
        example: 'Convert 45° to radians: 45 · (π / 180) = π / 4'
      },
      medium: {
        unitLabel: 'Unit 9: Medium',
        description: 'Evaluate trig values for special benchmark angles in Quadrant I.',
        example: 'cos(π/3) = 1/2  and  sin(π/6) = 1/2'
      },
      hard: {
        unitLabel: 'Unit 13: Advanced (750+)',
        description: 'Evaluate angles outside Quadrant I or negative rotations using reference angles and quadrant signs.',
        example: 'Evaluate sin(5π/6): reference angle is π/6 in Q2 where sin is positive ──► sin(5π/6) = +1/2'
      }
    },
    conceptsForLogging: [
      'Degree-radian conversion formulas',
      'Benchmark angles: π/6, π/4, π/3, π/2, π, 2π',
      'Unit circle coordinates: (cos θ, sin θ)',
      'Reference angles and quadrant signs (ASTC rule)'
    ]
  },
  {
    id: 'geom-l6-circle-equations',
    domainId: 'geometry-trig',
    domainTitle: 'Domain 4: Geometry & Trigonometry',
    domainNumber: 4,
    lessonNumber: 6,
    totalLessonsInDomain: 6,
    lessonTitle: 'Circle Equations in the xy-Plane',
    badge: 'Step-by-Step Blueprint',
    subtitle: 'Standard form circle equations, center sign flip, radius determination, and completing the square.',
    formulasAndRules: [
      {
        label: 'Standard Form Circle Equation',
        formula: '(x - h)² + (y - k)² = r²',
        explanation: 'Center is (h, k) [signs flip!], Radius = √r².'
      },
      {
        label: 'Completing the Square Term',
        formula: 'Add (b / 2)² to BOTH sides for both x and y',
        explanation: 'Take half the middle coefficient and square it to create perfect square trinomials.'
      }
    ],
    solvingMethod: 'Group x-terms and y-terms. Move the constant to the right. Add (A/2)² and (B/2)² to both sides. Factor into (x - h)² + (y - k)² = r².',
    difficultyEscalation: {
      foundations: {
        unitLabel: 'Unit 5: Foundations',
        description: 'State center and radius directly from standard form.',
        example: 'In (x - 3)² + (y + 4)² = 49, Center = (3, -4), Radius = √49 = 7.'
      },
      medium: {
        unitLabel: 'Unit 9: Medium',
        description: 'Write the equation given center (h, k) and a point on the circumference.',
        example: 'Given center (0, 0) and passes through (3, 4): r² = 3² + 4² = 25 ──► x² + y² = 25'
      },
      hard: {
        unitLabel: 'Unit 13: Advanced (750+)',
        description: 'Complete the square on expanded equations with x and y linear terms.',
        example: 'x² + y² - 6x + 8y = 24  ──►  (x² - 6x + 9) + (y² + 8y + 16) = 24 + 9 + 16  ──►  (x - 3)² + (y + 4)² = 49  ──►  Center (3, -4), Radius 7'
      }
    },
    desmosHack: 'Type the expanded circle equation directly into Desmos. Click the leftmost edge and rightmost edge; the midpoint between them is the center (h, k), and half the distance between them is the radius r.',
    conceptsForLogging: [
      'Standard form circle equation (x - h)² + (y - k)² = r²',
      'Circle center (h, k) sign flip rule',
      'Completing the square for x and y: add (b/2)²',
      'Determining radius r = √r²',
      'Desmos circle edge midpoint shortcut'
    ]
  }
];

// ==============================================================================
// 4 DOMAINS MASTER CATALOG
// ==============================================================================
export const OFFICIAL_MATH_DOMAINS: OfficialMathDomain[] = [
  {
    domainId: 'algebra',
    domainNumber: 1,
    domainTitle: 'Domain 1: Algebra',
    badge: '8 Lessons',
    description: 'Linear equations, inequalities, word problems, rate interpretation, graphs of lines, systems of equations, and inequality regions.',
    foundationsUnit: 2,
    mediumUnit: 6,
    advancedUnit: 10,
    lessons: DOMAIN_1_ALGEBRA_LESSONS
  },
  {
    domainId: 'problem-solving',
    domainNumber: 2,
    domainTitle: 'Domain 2: Problem Solving & Data Analysis',
    badge: '10 Lessons',
    description: 'Ratios, unit conversions, percentages, center and spread, scatterplots, linear vs. exponential, probability, data inferences, and statistical claims.',
    foundationsUnit: 3,
    mediumUnit: 7,
    advancedUnit: 11,
    lessons: DOMAIN_2_DATA_ANALYSIS_LESSONS
  },
  {
    domainId: 'advanced-math',
    domainNumber: 3,
    domainTitle: 'Domain 3: Advanced Math',
    badge: '13 Lessons',
    description: 'Factoring, exponent rules, polynomial operations, rational expressions, nonlinear functions, quadratic formula, linear-quadratic systems, and graph multiplicity.',
    foundationsUnit: 4,
    mediumUnit: 8,
    advancedUnit: 12,
    lessons: DOMAIN_3_ADVANCED_MATH_LESSONS
  },
  {
    domainId: 'geometry-trig',
    domainNumber: 4,
    domainTitle: 'Domain 4: Geometry & Trigonometry',
    badge: '6 Lessons',
    description: '3D volume formulas, dimensional scaling, similar triangles, right triangle trigonometry, circle proportions, unit circle coordinates, and circle equations.',
    foundationsUnit: 5,
    mediumUnit: 9,
    advancedUnit: 13,
    lessons: DOMAIN_4_GEOMETRY_TRIG_LESSONS
  }
];

export const ALL_37_OFFICIAL_MATH_LESSONS: OfficialMathLesson[] = [
  ...DOMAIN_1_ALGEBRA_LESSONS,
  ...DOMAIN_2_DATA_ANALYSIS_LESSONS,
  ...DOMAIN_3_ADVANCED_MATH_LESSONS,
  ...DOMAIN_4_GEOMETRY_TRIG_LESSONS
];
