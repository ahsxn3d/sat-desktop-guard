// ==============================================================================
// THE ANTI-BURNOUT SAT RULEBOOK - READING & WRITING (ENGLISH) CORE CURRICULUM
// ==============================================================================
// Authoritative, comprehensive knowledge base for SAT Reading & Writing units,
// official step-by-step methods, trap anatomies, top tips, the universal
// "Bare-Bones" strategy for non-native speakers, and difficulty scaling matrix.
// ==============================================================================

export interface RWLesson {
  id: string;
  unitId: string;
  unitNumber: number;
  unitTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  category: string;
  whatTheSatTests: string | { mainIdea?: string; details?: string; purpose?: string; structure?: string; partToWhole?: string; description?: string };
  officialSteps?: {
    stepNumber: number;
    title: string;
    description: string;
    example?: string;
  }[];
  topTips: {
    title: string;
    tip: string;
  }[];
  trapsAndWarnings?: {
    trapName: string;
    description: string;
  }[];
  rules?: {
    ruleName: string;
    must?: string[];
    mustNot?: string[];
    description?: string;
  }[];
  specialSection?: {
    type: 'transitions' | 'rhetorical-synthesis' | 'grammar-rules';
    title: string;
    data: any;
  };
}

export interface RWUnit {
  id: string;
  unitNumber: number;
  title: string;
  badge: string;
  description: string;
  lessons: RWLesson[];
}

export interface TransitionCategory {
  id: string;
  category: string;
  description: string;
  words: string[];
  toneColor: string;
}

export interface BareBonesRule {
  id: string;
  number: number;
  title: string;
  action: string;
  example: string;
  iconName: string;
}

export interface DifficultyScalingItem {
  id: string;
  questionType: string;
  foundationsLevel: string;
  mediumLevel: string;
  advancedLevel: string;
}

// ------------------------------------------------------------------------------
// THE FIVE PRIMARY TRANSITION CATEGORIES
// ------------------------------------------------------------------------------
export const TRANSITION_CATEGORIES: TransitionCategory[] = [
  {
    id: 'agreement',
    category: 'Agreement / Similarity',
    description: 'Shows that two ideas align, mirror each other, or reinforce the same point.',
    words: ['likewise', 'similarly', 'indeed', 'in fact'],
    toneColor: 'emerald'
  },
  {
    id: 'disagreement',
    category: 'Disagreement / Contrast',
    description: 'Reverses direction, presents an exception, counterpoint, or unexpected contrast.',
    words: ['however', 'nonetheless', 'conversely', 'yet', 'on the other hand'],
    toneColor: 'rose'
  },
  {
    id: 'sequence',
    category: 'Sequence / Order',
    description: 'Establishes chronological timing, historical phases, or sequential process steps.',
    words: ['subsequently', 'previously', 'then', 'thereafter'],
    toneColor: 'blue'
  },
  {
    id: 'addition',
    category: 'Addition / Exemplification',
    description: 'Adds another supporting premise or introduces a concrete illustrative example.',
    words: ['furthermore', 'moreover', 'for instance', 'in addition'],
    toneColor: 'purple'
  },
  {
    id: 'cause_effect',
    category: 'Cause and Effect',
    description: 'Indicates that sentence 2 is a direct consequence, deduction, or result of sentence 1.',
    words: ['therefore', 'consequently', 'thus', 'accordingly', 'as a result'],
    toneColor: 'amber'
  }
];

