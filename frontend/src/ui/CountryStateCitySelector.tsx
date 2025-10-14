import { useState, createContext, useContext, useEffect } from "react";
import { useController } from "react-hook-form";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

import type { PropsWithChildren } from "react";
import type {
  Control,
  Path,
  FieldValues,
  FieldPath,
  FieldPathValue,
  UseFormResetField,
} from "react-hook-form";
import type { ICountry, IState, ICity } from "country-state-city";
import type { StylesConfig } from "react-select";

interface CountryStateCitySelectorProps<T extends FieldValues> {
  control: Control<T>;
  fieldNames: {
    country: Path<T>;
    state: Path<T>;
    city: Path<T>;
  };
  fieldDefaultValues:
    | {
        country: FieldPathValue<T, FieldPath<T>>;
        state: FieldPathValue<T, FieldPath<T>>;
        city: FieldPathValue<T, FieldPath<T>>;
      }
    | undefined;
  resetField: UseFormResetField<T>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CountryStateCityContextType {
  countries: ICountry[];
  states: IState[];
  cities: ICity[];
  selectedState: IState | null;
  selectedCountry: ICountry | null;
  selectedCity: ICity | null;
  countryField: any;
  stateField: any;
  cityField: any;
  setSelectedCity: React.Dispatch<React.SetStateAction<ICity | null>>;
  handleCountryChange: (country: ICountry | null) => void;
  handleStateChange: (state: IState | null) => void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
const CountryStateCityContext =
  createContext<CountryStateCityContextType | null>(null);

function useCountryStateCity() {
  const context = useContext(CountryStateCityContext);

  if (context === null)
    throw new Error(
      "useCountryStateCity has to be used within <CountryStateCityContext.Provider>"
    );

  return context;
}

function CountryStateCitySelector<T extends FieldValues>({
  control,
  fieldNames,
  fieldDefaultValues,
  resetField,
  children,
}: PropsWithChildren<CountryStateCitySelectorProps<T>>) {
  const [countries] = useState<ICountry[]>(Country.getAllCountries);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  const { field: countryField } = useController({
    name: fieldNames.country,
    control,
  });

  const { field: stateField } = useController({
    name: fieldNames.state,
    control,
  });

  const { field: cityField } = useController({
    name: fieldNames.city,
    control,
  });

  useEffect(
    function () {
      if (fieldDefaultValues) {
        const country = countries.find(
          (c) => c.name === fieldDefaultValues.country
        );
        if (country) {
          countryField.onChange(country.name);
          setSelectedCountry(country);
          const countryStates = State.getStatesOfCountry(country.isoCode);
          setStates(countryStates);

          const state = countryStates.find(
            (s) => s.name === fieldDefaultValues.state
          );
          if (state) {
            stateField.onChange(state.name);
            setSelectedState(state);
            const stateCities = City.getCitiesOfState(
              country.isoCode,
              state.isoCode
            );
            setCities(stateCities);

            const city = stateCities.find(
              (c) => c.name === fieldDefaultValues.city
            );
            if (city) {
              cityField.onChange(city.name);
              setSelectedCity(city);
            }
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function handleCountryChange(country: ICountry | null) {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);

    resetField(fieldNames.state, {
      defaultValue: "" as FieldPathValue<T, FieldPath<T>>,
    });
    resetField(fieldNames.city, {
      defaultValue: "" as FieldPathValue<T, FieldPath<T>>,
    });

    if (country) {
      setStates(State.getStatesOfCountry(country.isoCode));
    } else {
      setStates([]);
    }

    setCities([]);
  }

  function handleStateChange(state: IState | null) {
    setSelectedState(state);
    setSelectedCity(null);

    resetField(fieldNames.city, {
      defaultValue: "" as FieldPathValue<T, FieldPath<T>>,
    });

    if (state) {
      setCities(City.getCitiesOfState(selectedCountry!.isoCode, state.isoCode));
    } else {
      setCities([]);
    }
  }

  return (
    <CountryStateCityContext.Provider
      value={{
        countries,
        states,
        cities,
        selectedState,
        selectedCountry,
        selectedCity,
        countryField,
        stateField,
        cityField,
        setSelectedCity,
        handleCountryChange,
        handleStateChange,
      }}
    >
      {children}
    </CountryStateCityContext.Provider>
  );
}

function CountrySelector({
  styles,
}: {
  styles?: StylesConfig<ICountry, false>;
}) {
  const { countries, selectedCountry, countryField, handleCountryChange } =
    useCountryStateCity();

  return (
    <Select
      isClearable={true}
      options={countries}
      getOptionLabel={(country) => country.name}
      getOptionValue={(country) => country.name}
      value={selectedCountry}
      onChange={(country) => {
        handleCountryChange(country);
        countryField.onChange(country ? country.name : "");
      }}
      components={{
        IndicatorSeparator: () => null,
        ClearIndicator: () => null,
      }}
      styles={styles}
    />
  );
}

function StateSelector({ styles }: { styles?: StylesConfig<IState, false> }) {
  const {
    states,
    stateField,
    selectedState,
    selectedCountry,
    handleStateChange,
  } = useCountryStateCity();

  return (
    <Select
      isClearable={true}
      options={states}
      getOptionLabel={(state) => state.name}
      getOptionValue={(state) => state.name}
      onChange={(state) => {
        handleStateChange(state);
        stateField.onChange(state ? state.name : "");
      }}
      value={selectedState}
      isDisabled={!selectedCountry}
      components={{
        IndicatorSeparator: () => null,
        ClearIndicator: () => null,
      }}
      styles={styles}
    />
  );
}

function CitySelector({ styles }: { styles?: StylesConfig<ICity, false> }) {
  const { cities, cityField, selectedCity, selectedState, setSelectedCity } =
    useCountryStateCity();

  return (
    <Select
      isClearable={true}
      options={cities}
      getOptionLabel={(city) => city.name}
      getOptionValue={(city) => city.name}
      onChange={(city) => {
        setSelectedCity(city);
        cityField.onChange(city ? city.name : "");
      }}
      value={selectedCity}
      isDisabled={!selectedState}
      components={{
        IndicatorSeparator: () => null,
        ClearIndicator: () => null,
      }}
      styles={styles}
    />
  );
}

CountryStateCitySelector.CountrySelector = CountrySelector;
CountryStateCitySelector.StateSelector = StateSelector;
CountryStateCitySelector.CitySelector = CitySelector;

export default CountryStateCitySelector;
