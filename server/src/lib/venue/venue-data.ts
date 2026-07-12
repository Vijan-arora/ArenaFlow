import { FACILITIES } from './data/facilities.js';
import { GATES } from './data/gates.js';
import { TRANSIT } from './data/transit.js';
import type { VenueProfile } from './types.js';

/** Static profile of the venue used to ground every assistant answer. */
export const VENUE: VenueProfile = {
  name: 'Estadio Azteca',
  city: 'Mexico City',
  tournament: 'FIFA World Cup 2026',
  capacity: 83264,
  gates: GATES,
  facilities: FACILITIES,
  transit: TRANSIT,
};

function describeGates(): string {
  return VENUE.gates
    .map((gate) => `- ${gate.name}: serves ${gate.serves}${gate.accessible ? ' (step-free)' : ''}`)
    .join('\n');
}

function describeFacilities(): string {
  return VENUE.facilities
    .map(
      (facility) =>
        `- ${facility.name} [${facility.category}] — ${facility.location}. ${facility.details}`,
    )
    .join('\n');
}

function describeTransit(): string {
  return VENUE.transit
    .map((route) => `- ${route.name} (${route.mode}): ${route.guidance}`)
    .join('\n');
}

/**
 * Builds the compact venue description that grounds assistant answers,
 * so the model answers from real venue data instead of inventing it.
 */
export function buildGroundingContext(): string {
  return [
    `Venue: ${VENUE.name}, ${VENUE.city} — ${VENUE.tournament}. Capacity ${String(VENUE.capacity)}.`,
    'GATES:',
    describeGates(),
    'FACILITIES:',
    describeFacilities(),
    'TRANSPORT:',
    describeTransit(),
  ].join('\n');
}
