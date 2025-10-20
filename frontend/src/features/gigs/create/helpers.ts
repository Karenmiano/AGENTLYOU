import type { GigData } from "../types";

export function getLastIncompleteGigStep(
  currentStep: number,
  createGigData: GigData
): string | null {
  if (currentStep > 1 && !createGigData.title) {
    return "/gigs/new/title";
  }
  if (currentStep > 2 && !createGigData.description) {
    return "/gigs/new/description";
  }
  if (currentStep > 3 && !createGigData.labels?.length) {
    return "/gigs/new/label";
  }
  if (
    currentStep > 4 &&
    !createGigData.location &&
    !createGigData.startDateTime &&
    !createGigData.endDateTime
  ) {
    return "/gigs/new/location-time";
  }

  return null;
}
