import type { CreateGigData } from "./types";

export function getLastIncompleteGigStep(
  currentStep: number,
  createGigData: CreateGigData
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
  if (currentStep > 4 && !createGigData.location) {
    return "/gigs/new/location-time";
  }

  return null;
}