// ------------------------------------------------------------------------------
// UNIVERSAL NON-NATIVE SPEAKER STRATEGY: THE "BARE-BONES" METHOD
// ------------------------------------------------------------------------------
export const BARE_BONES_STRATEGY = {
  title: 'Universal Non-Native Speaker Strategy: The "Bare-Bones" Method',
  tagline: 'If English is not your first language, dense texts can feel overwhelming. Use these four rules shown across the lessons to deconstruct any complex passage into pure logic.',
  codeFlow: `[Complex Sentence] ──► Strip adjectives, prepositional phrases, and jargon\n                    ──► Retain only: [Subject] + [Verb] + [Object]\n                    ──► Tag tone: (+) or (-)`,
  rules: [
    {
      id: 'abbreviate-jargon',
      number: 1,
      title: 'Abbreviate the Jargon',
      action: 'Whenever you see scientific binomial nomenclature or obscure terms (e.g., Oculudentavis khaungraae or Dermochelys coriacea), do not try to pronounce them.',
      example: 'Cross them out mentally and replace them with a single letter: "Species O" or "Animal D". Never let alien vocabulary slow down your processing speed.',
      iconName: 'Code'
    },
    {
      id: 'ditch-descriptive-clutter',
      number: 2,
      title: 'Ditch the Descriptive Clutter',
      action: 'Ignore non-essential narrative details: book titles, university affiliations, award names, and publication dates.',
      example: 'Focus strictly on the core engine: Who did what? What was the hypothesis? What was the measurable result?',
      iconName: 'Scissors'
    },
    {
      id: 'charge-sentences-valence',
      number: 3,
      title: 'Charge Sentences with Valence (+ / -)',
      action: 'When processing dense vocabulary, track the positive (+), negative (-), or neutral (=) tone markers.',
      example: 'If an author states that a theory is "unsupported by the empirical records", label it Negative (-). The correct option will reflect that exact valence.',
      iconName: 'Zap'
    },
    {
      id: 'never-pick-unfamiliar-words',
      number: 4,
      title: 'Never Pick Words You Cannot Define Unless Forced',
      action: 'If you understand options A, B, and C, and they all introduce logical contradictions, then D must be the answer.',
      example: 'However, NEVER select an obscure, complex word simply because it sounds academic or sophisticated if an everyday word you fully understand fits the sentence cleanly.',
      iconName: 'ShieldAlert'
    }
  ]
};

// ------------------------------------------------------------------------------
// HOW THE QUESTIONS SCALE ACROSS DIFFICULTY LEVELS
// ------------------------------------------------------------------------------
export const DIFFICULTY_SCALING_MATRIX: DifficultyScalingItem[] = [
  {
    id: 'command-of-evidence',
    questionType: 'Command of Evidence',
    foundationsLevel: 'The evidence uses words that closely mirror the text. Short texts.',
    mediumLevel: 'Minor paraphrasing between text and evidence. Moderate texts.',
    advancedLevel: 'Abstract data or 19th-century literature. Distractor options that support an unstated, adjacent claim.'
  },
  {
    id: 'words-in-context',
    questionType: 'Words in Context',
    foundationsLevel: 'Common academic words (assist, prevent, typical). Clear sentence structure.',
    mediumLevel: 'Secondary definitions of familiar words (compromise, temper). Compound sentences.',
    advancedLevel: 'Archaic, low-frequency words, or high-level academic idioms (precipitate, proscribe, equivocal). Double negatives.'
  },
  {
    id: 'inferences',
    questionType: 'Inferences',
    foundationsLevel: 'Directly follows from the previous sentence; simple cause-and-effect.',
    mediumLevel: 'Requires linking two distinct premises across the paragraph.',
    advancedLevel: 'Complex scientific studies with conflicting variables, subtle control groups, and conditional conclusions.'
  },
  {
    id: 'transitions',
    questionType: 'Transitions',
    foundationsLevel: 'Obvious logical shifts (however, therefore, for example).',
    mediumLevel: 'Nuanced relationships (moreover, consequently, nevertheless).',
    advancedLevel: 'Subtle relationships (in fact, indeed, specifically, that is). Both sentences are complex compound structures.'
  }
];

