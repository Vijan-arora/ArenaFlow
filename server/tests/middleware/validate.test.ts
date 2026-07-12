import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { AppError } from '../../src/lib/app-error.js';
import { validateBody, validateQuery, VALIDATED_QUERY_KEY } from '../../src/middleware/validate.js';

describe('validate middleware', () => {
  const schema = z.object({
    id: z.string().min(1, 'ID is required'),
    count: z.number().int().optional(),
  });

  describe('validateBody', () => {
    it('should parse body successfully and call next()', () => {
      const req = { body: { id: 'test-123', count: 5 } } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn();

      validateBody(schema)(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body).toEqual({ id: 'test-123', count: 5 });
    });

    it('should forward badRequest AppError if body validation fails', () => {
      const req = { body: { id: '', count: 5 } } as unknown as Request; // empty id
      const res = {} as Response;
      const next = vi.fn();

      validateBody(schema)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0]![0];
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(400);
      expect((err as AppError).message).toContain('id: ID is required');
    });
  });

  describe('validateQuery', () => {
    it('should parse query successfully, store on res.locals, and call next()', () => {
      const req = { query: { id: 'test-123' } } as unknown as Request;
      const res = { locals: {} } as Response;
      const next = vi.fn();

      validateQuery(schema)(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals[VALIDATED_QUERY_KEY]).toEqual({ id: 'test-123' });
    });

    it('should forward badRequest AppError if query validation fails', () => {
      const req = { query: {} } as unknown as Request; // missing id
      const res = { locals: {} } as Response;
      const next = vi.fn();

      validateQuery(schema)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0]![0];
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(400);
    });
  });

  describe('firstIssue edge cases', () => {
    it('should return "Invalid request" if error has no issues', () => {
      // Create a Zod error with empty issues array
      const zodError = new z.ZodError([]);
      
      const req = { body: {} } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn();

      // Trigger validation which will throw a badRequest AppError with "Invalid request" message
      validateBody(z.any().refine(() => false, { message: 'never' }))(req, res, next);
      
      const next2 = vi.fn();
      // Let's call the validation directly or assert on validation with a custom empty issue
      // We can also trigger the middleware with a mock schema that fails and returns empty issues
      // Since firstIssue is internal, we trigger it via validation where z.string().safeParse(undefined) is mocked,
      // but simpler is to mock z.ZodError.prototype.issues to be empty.
      const originalIssues = Object.getOwnPropertyDescriptor(zodError, 'issues');
      Object.defineProperty(zodError, 'issues', { value: [] });
      
      // Let's trigger a parse failure manually by mocking z.ZodType schema's safeParse
      const customSchema = {
        safeParse: () => ({ success: false, error: zodError }),
      } as unknown as z.ZodTypeAny;

      validateBody(customSchema)(req, res, next2);
      expect(next2).toHaveBeenCalledTimes(1);
      const err = next2.mock.calls[0]![0];
      expect((err as AppError).message).toBe('Invalid request');

      if (originalIssues) {
        Object.defineProperty(zodError, 'issues', originalIssues);
      }
    });
  });
});
