/*
- Original location step implementation before switching to google places API
- This form can still be used for manual location entry if needed in the future with a
couple of adjustments to match the schema

import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";

import StepNavigation from "./StepNavigation";
import FormLabel from "../../../../ui/FormLabel";
import InputError from "../../../../ui/InputError";
import CountryStateCitySelector from "../../../../ui/CountryStateCitySelector";

import { useCreateGig } from "../hooks/useCreateGig";
import { createGigSchema } from "../schema";
import type { CSSObjectWithLabel } from "react-select";

const createGigLocationSchema = createGigSchema.pick({
  location: true,
});

type TCreateGigLocationSchema = z.infer<typeof createGigLocationSchema>;

const selectorStyles = {
  control: (
    baseStyles: CSSObjectWithLabel,
    { menuIsOpen, isFocused }: { menuIsOpen: boolean; isFocused: boolean }
  ) => ({
    ...baseStyles,
    border: menuIsOpen || isFocused ? "none" : baseStyles.border,
    boxShadow: menuIsOpen || isFocused ? "0 0 0 2px black" : "none",
  }),
  option: (
    baseStyles: CSSObjectWithLabel,
    { isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }
  ) => ({
    ...baseStyles,
    backgroundColor: isSelected
      ? "hsl(248 68% 51%)"
      : isFocused
      ? "hsl(220 14% 93%)"
      : baseStyles.backgroundColor,
    "&:active": {
      backgroundColor: isSelected ? "hsl(248 68% 51%)" : "hsl(220 14% 93%)",
    },
  }),
  singleValue: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    color: "black",
    fontSize: "0.875rem",
  }),
};

function CreateGigLocationForm() {
  const navigate = useNavigate();
  const { createGigData, setCreateGigData } = useCreateGig();

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, errors },
    watch,
    resetField,
  } = useForm<TCreateGigLocationSchema>({
    resolver: zodResolver(createGigLocationSchema),
    mode: "onChange",
    shouldUnregister: true,
  });

  const inPersonErrors: FieldErrors<{
    location: {
      locationType: "physical" | "hybrid";
      venue: string;
      location: {
        country: string;
        stateRegion: string;
        city: string;
      };
    };
  }> = errors;

  const locationType = watch("location.locationType");

  function getCountryStateCityDefaults() {
    if (
      createGigData.location?.locationType === "physical" ||
      createGigData.location?.locationType === "hybrid"
    ) {
      return {
        country: createGigData.location.location.country,
        state: createGigData.location.location.stateRegion,
        city: createGigData.location.location.city,
      };
    }
    return { country: "", state: "", city: "" };
  }

  function getVenueDefault() {
    if (
      createGigData.location?.locationType === "physical" ||
      createGigData.location?.locationType === "hybrid"
    ) {
      return createGigData.location.venue;
    }
    return "";
  }

  function onSubmit(data: TCreateGigLocationSchema) {
    setCreateGigData((createGigData) => ({
      ...createGigData,
      location: data.location,
    }));
    navigate("/gigs/new/time");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="mb-12">
        <legend className="mb-7 text-2xl md:font-medium">
          How will the agent be attending?
        </legend>
        <div className="flex gap-5">
          <div className="flex items-center">
            <input
              id="virtual"
              type="radio"
              {...register("location.locationType")}
              value="virtual"
              className="accent-primary size-4"
              defaultChecked={
                createGigData.location?.locationType === "virtual"
              }
            />
            <label htmlFor="virtual" className="pl-2 text-sm sm:text-base">
              Virtually
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="physical"
              type="radio"
              {...register("location.locationType")}
              value="physical"
              className="accent-primary size-4"
              defaultChecked={
                createGigData.location?.locationType === "physical"
              }
            />
            <label htmlFor="physical" className="pl-2 text-sm sm:text-base">
              Physically
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="hybrid"
              type="radio"
              {...register("location.locationType")}
              value="hybrid"
              className="accent-primary size-4"
              defaultChecked={createGigData.location?.locationType === "hybrid"}
            />
            <label htmlFor="hybrid" className="pl-2 text-sm sm:text-base">
              Hybrid
            </label>
          </div>
        </div>
      </fieldset>

      {(locationType === "physical" || locationType === "hybrid") && (
        <fieldset>
          <legend className="mb-3 font-medium">
            Please provide the location details:
          </legend>
          <div className="mb-5">
            <FormLabel htmlFor="venue">Venue</FormLabel>
            <input
              id="venue"
              {...register("location.venue")}
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
              defaultValue={getVenueDefault()}
            />

            {inPersonErrors.location?.venue && (
              <InputError>{inPersonErrors.location.venue.message}</InputError>
            )}
          </div>
          <CountryStateCitySelector<TCreateGigLocationSchema>
            control={control}
            fieldNames={{
              country: "location.location.country",
              state: "location.location.stateRegion",
              city: "location.location.city",
            }}
            fieldDefaultValues={getCountryStateCityDefaults()}
            resetField={resetField}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel htmlFor="country">Country</FormLabel>
                <CountryStateCitySelector.CountrySelector
                  styles={selectorStyles}
                />
                {inPersonErrors.location?.location?.country && (
                  <InputError>
                    {inPersonErrors.location.location.country.message}
                  </InputError>
                )}
              </div>
              <div>
                <FormLabel htmlFor="stateRegion">State/ Region</FormLabel>
                <CountryStateCitySelector.StateSelector
                  styles={selectorStyles}
                />
                {inPersonErrors.location?.location?.stateRegion && (
                  <InputError>
                    {inPersonErrors.location.location.stateRegion.message}
                  </InputError>
                )}
              </div>
              <div>
                <FormLabel htmlFor="city">City</FormLabel>
                <CountryStateCitySelector.CitySelector
                  styles={selectorStyles}
                />
                {inPersonErrors.location?.location?.city && (
                  <InputError>
                    {inPersonErrors.location.location.city.message}
                  </InputError>
                )}
              </div>
            </div>
          </CountryStateCitySelector>
        </fieldset>
      )}

      <StepNavigation
        isValid={isValid}
        nextStepName="Time"
        handleBack={() => navigate("/gigs/new/label")}
      />
    </form>
  );
}

export default CreateGigLocationForm;
*/
