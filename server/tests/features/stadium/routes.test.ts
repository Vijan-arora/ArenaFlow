import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../../../src/app.js';

describe('Stadium Routes', () => {
  let app: ReturnType<typeof buildApp>;

  beforeAll(() => {
    app = buildApp();
  });

  describe('GET /api/stadium/venue', () => {
    it('returns the complete venue profile', async () => {
      const res = await request(app).get('/api/stadium/venue');
      expect(res.status).toBe(200);
      expect(res.body.venue).toBeDefined();
      expect(res.body.venue.name).toBe('Estadio Azteca');
      expect(res.body.venue.city).toBe('Mexico City');
      expect(res.body.venue.capacity).toBe(83264);
      expect(Array.isArray(res.body.venue.gates)).toBe(true);
      expect(res.body.venue.gates.length).toBe(6);
      expect(Array.isArray(res.body.venue.facilities)).toBe(true);
      expect(Array.isArray(res.body.venue.transit)).toBe(true);
    });
  });
});
