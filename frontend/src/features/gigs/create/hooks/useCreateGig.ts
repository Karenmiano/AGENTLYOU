import { useOutletContext } from "react-router";

import type { CreateGig } from "../types";

export function useCreateGig() {
  return useOutletContext<CreateGig>();
}
