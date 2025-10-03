import type { Dispatch, SetStateAction } from "react";

import type { TCreateGigSchema } from "./schema";

export type CreateGigData = Partial<TCreateGigSchema>;

export type CreateGig = {
  createGigData: CreateGigData;
  setCreateGigData: Dispatch<SetStateAction<CreateGigData>>;
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
};

export interface PhysicalLocation {
  id: string;
  displayName: string;
  adrFormatAddress: string;
  geolocation: {
    country: string;
    stateRegion: string;
    city: string;
  };
}
