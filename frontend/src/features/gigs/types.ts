import type { Dispatch, SetStateAction, ReactNode } from "react";
import type { TGigSchema } from "./schema";

export type GigData = Partial<TGigSchema>;

export interface GigFieldFormProps {
  gigData: GigData;
  setGigData: Dispatch<SetStateAction<GigData>>;
  renderFormActions: (isValid: boolean) => ReactNode;
  onSubmit?: () => void;
}

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
