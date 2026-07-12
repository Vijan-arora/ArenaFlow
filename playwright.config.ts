import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -w server',
    url: 'http://localhost:8080/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NODE_ENV: 'development',
      PORT: '8080',
      USE_FAKE_FIRESTORE: 'true',
      GEMINI_API_KEY: 'test-key',
      TELEMETRY_SIM_ENABLED: 'false',
      LOG_LEVEL: 'error',
    },
  },
});
