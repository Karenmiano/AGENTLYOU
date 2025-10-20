import type { Dispatch, SetStateAction } from "react";

import type { GigData } from "../types";

export type CreateGig = {
  createGigData: GigData;
  setCreateGigData: Dispatch<SetStateAction<GigData>>;
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
};