// ------------------------------------------------------------------------------
// UNITS 2, 3, AND 4 COMPLETE CURRICULUM
// ------------------------------------------------------------------------------
export const READING_WRITING_UNITS: RWUnit[] = [
  // ===========================================================================
  // UNIT 2: INFORMATION AND IDEAS
  // ===========================================================================
  {
    id: 'unit-2-info-ideas',
    unitNumber: 2,
    title: 'Information and Ideas',
    badge: 'Evidence, Central Ideas & Inferences',
    description: 'Mastery of scientific/literary textual evidence, quantitative data graph analysis, central idea extraction, and defensible logical inferences.',
    lessons: [
      {
        id: 'rw-u2-l1-textual-evidence',
        unitId: 'unit-2-info-ideas',
        unitNumber: 2,
        unitTitle: 'Information and Ideas',
        lessonNumber: 1,
        lessonTitle: 'Command of Textual Evidence (Scientific & Literary)',
        category: 'Information and Ideas',
        whatTheSatTests: "Your ability to identify which piece of evidence directly supports, illustrates, or undermines an author's claim or hypothesis.",
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Identify the Argument / Claim',
            description: 'Isolate the central hypothesis or interpretation.',
            example: 'Example: "The sail-like structure running down the back of Spinosaurus improved underwater pursuits of prey capable of rapid maneuvers."'
          },
          {
            stepNumber: 2,
            title: 'Create a Test Phrase',
            description: 'Boil the core claim down into a simple, 4–6 word formula before reading options.',
            example: 'Example formula: "Sail helped spinosaurus turn fast in water."'
          },
          {
            stepNumber: 3,
            title: 'Test the Choices',
            description: 'Read each option while holding your test phrase in mind. If an option discusses an unrelated factor (e.g., battery life, travel distance, water displacement), eliminate it immediately. Select the option that directly matches your test phrase.'
          }
        ],
        topTips: [
          {
            title: 'Be Strict',
            tip: 'If an answer choice feels "sort of" like evidence, eliminate it. If you need to make several mental leaps to connect the option to the claim, it is wrong.'
          },
          {
            title: 'Stay Specific',
            tip: 'Do not stray beyond the passage. Eliminate choices that broaden the discussion or slip in unsupported ideas.'
          },
          {
            title: 'Read the Question Carefully',
            tip: 'Ensure you know whether the prompt asks for evidence that supports, illustrates, or undermines / weakens the claim.'
          }
        ]
      },
      {
        id: 'rw-u2-l2-quantitative-evidence',
        unitId: 'unit-2-info-ideas',
        unitNumber: 2,
        unitTitle: 'Information and Ideas',
        lessonNumber: 2,
        lessonTitle: 'Command of Quantitative Evidence (Data, Graphs, & Tables)',
        category: 'Information and Ideas',
        whatTheSatTests: 'Your ability to synthesize data from a chart, table, or graph to accurately complete a sentence or support a textual claim.',
        trapsAndWarnings: [
          {
            trapName: 'False Statements',
            description: 'Choices that misread, reverse, or directly contradict the numbers/trends plotted on the graph.'
          },
          {
            trapName: 'True Statements (The Main Trap)',
            description: 'Choices that are 100% factually true according to the graph, but do not support the specific argument being made in the text.'
          }
        ],
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Skim the Graph First',
            description: 'Read the title, x-axis, y-axis, units (percentages vs. counts), and the legend.'
          },
          {
            stepNumber: 2,
            title: 'Read the Paragraph',
            description: 'Identify the exact assertion or argument that the blank needs to support.'
          },
          {
            stepNumber: 3,
            title: 'Validate the Choices (Data Check)',
            description: 'Check each choice against the graph. If the number or trend is factually incorrect on the graph, eliminate it.'
          },
          {
            stepNumber: 4,
            title: 'Find the Best Evidence (Argument Check)',
            description: 'From the remaining factually true choices, pick the one that directly backs up the author’s point.'
          }
        ],
        topTips: [
          {
            title: 'Use Your Cursor as a Ruler',
            tip: 'When reading graphs with crowded lines or bars, place your mouse cursor directly on the data point to avoid horizontal/vertical misalignments.'
          },
          {
            title: 'Ignore Irrelevant Data',
            tip: 'Charts contain surplus information designed to distract you. Focus strictly on the variables named in the prompt.'
          }
        ]
      },
      {
        id: 'rw-u2-l3-central-ideas',
        unitId: 'unit-2-info-ideas',
        unitNumber: 2,
        unitTitle: 'Information and Ideas',
        lessonNumber: 3,
        lessonTitle: 'Central Ideas and Details',
        category: 'Information and Ideas',
        whatTheSatTests: {
          mainIdea: 'Central Idea: The overarching theme or main argument of the entire passage.',
          details: 'Details: A specific factual statement mentioned directly in the text.'
        },
        rules: [
          {
            ruleName: 'Main Idea Criteria',
            must: [
              'Cover the majority of the details and reflect the primary emphasis.',
              'Capture the main logical thesis across the whole text.'
            ],
            mustNot: [
              'Be too narrow (focusing on one single line or tangent).',
              'Introduce outside concepts not in the passage.',
              'Contradict any stated factual claims in the text.'
            ]
          }
        ],
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Summarize in Your Own Words',
            description: 'Turn the text into a single, straightforward bullet point in your mind.'
          },
          {
            stepNumber: 2,
            title: 'Determine the Task',
            description: 'Ask yourself: "Does this ask for the main idea, or a specific detail?"'
          },
          {
            stepNumber: 3,
            title: 'Revisit the Text',
            description: "If it's a detail question, scan for the key word/phrase in the prompt. If it's a main idea, check your single-sentence summary."
          },
          {
            stepNumber: 4,
            title: 'Predict and Eliminate',
            description: 'Match your mental prediction against the choices.'
          }
        ],
        topTips: [
          {
            title: 'Details are Roadmaps',
            tip: 'Detail questions often reuse specific nouns or phrases from the passage. Use those words to locate the exact sentence that holds the answer.'
          },
          {
            title: 'Keep Predictions Short and Simple',
            tip: 'If your summary takes more than 10 words, simplify it.'
          }
        ]
      },
      {
        id: 'rw-u2-l4-inferences',
        unitId: 'unit-2-info-ideas',
        unitNumber: 2,
        unitTitle: 'Information and Ideas',
        lessonNumber: 4,
        lessonTitle: 'Inferences',
        category: 'Information and Ideas',
        whatTheSatTests: 'Completing an unfinished passage with the choice that most logically completes the text.',
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Separate the Text into Bullet Points',
            description: 'Mentally convert each sentence into an independent premise.'
          },
          {
            stepNumber: 2,
            title: 'Examine the Argument',
            description: 'How do the pieces connect? What conclusion naturally fills the gap without adding new premises?'
          },
          {
            stepNumber: 3,
            title: 'Test the Choices',
            description: 'Watch out for choices that introduce broad generalizations, speculate on future events, or conflict with premise constraints.'
          },
          {
            stepNumber: 4,
            title: 'Select the Seamless Fit',
            description: 'The correct inference will complete the logical train of thought without requiring external assumptions.'
          }
        ],
        topTips: [
          {
            title: 'Look Out for Strong Qualifiers',
            tip: 'Extreme words like always, never, all, completely, or must are red flags on inference questions. The SAT favors moderate, defensible language (some, often, may, tend to).'
          },
          {
            title: 'Lean on Transitions',
            tip: 'Transitions inside the passage (however, therefore, consequently) dictate the direction of the conclusion.'
          },
          {
            title: 'Trust the Direct Answer',
            tip: 'The correct inference is rarely complicated; it is usually the most direct, conservative next step.'
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // UNIT 3: CRAFT AND STRUCTURE
  // ===========================================================================
  {
    id: 'unit-3-craft-structure',
    unitNumber: 3,
    title: 'Craft and Structure',
    badge: 'Words in Context, Structure & Cross-Text',
    description: 'Precision vocabulary in context, part-to-whole paragraph structures, authorial purpose, and multi-passage comparative analysis.',
    lessons: [
      {
        id: 'rw-u3-l1-words-in-context',
        unitId: 'unit-3-craft-structure',
        unitNumber: 3,
        unitTitle: 'Craft and Structure',
        lessonNumber: 1,
        lessonTitle: 'Words in Context',
        category: 'Craft and Structure',
        whatTheSatTests: 'Selecting the most precise and contextually appropriate vocabulary word to fill a blank.',
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Summarize the Text & Predict',
            description: 'Read the text, mentally block the blank, and insert a simple, everyday word that fits the context (e.g., "good", "stopped", "different").'
          },
          {
            stepNumber: 2,
            title: 'Identify the Anchor Clue',
            description: 'Locate the specific word or phrase in the surrounding sentence that defines or mirrors the blank (often found in statement/restatement patterns or after colons).'
          },
          {
            stepNumber: 3,
            title: 'Select the Matching Word',
            description: 'Choose the answer option that matches your prediction and anchor clue.'
          }
        ],
        topTips: [
          {
            title: 'Charge It (+ / - / Neutral)',
            tip: 'Determine whether the blank requires a positive, negative, or neutral word based on tone clues. Eliminate choices with the wrong emotional polarity.'
          },
          {
            title: 'Reduce, Reuse, Recycle',
            tip: 'SAT passages often define the missing word within the same sentence using demonstrative pronouns (this, these) or parallel clauses.'
          },
          {
            title: "Don't Pick Unfamiliar Words Just Because They Sound Sophisticated",
            tip: 'If you know choices A, B, and C are incorrect, choose D. But never pick an unfamiliar word if an everyday word you fully understand fits the sentence cleanly.'
          },
          {
            title: 'Watch Punctuation',
            tip: 'A colon (:) or dash (—) frequently signals that an explanation or definition of the blank immediately follows.'
          }
        ]
      },
      {
        id: 'rw-u3-l2-text-structure-purpose',
        unitId: 'unit-3-craft-structure',
        unitNumber: 3,
        unitTitle: 'Craft and Structure',
        lessonNumber: 2,
        lessonTitle: 'Text Structure and Purpose (including Part-to-Whole)',
        category: 'Craft and Structure',
        whatTheSatTests: {
          purpose: 'Purpose: Why did the author write this? (to challenge, to illustrate, to summarize, to reconcile).',
          structure: 'Structure: How does the passage progress? (presents a finding ──► discusses a limitation).',
          partToWhole: 'Part-to-Whole: The specific rhetorical function of the underlined sentence within the passage.'
        },
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Identify the Task',
            description: "Clarify whether the prompt targets the entire passage's structure, the overall main purpose, or an underlined sentence."
          },
          {
            stepNumber: 2,
            title: 'Summarize the Motion',
            description: 'Track how the passage moves from sentence 1 to the end (e.g., Claim ──► Evidence; or History ──► Modern Re-evaluation).'
          },
          {
            stepNumber: 3,
            title: 'Test the Choices',
            description: 'Check every clause of each choice.'
          }
        ],
        topTips: [
          {
            title: 'Be Strict on Two-Part Choices',
            tip: 'If an option says: "The author outlines a traditional theory and then disproves it", BOTH halves must be true. If the author only questions the theory rather than disproving it, the entire option is wrong.'
          },
          {
            title: 'Stay Within the Underline (Part-to-Whole)',
            tip: 'Focus exclusively on the role played by the underlined portion. Incorrect options often describe what the rest of the paragraph is doing instead.'
          }
        ]
      },
      {
        id: 'rw-u3-l3-cross-text-connections',
        unitId: 'unit-3-craft-structure',
        unitNumber: 3,
        unitTitle: 'Craft and Structure',
        lessonNumber: 3,
        lessonTitle: 'Cross-Text Connections',
        category: 'Craft and Structure',
        whatTheSatTests: "Synthesizing two short passages (Text 1 and Text 2) and identifying how the authors would react to each other's points.",
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Summarize Text 1',
            description: "Write down a 3–5 word summary of Text 1's main thesis."
          },
          {
            stepNumber: 2,
            title: 'Summarize Text 2',
            description: "Write down Text 2's stance (Does it agree? Disagree? Add nuance? Test the claim?)."
          },
          {
            stepNumber: 3,
            title: 'Determine the Relationship',
            description: 'Define the connection (e.g., Text 2 provides real-world experimental data that contradicts the theoretical claim in Text 1).'
          },
          {
            stepNumber: 4,
            title: 'Test the Choices',
            description: 'Pick the option that matches the exact degree of agreement or disagreement.'
          }
        ],
        topTips: [
          {
            title: 'Look for Positives (+) and Negatives (-)',
            tip: 'Identify the evaluative adjectives authors use (compelling, flawed, premature, persuasive) to pinpoint their attitudes quickly.'
          },
          {
            title: 'Stick Strictly to the Text',
            tip: 'Avoid assuming that an author completely rejects an idea if they merely pointed out an exception.'
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // UNIT 4: EXPRESSION OF IDEAS & STANDARD ENGLISH CONVENTIONS
  // ===========================================================================
  {
    id: 'unit-4-expression-conventions',
    unitNumber: 4,
    title: 'Expression of Ideas & Standard English Conventions',
    badge: 'Transitions, Rhetorical Synthesis & Grammar Boundaries',
    description: 'Transition word logic, student research synthesis, clause punctuation rules (Period = Semicolon), and modifier boundary placement.',
    lessons: [
      {
        id: 'rw-u4-l1-transitions',
        unitId: 'unit-4-expression-conventions',
        unitNumber: 4,
        unitTitle: 'Expression of Ideas & Standard English Conventions',
        lessonNumber: 1,
        lessonTitle: 'Transitions',
        category: 'Expression of Ideas',
        whatTheSatTests: 'Selecting the most logical transition word to connect ideas across sentences.',
        specialSection: {
          type: 'transitions',
          title: 'The Five Primary Transition Categories',
          data: TRANSITION_CATEGORIES
        },
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Isolate the Two Ideas',
            description: 'Read the sentence before the blank and the sentence containing the blank. Completely ignore the transition word itself.'
          },
          {
            stepNumber: 2,
            title: 'Identify the Relationship',
            description: 'Determine if sentence 2 adds information, gives an example, reverses direction, or shows an outcome of sentence 1.'
          },
          {
            stepNumber: 3,
            title: 'Select the Matching Transition',
            description: 'Choose the word that reflects the relationship identified in Step 2.'
          }
        ],
        topTips: [
          {
            title: 'Eliminate Copycats Immediately',
            tip: 'If two answer options belong to the exact same category (e.g., Option A: Furthermore, Option B: Moreover), both are automatically incorrect. Neither can be uniquely right, so eliminate both.'
          },
          {
            title: 'Plug and Play',
            tip: 'Re-read the completed sentence with your chosen transition to ensure it creates a natural logical progression.'
          }
        ]
      },
      {
        id: 'rw-u4-l2-rhetorical-synthesis',
        unitId: 'unit-4-expression-conventions',
        unitNumber: 4,
        unitTitle: 'Expression of Ideas & Standard English Conventions',
        lessonNumber: 2,
        lessonTitle: 'Rhetorical Synthesis (Student Notes / Goal Questions)',
        category: 'Expression of Ideas',
        whatTheSatTests: 'Using notes taken by a student to achieve a very specific rhetorical goal stated in the prompt.',
        officialSteps: [
          {
            stepNumber: 1,
            title: 'READ THE PROMPT GOAL FIRST',
            description: 'Never read the bulleted list first. Go straight to the prompt question (e.g., "The student wants to emphasize a similarity between the two novels. Which choice most effectively uses relevant information...?")'
          },
          {
            stepNumber: 2,
            title: 'Highlight the Core Condition',
            description: 'Underline the exact requirement (e.g., "emphasize a similarity", "introduce the researcher and her methodology").'
          },
          {
            stepNumber: 3,
            title: 'Filter the Options by Goal (First Pass)',
            description: 'Check the 4 options against the goal. If an option emphasizes a difference, introduces one novel, or lists publication dates, cross it out immediately—even if it is 100% factually accurate.'
          },
          {
            stepNumber: 4,
            title: 'Verify Accuracy (Second Pass)',
            description: 'Confirm that the winning choice does not misstate any facts from the bullet points.'
          }
        ],
        topTips: [
          {
            title: 'Be Strict on Two-Part Goals',
            tip: 'If the prompt asks to "introduce the scientist AND describe her methodology", a choice that only describes her discoveries is wrong.'
          },
          {
            title: 'Ignore Grammar Traps',
            tip: 'All four choices in Rhetorical Synthesis questions are grammatically error-free. The question tests goal satisfaction, not grammar.'
          }
        ]
      },
      {
        id: 'rw-u4-l3-boundaries-grammar',
        unitId: 'unit-4-expression-conventions',
        unitNumber: 4,
        unitTitle: 'Expression of Ideas & Standard English Conventions',
        lessonNumber: 3,
        lessonTitle: 'Boundaries (Punctuation) & Form, Structure, Sense (Grammar)',
        category: 'Standard English Conventions',
        whatTheSatTests: 'Punctuation, clause linking, subject-verb agreement, verb tenses, dangling modifiers, and pronouns.',
        officialSteps: [
          {
            stepNumber: 1,
            title: 'Isolate Independent vs. Dependent Clauses',
            description: 'Locate subjects, verbs, and conjunctions to see whether each clause can stand alone as a complete sentence.'
          },
          {
            stepNumber: 2,
            title: 'Check Boundary Punctuation',
            description: 'Verify if a period, semicolon, comma + FANBOYS, or colon is needed to correctly join the clauses without creating run-ons or comma splices.'
          },
          {
            stepNumber: 3,
            title: 'Verify Modifier Placement & Agreement',
            description: 'Ensure introductory descriptive phrases are immediately followed by the specific noun they modify, and verbs agree in number with their true subjects.'
          }
        ],
        specialSection: {
          type: 'grammar-rules',
          title: 'Essential Grammar & Punctuation Rules',
          data: {
            periodEqualsSemicolon: {
              rule: 'The Period = Semicolon Rule',
              explanation: 'On the digital SAT, a period (.) and a semicolon (;) perform the identical grammatical function of separating two independent clauses. If choices A and B are identical except that one uses a period and the other uses a semicolon, both are incorrect. Cross them both off immediately.'
            },
            danglingModifiers: {
              rule: 'Dangling Modifiers',
              explanation: 'Any introductory modifying phrase must be immediately followed by the specific noun it describes.',
              incorrect: 'Walking through the park, the flowers looked beautiful to Sarah.',
              correct: 'Walking through the park, Sarah admired the beautiful flowers.',
              why: 'The flowers were not walking through the park; Sarah was.'
            }
          }
        },
        topTips: [
          {
            title: "Don't Worry About Style",
            tip: 'The SAT does not test whether a semicolon looks more stylish than a period. It only tests strict grammatical mechanical rules.'
          },
          {
            title: 'The Period = Semicolon Rule',
            tip: 'If choices A and B are identical except that one uses a period and the other uses a semicolon, both are incorrect. Eliminate both instantly.'
          },
          {
            title: 'Modifier Placement',
            tip: 'Whatever noun is being described by the opening descriptive clause must come directly after the comma.'
          }
        ]
      }
    ]
  }
];

export function getAllRWLessons(): RWLesson[] {
  return READING_WRITING_UNITS.flatMap((u) => u.lessons);
}
