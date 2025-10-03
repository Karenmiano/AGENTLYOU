import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export type UseAutoCompleteSuggestionsReturn = {
  suggestions: google.maps.places.AutocompleteSuggestion[];
  isLoading: boolean;
  resetSession: () => void;
};

export function useAutoCompleteSuggestions(
  inputString: string,
  requestOptions: Partial<google.maps.places.AutocompleteRequest> = {}
): UseAutoCompleteSuggestionsReturn {
  const placesLib = useMapsLibrary("places");

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken>(null);

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      if (!placesLib) return;

      const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;

      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new AutocompleteSessionToken();
      }

      const request: google.maps.places.AutocompleteRequest = {
        ...requestOptions,
        input: inputString,
        sessionToken: sessionTokenRef.current,
      };

      if (inputString === "") {
        if (suggestions.length > 0) setSuggestions([]);
        return;
      }

      setIsLoading(true);

      AutocompleteSuggestion.fetchAutocompleteSuggestions(request).then(
        (res) => {
          console.log("Fetched suggestions for:", inputString);

          setSuggestions(res.suggestions);
          setIsLoading(false);
        }
      );
    },
    [placesLib, inputString]
  );

  return {
    suggestions,
    isLoading,
    resetSession: () => {
      sessionTokenRef.current = null;
      setSuggestions([]);
    },
  };
}
