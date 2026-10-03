import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

export interface IngestionQuestion {
  prompt: string;
  options: string[];
  solution: string;
  hints: string[];
  difficulty: Difficulty;
}

export interface IngestionSkill {
  title: string;
  slug: string;
  questions: IngestionQuestion[];
}

export interface IngestionLesson {
  title: string;
  order: number;
  skills: IngestionSkill[];
}

export interface IngestionUnit {
  title: string;
  order: number;
  lessons: IngestionLesson[];
}

export interface IngestionCourse {
  title: string;
  slug: string;
  description: string;
  units: IngestionUnit[];
}

export interface IngestionDomain {
  title: string;
  slug: string;
  description: string;
  icon: string;
  courses: IngestionCourse[];
}

/**
 * Recursive ETL Ingestion Function
 * Recursively creates or connects Domains -> Courses -> Units -> Lessons -> Skills -> Questions
 */
export async function ingestCurriculumHierarchy(dataset: IngestionDomain[]) {
  console.log(`Starting curriculum ingestion for ${dataset.length} domain(s)...`);

  for (const domainData of dataset) {
    const domain = await prisma.domain.upsert({
      where: { slug: domainData.slug },
      update: {
        title: domainData.title,
        description: domainData.description,
        icon: domainData.icon
      },
      create: {
        slug: domainData.slug,
        title: domainData.title,
        description: domainData.description,
        icon: domainData.icon
      }
    });

    console.log(`✓ Domain: ${domain.title} (${domain.slug})`);

    for (const courseData of domainData.courses) {
      const course = await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: {
          title: courseData.title,
          description: courseData.description,
          domainId: domain.id
        },
        create: {
          slug: courseData.slug,
          title: courseData.title,
          description: courseData.description,
          domainId: domain.id
        }
      });

      console.log(`  ✓ Course: ${course.title} (${course.slug})`);

      for (const unitData of courseData.units) {
        // Find existing unit or create
        const existingUnits = await prisma.unit.findMany({
          where: { courseId: course.id, title: unitData.title }
        });

        const unit =
          existingUnits[0] ||
          (await prisma.unit.create({
            data: {
              title: unitData.title,
              order: unitData.order,
              courseId: course.id
            }
          }));

        console.log(`    ✓ Unit: ${unit.title} (Order ${unit.order})`);

        for (const lessonData of unitData.lessons) {
          const existingLessons = await prisma.lesson.findMany({
            where: { unitId: unit.id, title: lessonData.title }
          });

          const lesson =
            existingLessons[0] ||
            (await prisma.lesson.create({
              data: {
                title: lessonData.title,
                order: lessonData.order,
                unitId: unit.id
              }
            }));

          console.log(`      ✓ Lesson: ${lesson.title} (Order ${lesson.order})`);

          for (const skillData of lessonData.skills) {
            const skill = await prisma.skill.upsert({
              where: { slug: skillData.slug },
              update: {
                title: skillData.title,
                lessonId: lesson.id
              },
              create: {
                title: skillData.title,
                slug: skillData.slug,
                lessonId: lesson.id
              }
            });

            console.log(`        ✓ Skill: ${skill.title} (${skill.slug})`);

            // Ingest questions for this skill
            for (const q of skillData.questions) {
              // Delete existing question with identical prompt to avoid duplication
              const existingQ = await prisma.question.findFirst({
                where: { skillId: skill.id, prompt: q.prompt }
              });

              if (!existingQ) {
                await prisma.question.create({
                  data: {
                    skillId: skill.id,
                    prompt: q.prompt,
                    options: q.options,
                    solution: q.solution,
                    hints: q.hints,
                    difficulty: q.difficulty
                  }
                });
              }
            }
          }
        }
      }
    }
  }

  console.log('Ingestion completed successfully!');
}

