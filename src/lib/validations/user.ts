import { z } from 'zod';

export const updateSettingsSchema = z.object({
  displayName: z.string().min(1, 'Display name cannot be empty').max(50).optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Target date must be in YYYY-MM-DD format').optional(),
  targetScore: z.number().int().min(400).max(1600).optional(),
  dailyTarget: z.number().int().min(1).max(20).optional(),
  strictMode: z.boolean().optional(),
  soundEffects: z.boolean().optional()
});

export const submitAssessmentSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  testType: z.enum(['PRACTICE', 'QUIZ', 'UNIT_TEST', 'DIAGNOSTIC']),
  targetId: z.string().default(''),
  answers: z.record(z.string(), z.string()).refine(
    (obj) => Object.keys(obj).length > 0,
    { message: 'At least one answer must be submitted' }
  )
});

export const resetProgressSchema = z.object({
  userId: z.string().min(1, 'userId is required')
});

export const deleteAccountSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  confirmation: z.literal('DELETE', {
    message: 'You must type DELETE in all capital letters to confirm'
  })
});
