import { useState } from "react";
import { useNavigate } from "react-router";

import StepNavigation from "./StepNavigation";
import FormLabel from "../../../../ui/FormLabel";

type LocationType = "virtual" | "hybrid" | "physical";

function CreateGigLocationForm() {
  const [locationType, setLocationType] = useState<LocationType | null>(null);
  const navigate = useNavigate();

  return (
    <form>
      <fieldset className="mb-7">
        <legend className="mb-7 text-2xl md:font-medium">
          How will the agent be attending?
        </legend>
        <div className="flex gap-5">
          <div className="flex items-center">
            <input
              type="radio"
              id="virtual"
              name="locationType"
              value="virtual"
              className="accent-primary size-4 "
              onChange={() => setLocationType("virtual")}
            />
            <label htmlFor="virtual" className="pl-2 text-sm sm:text-base">
              Virtually
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="physical"
              name="locationType"
              value="physical"
              className="accent-primary size-4"
              onChange={() => setLocationType("physical")}
            />
            <label htmlFor="physical" className="pl-2 text-sm sm:text-base">
              Physically
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="hybrid"
              name="locationType"
              value="hybrid"
              className="accent-primary size-4"
              onChange={() => setLocationType("hybrid")}
            />
            <label htmlFor="hybrid" className="pl-2 text-sm sm:text-base">
              Hybrid
            </label>
          </div>
        </div>
      </fieldset>

      {locationType === "physical" || locationType === "hybrid" ? (
        <fieldset>
          <legend className="mb-3 font-medium">
            Please provide the location details:
          </legend>
          <div className="mb-5">
            <FormLabel htmlFor="venue">Venue</FormLabel>
            <input
              id="venue"
              name="venue"
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormLabel htmlFor="country">Country</FormLabel>
              <input
                id="country"
                name="country"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
              />
            </div>
            <div>
              <FormLabel htmlFor="stateRegion">
                State/ Region<span className="text-gray-500">(optional)</span>
              </FormLabel>
              <input
                id="stateRegion"
                name="stateRegion"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
              />
            </div>
            <div>
              <FormLabel htmlFor="city">City</FormLabel>
              <input
                id="city"
                name="city"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
              />
            </div>
          </div>
        </fieldset>
      ) : (
        ""
      )}
      <StepNavigation
        isValid={false}
        nextStepName="Time"
        handleBack={() => navigate("/gigs/new/label")}
      />
    </form>
  );
}

export default CreateGigLocationForm;
