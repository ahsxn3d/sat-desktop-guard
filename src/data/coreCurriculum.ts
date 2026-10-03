// ==============================================================================
// THE ANTI-BURNOUT SAT RULEBOOK - CORE CURRICULUM KNOWLEDGE BASE
// ==============================================================================
// Synchronized, authoritative reference for all 4 Official Domains & 37 Lessons.
// Used by the Core Info section, Calendar struggle logger, and Error Log.
// ==============================================================================

import {
  OFFICIAL_MATH_DOMAINS,
  ALL_37_OFFICIAL_MATH_LESSONS,
  OfficialMathLesson,
  OfficialMathDomain
} from './mathCurriculumUpgrade';

export interface CoreCurriculumLesson {
  id: string;
  chapterId: string;
  chapterTitle: string;
  lessonTitle: string;
  satDomain: 'Math' | 'Reading/Writing';
  definition?: string;
  formulas: {
    label: string;
    formula: string;
    explanation?: string;
  }[];
  methods?: {
    title: string;
    steps: string[];
    reverseSteps?: string[];
  }[];
  goldenRules?: string[];
  trapsAndWarnings?: string[];
  exampleLogic?: string;
  unitCircleTable?: {
    theta: string;
    deg: string;
    cos: string;
    sin: string;
    tan: string;
  }[];
  conceptsForLogging: string[]; // Specific items for the struggle/error-log dropdown
}

export interface CoreCurriculumChapter {
  id: string;
  title: string;
  badge: string;
  description: string;
  lessons: CoreCurriculumLesson[];
}

export const CORE_CURRICULUM_CHAPTERS: CoreCurriculumChapter[] = OFFICIAL_MATH_DOMAINS.map((domain) => {
  const shortTitle =
    domain.domainNumber === 1
      ? 'Algebra'
      : domain.domainNumber === 2
      ? 'Problem Solving & Data Analysis'
      : domain.domainNumber === 3
      ? 'Advanced Math'
      : 'Geometry & Trigonometry';

  const mappedLessons: CoreCurriculumLesson[] = domain.lessons.map((lesson) => ({
    id: lesson.id,
    chapterId: domain.domainId,
    chapterTitle: shortTitle,
    lessonTitle: lesson.lessonTitle,
    satDomain: 'Math' as const,
    definition: lesson.subtitle,
    formulas: lesson.formulasAndRules.map((f) => ({
      label: f.label,
      formula: f.formula,
      explanation: f.explanation
    })),
    methods: [
      {
        title: 'Official Solving Method',
        steps: [lesson.solvingMethod]
      }
    ],
    trapsAndWarnings: lesson.desmosHack ? [lesson.desmosHack] : [],
    conceptsForLogging: lesson.conceptsForLogging
  }));

  // If geometry, also retain the high-yield Medium-to-Hard Shift concepts for student struggle logging
  if (domain.domainId === 'geometry-trig') {
    mappedLessons.push({
      id: 'geom-medium-to-hard-shift',
      chapterId: 'geometry-trig',
      chapterTitle: 'Geometry & Trigonometry',
      lessonTitle: 'Mastering Geometry & The Medium-to-Hard Shift',
      satDomain: 'Math',
      definition: 'Deconstructing the architectural shift from medium geometry to hard multi-concept synthesis, completing the square for circles, complementary trig identities, scale factor multipliers, and Desmos bypass tactics.',
      formulas: [
        {
          label: 'Equation of a Circle via Completing the Square',
          formula: 'x² + y² + Ax + By + C = 0 ──► (x - h)² + (y - k)² = r²',
          explanation: 'Group x-terms and y-terms, add (A/2)² and (B/2)² to both sides to find center (h, k) and radius r.'
        },
        {
          label: 'Complementary Angle Trigonometric Identity',
          formula: 'sin(x) = cos(90° - x)  or  sin(x) = cos(π/2 - x)',
          explanation: 'Hard SAT questions repeatedly test this in algebraic formats: if sin(3x - 10) = cos(2x + 20), then (3x - 10) + (2x + 20) = 90°.'
        },
        {
          label: 'Scale Factor Area & Volume Multipliers',
          formula: 'Linear ratio a : b ──► Surface Area a² : b² ──► Volume a³ : b³',
          explanation: 'If length doubles (2x), area quadruples (4x), and volume octuples (8x).'
        },
        {
          label: 'Core Four-Way Circle Proportion (The Master Formula)',
          formula: '(Central Angle / 360°) = (Arc Length / 2πr) = (Sector Area / πr²) = (Angle in Radians / 2π)',
          explanation: 'Nearly every circle geometry question on the SAT is solved using this four-way proportion.'
        }
      ],
      methods: [
        {
          title: 'What Changes from Medium to Hard in Geometry?',
          steps: [
            '1. In Medium Questions: Diagram is usually given. Apply single formula directly.',
            '2. In Hard Questions: No figure provided. Must construct geometry using coordinate and angle constraints.',
            '3. Multi-Concept Synthesis: Combining circle equations with tangent lines or nesting right triangles inside circular sectors.',
            '4. Completing the Square: Transforming expanded form into standard circle form.',
            '5. Algebraic Complementary Angles: Setting the inside expressions to sum to 90° when sin(A) = cos(B).'
          ]
        }
      ],
      goldenRules: [
        'Tangent Line Perpendicularity: A tangent line to a circle always forms a 90° right angle with the radius at the point of contact.',
        'Complementary Angle Shortcut: If sin(A) = cos(B), then A + B = 90° (or π/2 in radians).',
        'Always draw figures on scratch paper when no diagram is provided.'
      ],
      trapsAndWarnings: [
        'Attempting to solve "no figure provided" hard geometry in your head without a sketch.',
        'Forgetting that linear scale ratio must be squared (a²:b²) for surface area and cubed (a³:b³) for volume.'
      ],
      conceptsForLogging: [
        'Circle equation: completing the square x² + y² + Ax + By + C = 0',
        'Complementary angles: sin(A) = cos(B) → A + B = 90°',
        'Similar solids scale factors: linear a:b → area a²:b² → volume a³:b³',
        'Four-way circle proportion: θ/360 = Arc/2πr = Sector/πr² = rad/2π',
        'Circle tangent perpendicularity: tangent forms 90° with radius',
        'Desmos circle plotting shortcut for center & radius',
        'Hard geometry: multi-concept synthesis without figure'
      ]
    });
  }

  return {
    id: domain.domainId,
    title: shortTitle,
    badge: `${domain.lessons.length} Lessons • Units ${domain.foundationsUnit}, ${domain.mediumUnit}, ${domain.advancedUnit}`,
    description: domain.description,
    lessons: mappedLessons
  };
});

// Helper functions for quick lookup and filtering
export function getAllCoreLessons(): CoreCurriculumLesson[] {
  return CORE_CURRICULUM_CHAPTERS.flatMap((ch) => ch.lessons);
}

export function getAllConceptsForLogging(): { chapter: string; lesson: string; concept: string }[] {
  const result: { chapter: string; lesson: string; concept: string }[] = [];
  for (const ch of CORE_CURRICULUM_CHAPTERS) {
    for (const l of ch.lessons) {
      for (const c of l.conceptsForLogging) {
        result.push({ chapter: ch.title, lesson: l.lessonTitle, concept: c });
      }
    }
  }
  return result;
}