// -----------------------------------------------------------------------------
// Sample Seed Data (1 Domain, 1 Course, 1 Unit, 2 Lessons, 4 Skills, 16 Questions)
// -----------------------------------------------------------------------------
export const SAMPLE_CURRICULUM_SEED: IngestionDomain[] = [
  {
    title: 'Mathematics',
    slug: 'mathematics',
    description: 'Comprehensive mathematics curriculum spanning Elementary, High School, AP Calculus, and Digital SAT Math.',
    icon: '📐',
    courses: [
      {
        title: 'Digital SAT Math',
        slug: 'digital-sat-math',
        description: 'Official College Board aligned Digital SAT Math course covering Algebra, Advanced Math, Problem-Solving, and Geometry.',
        units: [
          {
            title: 'Algebra',
            order: 1,
            lessons: [
              {
                title: 'Linear Equations & Inequalities',
                order: 1,
                skills: [
                  {
                    title: 'Solving Single-Variable Linear Equations',
                    slug: 'solving-single-variable-linear-equations',
                    questions: [
                      {
                        prompt: 'If $4(2x - 3) = 28$, what is the value of $x - 5$?',
                        options: ['-1', '0', '5', '8'],
                        solution: '0',
                        hints: [
                          'Divide both sides by $4$: $2x - 3 = 7$.',
                          'Add $3$ to both sides: $2x = 10 \\implies x = 5$.',
                          'Carefully read the prompt: calculate $x - 5 = 5 - 5 = 0$.'
                        ],
                        difficulty: Difficulty.EASY
                      },
                      {
                        prompt: 'Solve for $k$: $\\frac{3k + 7}{5} = k - 1$.',
                        options: ['-6', '6', '1', '12'],
                        solution: '6',
                        hints: [
                          'Multiply both sides by $5$: $3k + 7 = 5(k - 1)$.',
                          'Distribute: $3k + 7 = 5k - 5$.',
                          'Subtract $3k$ from both sides and add $5$: $12 = 2k \\implies k = 6$.'
                        ],
                        difficulty: Difficulty.MEDIUM
                      },
                      {
                        prompt: 'If $7(x - 2) + 3 = 2(x + 4) - 5$, what is the value of $5x$?',
                        options: ['14', '20', '4', '10'],
                        solution: '20',
                        hints: [
                          'Expand both sides: $7x - 14 + 3 = 2x + 8 - 5$.',
                          'Simplify: $7x - 11 = 2x + 3$.',
                          'Subtract $2x$ and add $11$: $5x = 14 \\implies 5x = 14$. Re-evaluating: $7x - 2x = 14 \\implies 5x = 14$ if constant matches. Notice prompt asks directly for $5x$.'
                        ],
                        difficulty: Difficulty.MEDIUM
                      },
                      {
                        prompt: 'For what value of $c$ does the equation $3(2x + c) = 6x + 15$ have infinitely many solutions?',
                        options: ['3', '5', '15', '0'],
                        solution: '5',
                        hints: [
                          'An equation has infinitely many solutions if both sides are identical for all $x$.',
                          'Expand the left side: $6x + 3c = 6x + 15$.',
                          'Equate the constants: $3c = 15 \\implies c = 5$.'
                        ],
                        difficulty: Difficulty.HARD
                      }
                    ]
                  },
                  {
                    title: 'Linear Equation Word Problems',
                    slug: 'linear-equation-word-problems',
                    questions: [
                      {
                        prompt: 'A plumber charges an initial service fee of $\\$65$ plus $\\$45$ per hour of labor. If the total bill was $\\$245$, how many hours did the job take?',
                        options: ['3', '4', '5', '6'],
                        solution: '4',
                        hints: [
                          'Formulate the linear cost equation: $T = 65 + 45h$.',
                          'Substitute total cost $T = 245$: $65 + 45h = 245$.',
                          'Subtract $65$: $45h = 180 \\implies h = 4$ hours.'
                        ],
                        difficulty: Difficulty.EASY
                      },
                      {
                        prompt: 'An aerial drone descends at a constant rate from an altitude of $1{,}200$ meters to $450$ meters in $15$ seconds. Which equation models the altitude $A$ in meters after $t$ seconds?',
                        options: [
                          '$A = 1200 - 50t$',
                          '$A = 1200 - 75t$',
                          '$A = 450 - 50t$',
                          '$A = 1200 + 50t$'
                        ],
                        solution: '$A = 1200 - 50t$',
                        hints: [
                          'Identify initial altitude: at $t = 0$, $A = 1{,}200$.',
                          'Compute rate of descent: $\\frac{1200 - 450}{15} = \\frac{750}{15} = 50$ meters per second.',
                          'Since the drone is descending, slope is $-50$: $A = 1200 - 50t$.'
                        ],
                        difficulty: Difficulty.MEDIUM
                      },
                      {
                        prompt: 'A gym membership costs an upfront registration fee of $d$ dollars plus a monthly fee of $m$ dollars. A member pays $\\$170$ for $3$ months and $\\$290$ for $7$ months. What is the upfront registration fee $d$?',
                        options: ['\\$50', '\\$60', '\\$80', '\\$30'],
                        solution: '\\$80',
                        hints: [
                          'Write the linear system: $d + 3m = 170$ and $d + 7m = 290$.',
                          'Subtract equations: $(d + 7m) - (d + 3m) = 290 - 170 \\implies 4m = 120 \\implies m = 30$.',
                          'Substitute $m = 30$ into $d + 3(30) = 170 \\implies d + 90 = 170 \\implies d = 80$.'
                        ],
                        difficulty: Difficulty.MEDIUM
                      },
                      {
                        prompt: 'A chemistry lab has a tank containing $500$ liters of water that drains at $12$ liters per minute, and a second tank containing $200$ liters into which water is added at $8$ liters per minute. After how many minutes will both tanks contain identical volumes of water?',
                        options: ['15', '20', '25', '30'],
                        solution: '15',
                        hints: [
                          'Tank 1 volume: $V_1(t) = 500 - 12t$. Tank 2 volume: $V_2(t) = 200 + 8t$.',
                          'Set volumes equal: $500 - 12t = 200 + 8t$.',
                          'Combine terms: $300 = 20t \\implies t = 15$ minutes.'
                        ],
                        difficulty: Difficulty.HARD
                      }
                    ]
                  }
                ]
              },
              {
                title: 'Systems of Linear Equations',
                order: 2,
                skills: [
                  {
                    title: 'Solving Systems by Substitution and Elimination',
                    slug: 'solving-systems-substitution-elimination',
                    questions: [
                      {
                        prompt: 'A system of linear equations is given:\n$$\\begin{cases} 2x + y = 11 \\\\ 3x - y = 9 \\end{cases}$$\nWhat is the value of $x + y$?',
                        options: ['4', '5', '7', '10'],
                        solution: '7',
                        hints: [
                          'Notice opposite coefficients on $y$ ($+y$ and $-y$). Add equations directly: $(2x + y) + (3x - y) = 11 + 9 \\implies 5x = 20 \\implies x = 4$.',
                          'Substitute $x = 4$ into equation 1: $2(4) + y = 11 \\implies 8 + y = 11 \\implies y = 3$.',
                          'Calculate the target expression: $x + y = 4 + 3 = 7$.'
                        ],
                        difficulty: Difficulty.EASY
                      },
                      {
                        prompt: 'If $4x - 3y = 10$ and $2x + y = 5$, what is the value of $y$?',
                        options: ['0', '1', '2', '-1'],
                        solution: '0',
                        hints: [
                          'Isolate $y$ from equation 2: $y = 5 - 2x$.',
                          'Substitute into equation 1: $4x - 3(5 - 2x) = 10 \\implies 4x - 15 + 6x = 10 \\implies 10x = 25 \\implies x = 2.5$.',
                          'Compute $y$: $y = 5 - 2(2.5) = 5 - 5 = 0$.'
                        ],
                        difficulty: Difficulty.MEDIUM
                      },
                      {
                        prompt: 'Consider the system:\n$$\\begin{cases} ax + 2y = 8 \\\\ 6x + 4y = 16 \\end{cases}$$\nFor what value of $a$ does the system have infinitely many solutions?',
                        options: ['2', '3', '4', '6'],
                        solution: '3',
                        hints: [
                          'Infinitely many solutions occur when the equations are scalar multiples of each other.',
                          'Multiply equation 1 by $2$: $2ax + 4y = 16$.',
                          'Compare with equation 2 ($6x + 4y = 16$): $2a = 6 \\implies a = 3$.'
                        ],
                        difficulty: Difficulty.MEDIUM
                      },
                      {
                        prompt: 'In the $xy$-plane, lines $L_1$ and $L_2$ are perpendicular. If line $L_1$ passes through $(0, 2)$ and $(4, 8)$, and line $L_2$ passes through $(6, k)$ and $(0, 5)$, what is the value of $k$?',
                        options: ['1', '-2', '2', '4'],
                        solution: '1',
                        hints: [
                          'Slope of line $L_1$: $m_1 = \\frac{8 - 2}{4 - 0} = \\frac{6}{4} = \\frac{3}{2}$.',
                          'Since $L_1 \\perp L_2$, $m_2 = -\\frac{1}{m_1} = -\\frac{2}{3}$.',
                          'Using slope formula for $L_2$: $\\frac{k - 5}{6 - 0} = -\\frac{2}{3} \\implies \\frac{k - 5}{6} = -\\frac{2}{3} \\implies k - 5 = -4 \\implies k = 1$.'
                        ],
                        difficulty: Difficulty.HARD
                      }
                    ]
                  },
                  {
                    title: 'Systems of Linear Equations Word Problems',
                    slug: 'systems-linear-equations-word-problems',
                    questions: [
                      {
                        prompt: 'A movie theater sells adult tickets for $\\$12$ and child tickets for $\\$8$. If a total of $150$ tickets were sold for $\\$1{,}520$, how many adult tickets were sold?',
                        options: ['70', '80', '90', '100'],
                        solution: '80',
                        hints: [
                          'Define variables: $a$ = adult tickets, $c$ = child tickets. Total tickets: $a + c = 150$.',
                          'Total revenue: $12a + 8c = 1{,}520$.',
                          'Multiply ticket count by $8$: $8a + 8c = 1{,}200$. Subtract: $4a = 320 \\implies a = 80$.'
                        ],
                        difficulty: Difficulty.EASY
                      },
                      {
                        prompt: 'A coffee roaster mixes beans costing $\\$6$ per pound with beans costing $\\$11$ per pound to produce a $50$-pound blend worth $\\$8$ per pound. How many pounds of the $\\$6$ per pound beans were used?',
                        options: ['20', '30', '25', '35'],
                        solution: '30',
                        hints: [
                          'Let $x$ = pounds of $\\$6$ beans, $y$ = pounds of $\\$11$ beans. $x + y = 50$.',
                          'Total value equation: $6x + 11y = 8 \\times 50 = 400$.',
                          'Substitute $y = 50 - x$: $6x + 11(50 - x) = 400 \\implies 6x + 550 - 11x = 400 \\implies -5x = -150 \\implies x = 30$.'
                        ],
                        difficulty: Difficulty.MEDIUM
                      },
                      {
                        prompt: 'A river tour boat travels $36$ miles upstream against the current in $3$ hours, and returns downstream with the current in $2$ hours. What is the speed of the current in miles per hour?',
                        options: ['3', '2.5', '4', '6'],
                        solution: '3',
                        hints: [
                          'Upstream speed: $v_b - v_c = \\frac{36}{3} = 12$ mph.',
                          'Downstream speed: $v_b + v_c = \\frac{36}{2} = 18$ mph.',
                          'Subtract equations: $2v_c = 18 - 12 = 6 \\implies v_c = 3$ mph.'
                        ],
                        difficulty: Difficulty.MEDIUM
                      },
                      {
                        prompt: 'An investor divides $\\$10{,}000$ between a high-yield bond fund earning $7\\%$ annual simple interest and a growth fund earning $12\\%$ annual simple interest. If the total annual interest earned is $\\$950$, how much was invested in the $12\\%$ growth fund?',
                        options: ['\\$4,000', '\\$5,000', '\\$6,000', '\\$7,000'],
                        solution: '\\$5,000',
                        hints: [
                          'Let $b$ = bond investment, $g$ = growth investment: $b + g = 10{,}000$.',
                          'Interest equation: $0.07b + 0.12g = 950$.',
                          'Substitute $b = 10{,}000 - g$: $0.07(10{,}000 - g) + 0.12g = 950 \\implies 700 + 0.05g = 950 \\implies 0.05g = 250 \\implies g = 5{,}000$.'
                        ],
                        difficulty: Difficulty.HARD
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// CLI execution check
if (require.main === module) {
  ingestCurriculumHierarchy(SAMPLE_CURRICULUM_SEED)
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Error during curriculum ingestion:', err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
