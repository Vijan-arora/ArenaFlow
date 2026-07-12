import { describe, expect, it } from 'vitest';
import { AppError } from '../../src/lib/app-error.js';

describe('AppError', () => {
  it('creates badRequest error correctly', () => {
    const error = AppError.badRequest('bad request occurred');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.message).toBe('bad request occurred');
    expect(error.name).toBe('AppError');
  });

  it('creates notFound error correctly', () => {
    const error = AppError.notFound('resource not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('resource not found');
    expect(error.name).toBe('AppError');
  });

  it('creates upstreamFailure error correctly', () => {
    const error = AppError.upstreamFailure('gemini', 'gemini timeout');
    expect(error.statusCode).toBe(502);
    expect(error.code).toBe('GEMINI_UNAVAILABLE');
    expect(error.message).toBe('gemini timeout');
    expect(error.name).toBe('AppError');
  });
});
