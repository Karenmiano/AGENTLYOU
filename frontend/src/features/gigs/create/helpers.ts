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

  return null;
}
