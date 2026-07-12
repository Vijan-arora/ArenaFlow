import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 }, // Ramp up to 20 virtual users
    { duration: '20s', target: 20 }, // Stay at 20 VUs
    { duration: '10s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Success rate >= 99%
    http_req_duration: ['p(95)<200'], // 95% of requests must complete under 200ms
  },
};

const BASE_URL = __ENV.E2E_BASE_URL || 'http://localhost:8080';

const QUESTIONS = [
  'Where is gate 1?',
  'Where can I get water?',
  'Is there a sensory room?',
  'How to take the metro?',
  'Where is food located?',
];

export default function () {
  // 1. Fan requests facilities
  const facilitiesRes = http.get(`${BASE_URL}/api/stadium/facilities?category=food`);
  check(facilitiesRes, {
    'facilities status is 200': (r) => r.status === 200,
    'facilities returned list': (r) => r.json().facilities !== undefined,
  });
  sleep(1);

  // 2. Fan asks a question
  const randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  const askPayload = JSON.stringify({
    question: randomQuestion,
    language: 'en',
  });
  const askParams = {
    headers: { 'Content-Type': 'application/json' },
  };
  const askRes = http.post(`${BASE_URL}/api/assistant/ask`, askPayload, askParams);
  check(askRes, {
    'ask status is 200': (r) => r.status === 200,
    'ask answered': (r) => r.json().answer !== undefined,
  });
  sleep(1);

  // 3. Organizer loads operations snapshot
  const opsRes = http.get(`${BASE_URL}/api/operations/snapshot`);
  check(opsRes, {
    'operations status is 200': (r) => r.status === 200,
  });
  sleep(2);
}
