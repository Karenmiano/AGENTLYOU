import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { HiOutlineLocationMarker } from "react-icons/hi";

import StepNavigation from "./StepNavigation";
import Modal from "../../../../ui/Modal";
import { useAutoCompleteSuggestions } from "../hooks/useAutoCompleteSuggestions";

import type { FormEvent } from "react";

function CreateGigLocationAndTimeForm() {
  const navigate = useNavigate();

  const places = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState("");
  const { suggestions, resetSession } = useAutoCompleteSuggestions(inputValue);

  const handleInputChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    setInputValue((e.target as HTMLInputElement).value);
  }, []);

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) return;
      if (!suggestion.placePrediction) return;

      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({
        fields: ["addressComponents", "adrFormatAddress", "location"],
      });

      console.log(place);

      setInputValue("");

      resetSession();
    },
    [places]
  );

  return (
    <form>
      <h1 className="text-2xl mb-5 md:font-medium">
        When and where should the agent show up?
      </h1>

      <Modal>
        <Modal.Open opens="select-location">
          <div className="flex bg-gray-100 p-4 rounded-xl gap-2 text-gray-900 hover:bg-gray-200">
            <HiOutlineLocationMarker className="size-5 mt-1" />
            <div>
              <p className="font-medium">Add Event Location</p>
              <p className="text-sm">Physical or online location</p>
            </div>
          </div>
        </Modal.Open>
        <Modal.Window name="select-location">
          <p>Event type will be here</p>
        </Modal.Window>
      </Modal>

      <div className="hidden">
        <input
          className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          placeholder="Search for a place"
        />

        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion, index) => {
              return (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.placePrediction?.text.text}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <StepNavigation
        isValid={true}
        nextStepName="Compensation"
        handleBack={() => navigate("/gigs/new/label")}
      />
    </form>
  );
}

export default CreateGigLocationAndTimeForm;
