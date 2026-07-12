// Stadium feature logic: facility lookup for the client's quick actions.
import type { Facility, FacilityCategory } from '../../lib/venue/types.js';
import { VENUE } from '../../lib/venue/venue-data.js';

/**
 * Returns venue facilities, optionally filtered by category.
 *
 * @param category - When provided, only facilities of this category.
 */
export function getFacilities(category?: FacilityCategory): Facility[] {
  if (category === undefined) {
    return VENUE.facilities;
  }
  return VENUE.facilities.filter((facility) => facility.category === category);
}
