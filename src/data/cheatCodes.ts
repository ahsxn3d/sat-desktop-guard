export interface CheatCodeItem {
  id: string;
  category: 'desmos' | 'rw-grammar' | 'rw-strategies';
  title: string;
  badge: string;
  badgeColor: string;
  ruleSummary: string;
  detailedGuidance: string;
  exampleSnippet?: string;
  trapAlert?: string;
  recommendedSyntax?: string;
}

export const CHEAT_CODES: CheatCodeItem[] = [
  // =========================================================================
  // 3. DESMOS CHEAT CODES (BUILT INTO BLUEBOOK, USE AGGRESSIVELY)
  // =========================================================================
  {
    id: 'desmos-systems',
    category: 'desmos',
    title: 'Systems of Equations: Intersection Point',
    badge: 'Desmos Math • 10x Speed',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    ruleSummary: 'Graph both equations directly and click the intersection point. Skip substitution and elimination entirely on multiple-choice questions.',
    detailedGuidance: 'Type both equations directly in standard form (e.g. 3x + 4y = 18 and 2x - y = 5). Desmos plots them immediately. Click the gray dot where the lines cross: it gives you the exact (x, y) coordinates in 2 seconds without any algebraic scratch paper work.',
    recommendedSyntax: '3x + 4y = 18\n2x - y = 5\n→ Click intersection dot (x, y)',
    exampleSnippet: 'Question: What is the value of x + y in the system 2x + 3y = 13 and x - y = 4?\nDesmos: Type both, read (5, 1), 5 + 1 = 6. Done!',
    trapAlert: 'Make sure you read what the question asks for (e.g. x + y, or 2x) rather than just x alone.'
  },
  {
    id: 'desmos-backsolve',
    category: 'desmos',
    title: 'Backsolve by Plugging in Answer Choices',
    badge: 'Desmos Math • Bypass Algebra',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    ruleSummary: 'Stuck on an equation? Define the variable (e.g. x = 5) and type the original equation. Desmos tells you true/false instantly.',
    detailedGuidance: 'Instead of forward-factoring or clearing fractions, test choices directly. Type x = 5 on line 1, then on line 2 type the question equation. If the statement evaluates to true or both sides match, that is your answer. Faster than forward solving on complex rational equations.',
    recommendedSyntax: 'Line 1: x = 5\nLine 2: (2x + 3)/(x - 1) = 3.25\n→ Check if equation holds true',
    exampleSnippet: 'When choices are integers (A) 3 (B) 5 (C) 8 (D) 12, change the slider value for x to test all 4 in under 15 seconds.',
    trapAlert: 'If there are extraneous roots, check that the denominator does not equal zero.'
  },
  {
    id: 'desmos-roots',
    category: 'desmos',
    title: 'Find Roots & Vertices by Graphing',
    badge: 'Desmos Math • Zero Factoring',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    ruleSummary: 'Type the expression set equal to y. Look at where it crosses the x-axis—those are your solutions. Works for quadratics, polynomials, and rational functions.',
    detailedGuidance: 'Never use the quadratic formula by hand unless equations have irrational symbolic constants. Type y = 2x^2 - 8x + 6, and click the x-intercepts to read solutions directly. Click the curve peak or trough to read the vertex coordinates: the y-value is the maximum or minimum value!',
    recommendedSyntax: 'y = ax^2 + bx + c\n→ Click x-intercepts for roots\n→ Click apex/trough for min/max vertex',
    exampleSnippet: 'Question: What is the minimum value of f(x) = 3x^2 - 12x + 19?\nDesmos: Click vertex (2, 7) → Minimum value is 7!',
    trapAlert: 'The question may ask for the x-value where the minimum occurs (x = 2) vs the minimum value itself (y = 7). Read carefully!'
  },
  {
    id: 'desmos-regression',
    category: 'desmos',
    title: 'Regression for Scatterplots & Data Tables',
    badge: 'Desmos Math • Instant Best-Fit',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    ruleSummary: 'Type data points as a table, then type y1 ~ mx1 + b. Desmos gives you the best-fit line equation automatically.',
    detailedGuidance: 'Click the "+" button in Desmos, choose "Table", and enter your scatterplot points (x1, y1). On line 2, type y1 ~ mx1 + b (use tilde "~", not equals). Desmos instantly calculates the exact slope m, y-intercept b, and correlation coefficient r.',
    recommendedSyntax: 'Table: (x1, y1) points\nLine 2: y1 ~ mx1 + b\n(For exponentials: y1 ~ a * b^x1)',
    exampleSnippet: 'Points: (2, 5), (4, 9), (6, 13) → Desmos yields m = 2, b = 1. Equation is y = 2x + 1.',
    trapAlert: 'Make sure to write x1 and y1 with the number 1 right after the letter so Desmos connects to the table headers.'
  },
  {
    id: 'desmos-sliders',
    category: 'desmos',
    title: 'Sliders for Word Problems with Unknowns (a, b, k)',
    badge: 'Desmos Math • Constant Finder',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    ruleSummary: 'Type a = 1 or k = 1 and drag the slider Desmos creates. Watch how changing it affects the graph. Perfect for "what value of k makes this true" questions.',
    detailedGuidance: 'When a question asks: "For what value of k does the system have no solutions?", type the equations with k, click "Add slider: k", and drag the slider until lines are parallel (no intersection) or tangent. You can see the answer visually in seconds.',
    recommendedSyntax: 'y = 3x + 4\ny = kx - 2\n→ Drag slider k until lines never meet (k = 3)',
    exampleSnippet: 'Infinitely many solutions = lines overlap completely. No solution = lines are parallel. Exactly 1 solution = single intersection.',
    trapAlert: 'Set the slider step size to 1 or 0.5 in settings if answer choices are integers.'
  },
  {
    id: 'desmos-raw-arithmetic',
    category: 'desmos',
    title: 'Raw Arithmetic for Percentages & Ratios',
    badge: 'Desmos Math • Anti-Careless Error',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    ruleSummary: 'Just type raw arithmetic for percentage/ratio questions instead of doing it by hand: 150 * 0.8 is faster and error-free.',
    detailedGuidance: 'Eliminate arithmetic calculation fatigue. Do not multiply decimals or calculate 35% of 620 on scratch paper. Desmos evaluates raw arithmetic expressions with full order of operations in milliseconds, preventing careless mental math slips.',
    recommendedSyntax: '150 * 0.8 = 120 (for 20% discount)\n450 * (1 + 0.15) = 517.5 (for 15% increase)',
    exampleSnippet: 'Compound interest: 1000 * (1 + 0.05/12)^(12 * 3) → Type directly, get 1161.47 without multi-step rounding errors.',
    trapAlert: 'Never round intermediate calculations. Enter the full expression into one line.'
  },
  {
    id: 'desmos-abs',
    category: 'desmos',
    title: 'Absolute Value Equations: Type abs(x) Directly',
    badge: 'Desmos Math • Piecewise Bypass',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    ruleSummary: 'Type abs(x) directly in an equation. Don\'t manually split into cases unless the question explicitly demands it.',
    detailedGuidance: 'Type abs(2x - 5) = 9 or |2x - 5| = 9 directly. Desmos plots vertical solution lines at both roots (x = -2 and x = 7). You never need to write out the two separate positive and negative cases by hand.',
    recommendedSyntax: 'abs(2x - 5) = 9\n→ Read vertical solution lines on graph',
    exampleSnippet: 'Absolute value inequality: abs(x - 3) < 4 → Desmos shades the exact interval (-1, 7).',
    trapAlert: 'Watch for questions asking for the sum of solutions (-2 + 7 = 5) or number of distinct solutions.'
  },
  {
    id: 'desmos-anti-crutch',
    category: 'desmos',
    title: 'The Anti-Crutch Rule: Don\'t Graph Everything!',
    badge: 'Desmos Math • Strategic Economy',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    ruleSummary: 'If a question is faster with mental math (like "what\'s 15% of 40"), do that instead. Desmos is a tool for questions that are graph-shaped, not a crutch for every question.',
    detailedGuidance: 'Opening Desmos and typing simple 1-step arithmetic wastes 20 seconds. Save Desmos for multi-step algebra, systems, quadratic roots, vertex finders, and regression. Preserve your speed on the easy questions.',
    recommendedSyntax: '15% of 40 = 10% (4) + 5% (2) = 6 in 3 seconds mentally!',
    exampleSnippet: 'Fast Mental Math: slope formula when given (0, 0) and (2, 6) → slope is 3 instantly. Don\'t open a regression table for that.',
    trapAlert: 'Balance speed with verification. Use Desmos when algebra takes > 45 seconds.'
  },

  // =========================================================================
  // 4. R&W CHEAT CODES: 6-8 GRAMMAR RULES TO HAVE MEMORIZED COLD
  // =========================================================================
  {
    id: 'rw-sub-verb',
    category: 'rw-grammar',
    title: '1. Subject-Verb Agreement (Prepositional Traps)',
    badge: 'R&W Grammar • Rule 1',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    ruleSummary: 'The verb must agree with the true grammatical subject. Watch for prepositional phrases between subject and verb—they trick you.',
    detailedGuidance: 'College Board intentionally inserts plural nouns right next to the verb inside prepositional phrases (e.g., "of the students", "in the ancient cities"). Cross out prepositional phrases with your mental pencil to find the true subject.',
    exampleSnippet: 'TRAP: "The discovery of ancient dinosaur fossils [reveal / reveals] new migration patterns."\nFIX: Cross out "of ancient dinosaur fossils". Subject is "discovery" (singular) → MUST BE "reveals"!',
    trapAlert: 'Words like "each", "everyone", "neither", and "either" are always singular.'
  },
  {
    id: 'rw-comma-splice',
    category: 'rw-grammar',
    title: '2. Comma Splices & Run-Ons',
    badge: 'R&W Grammar • Rule 2',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    ruleSummary: 'Two independent clauses need a period, semicolon, or comma + FANBOYS conjunction, not just a comma.',
    detailedGuidance: 'An independent clause has a subject and a verb and can stand alone as a sentence. Gluing two independent clauses together with just a comma is a Comma Splice—the #1 tested grammar trap on the SAT.',
    exampleSnippet: 'TRAP: "The storm arrived unexpectedly, the sailors headed for port." (Comma Splice)\nFIX 1: "The storm arrived unexpectedly; the sailors headed for port." (Semicolon)\nFIX 2: "The storm arrived unexpectedly, so the sailors headed for port." (Comma + FANBOYS)',
    trapAlert: 'FANBOYS: For, And, Nor, But, Or, Yet, So. A comma alone without FANBOYS cannot join two complete sentences.'
  },
  {
    id: 'rw-semicolon',
    category: 'rw-grammar',
    title: '3. The Semicolon & Conjunctive Adverb Rule',
    badge: 'R&W Grammar • Rule 3',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    ruleSummary: 'Semicolons join two independent clauses, or go before a conjunctive adverb (however, therefore, moreover) followed by a comma.',
    detailedGuidance: 'A semicolon is grammatically identical to a period. If you can\'t put a period there, you cannot put a semicolon. When using words like however, therefore, or furthermore between two independent clauses, the punctuation MUST be: [Clause 1]; however, [Clause 2].',
    exampleSnippet: 'CORRECT: "The research team gathered extensive data; however, the statistical significance remained inconclusive."',
    trapAlert: 'If one side of the semicolon is a dependent clause (cannot stand alone), the semicolon is WRONG.'
  },
  {
    id: 'rw-apostrophes',
    category: 'rw-grammar',
    title: '4. Apostrophes: it\'s vs. its vs. its\'',
    badge: 'R&W Grammar • Rule 4',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    ruleSummary: 'it\'s = it is. its = possessive. They will test this constantly. its\' does NOT exist in English.',
    detailedGuidance: 'Test every instance of "it\'s" by saying "it is" in your head. If "it is" sounds ridiculous in context, you must use "its". And remember: "its\'" with the apostrophe after the s is a complete hallucination—eliminate it on sight.',
    exampleSnippet: 'it\'s = contraction ("it\'s raining" = it is raining)\nits = possessive pronoun ("the dog wagged its tail")\nits\' = FAKE OPTION (never choose this on the SAT)',
    trapAlert: 'their = possessive ("their books"); they\'re = they are; there = location ("over there").'
  },
  {
    id: 'rw-parallel',
    category: 'rw-grammar',
    title: '5. Parallel Structure in Lists & Comparisons',
    badge: 'R&W Grammar • Rule 5',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    ruleSummary: '"She likes running, swimming, and to bike" is wrong; it needs "biking". Lists and comparisons must match grammatical forms.',
    detailedGuidance: 'All items connected by "and", "or", or commas in a series must have identical grammatical structure (all -ing verbs, all past tense, or all nouns). In comparisons, make sure you compare the same types of things (use "that of" or "those of").',
    exampleSnippet: 'TRAP: "The author focuses on writing vivid dialogue, creating suspense, and to develop complex characters."\nFIX: "...creating suspense, and developing complex characters." (all -ing)',
    trapAlert: 'Comparison trap: "The wingspan of an albatross is greater than an eagle." WRONG! Must be "greater than that of an eagle."'
  },
  {
    id: 'rw-dangling',
    category: 'rw-grammar',
    title: '6. Dangling & Misplaced Modifiers',
    badge: 'R&W Grammar • Rule 6',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    ruleSummary: 'The introductory descriptive phrase at the start of a sentence must logically describe the subject right after the comma.',
    detailedGuidance: 'When a sentence starts with an introductory modifying phrase (like an -ing or -ed phrase), ask yourself: "WHO or WHAT is actually doing this action?" That person or thing MUST be the very first noun immediately following the comma.',
    exampleSnippet: 'TRAP: "Having finished the laboratory experiment, the report was submitted by the students." (The report didn\'t do the experiment!)\nFIX: "Having finished the laboratory experiment, the students submitted the report."',
    trapAlert: 'If an inanimate object (the report, the car, the discovery) is placed right after the comma doing a human action, it is 100% a dangling modifier trap.'
  },

  // =========================================================================
  // 4. R&W QUESTION-TYPE STRATEGIES
  // =========================================================================
  {
    id: 'strat-words-in-context',
    category: 'rw-strategies',
    title: 'Words in Context: Cover & Predict First',
    badge: 'R&W Strategy • Vocabulary',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    ruleSummary: 'Cover the blank, predict your own word first, then find the closest match. Don\'t look at answer choices before predicting.',
    detailedGuidance: 'Cover the blank with your hand or finger. Read the sentence and find the context clues (e.g. contrast words like "despite", cause words like "because"). Predict a simple 5th-grade word that fits the blank. THEN look at the 4 choices and match your prediction. If you read the choices first, College Board\'s attractive distractors will bias your thinking.',
    exampleSnippet: 'Sentence: "Although the critic was usually harsh, she offered ______ praise for the director\'s debut."\nClue: "Although harsh" → prediction: "generous / enthusiastic". Match choice: "effusive". Done!',
    trapAlert: 'Eliminate choices that mean the exact opposite or have the wrong tone/connotation (positive vs negative).'
  },
  {
    id: 'strat-transitions',
    category: 'rw-strategies',
    title: 'Transitions: Pre-Categorize the Relationship',
    badge: 'R&W Strategy • Logic Connectors',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    ruleSummary: 'Read the sentence before AND after the blank. Figure out the logical relationship before touching the answer choices.',
    detailedGuidance: 'Read Sentence 1 completely, then read Sentence 2. Decide which category connects them before reading choices:\n1. CONTRAST: however, nevertheless, conversely, on the other hand\n2. CAUSE/EFFECT: therefore, thus, consequently, as a result\n3. ADDITION: furthermore, moreover, additionally\n4. EXAMPLE/SPECIFICITY: for instance, specifically, to illustrate',
    exampleSnippet: 'If sentence 2 provides proof for sentence 1, it\'s "for example". If sentence 2 contradicts sentence 1, it\'s "however". Never test choices by "what sounds good."',
    trapAlert: 'If two answer choices belong to the exact same category (e.g. "Furthermore" and "Moreover"), neither can be right! Eliminate both.'
  },
  {
    id: 'strat-boundaries',
    category: 'rw-strategies',
    title: 'Boundaries / Punctuation: The Simplicity Rule',
    badge: 'R&W Grammar • Punctuation',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    ruleSummary: 'The simplest grammatically correct option is usually right. If you\'re not sure a comma is needed, it probably isn\'t.',
    detailedGuidance: 'College Board\'s primary punctuation trap is over-punctuation. Students love adding commas where they pause to breathe. In English, commas are only used for specific rules (lists, non-essential clauses, introductory phrases, compound sentences with FANBOYS). Never place a comma between a subject and its verb.',
    exampleSnippet: 'TRAP: "The biologist, Dr. Elena Rostova discovered..." WRONG (unnecessary comma before verb).\nCORRECT: "The biologist Dr. Elena Rostova discovered..."',
    trapAlert: 'Never put a comma before or after "that" (e.g. "The hypothesis, that..." is always wrong).'
  },
  {
    id: 'strat-evidence',
    category: 'rw-strategies',
    title: 'Command of Evidence (Quantitative / Graphs)',
    badge: 'R&W Strategy • Literal Data',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    ruleSummary: 'Only use what the graph/table literally shows. Don\'t bring outside assumptions or "common sense" into it.',
    detailedGuidance: 'Check the graph title, axis labels, and legend units carefully. The correct answer choice will be 100% supported by exact data points in the chart. Trap answers often state a plausible real-world fact that simply is not measured or represented anywhere on the given graph.',
    exampleSnippet: 'Graph shows average temperature in London from 1950–2000.\nTrap choice: "Rainfall increased in 1980." (Might be true in reality, but graph doesn\'t measure rainfall!)',
    trapAlert: 'Verify the direction of trends (increasing vs decreasing) and whether numbers represent percentages or raw counts.'
  },
  {
    id: 'strat-rhetorical',
    category: 'rw-strategies',
    title: 'Rhetorical Synthesis: Read the Goal First',
    badge: 'R&W Strategy • Bullet Points',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    ruleSummary: 'Read what the question is actually asking for (compare, emphasize, illustrate) before evaluating the bullet points.',
    detailedGuidance: 'Do NOT read the 5 bullet points first! Read the final prompt sentence: "The student wants to [accomplish X goal]." What is X? (e.g. "emphasize a difference between...", "introduce X to an unfamiliar audience", "explain how X works"). Look ONLY for the choice that achieves that specific goal. The trap answers are all factually true statements from the notes that fail to meet the prompt\'s targeted goal.',
    exampleSnippet: 'Goal: "Emphasize a difference between species A and B."\nChoice A: Describes species A only (True, but doesn\'t compare! Eliminate).\nChoice B: "Unlike species A, which lives in..., species B inhabits..." (Directly contrasts! Correct!).',
    trapAlert: '90% of wrong choices in rhetorical synthesis are factually true statements from the bullets that answer the WRONG goal.'
  }
];
