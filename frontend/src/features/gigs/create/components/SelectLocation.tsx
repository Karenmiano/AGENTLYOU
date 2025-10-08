import { useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiOutlineHome } from "react-icons/hi";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { LuSearchX } from "react-icons/lu";

import SegmentedControl from "../../../../ui/SegmentedControl";
import { useAutoCompleteSuggestions } from "../hooks/useAutoCompleteSuggestions";
import type { Dispatch, SetStateAction } from "react";
import type { PhysicalLocation } from "../types";

interface SelectLocationProps {
  locationType: "virtual" | "physical";
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setLocationType: Dispatch<SetStateAction<"virtual" | "physical">>;
  setPhysicalLocation: Dispatch<
    SetStateAction<PhysicalLocation | google.maps.places.Place | null>
  >;
  closeModal?: () => void;
}

function SelectLocation({
  locationType,
  setLocationType,
  setPhysicalLocation,
  closeModal,
  isOpen,
  setIsOpen,
}: SelectLocationProps) {
  const places = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState("");
  const { suggestions, resetSession } = useAutoCompleteSuggestions(inputValue);

  const controlRef = useRef<HTMLDivElement | null>(null);
  const segment1Ref = useRef<HTMLDivElement | null>(null);
  const segment2Ref = useRef<HTMLDivElement | null>(null);

  async function handleSuggestionClick(
    suggestion: google.maps.places.AutocompleteSuggestion
  ) {
    if (!places) return;
    if (!suggestion.placePrediction) return;

    const place = suggestion.placePrediction.toPlace();

    await place.fetchFields({
      fields: [
        "displayName",
        "addressComponents",
        "adrFormatAddress",
        "location",
      ],
    });

    setPhysicalLocation(place);
    setInputValue("");

    console.log(place);

    resetSession();
    closeModal?.();
  }

  return (
    <dialog
      id="select-location"
      className="top-36 left-1/2 -translate-x-1/2 w-120 rounded-lg p-4"
      onClose={() => setIsOpen(false)}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        if (
          rect.left > e.clientX ||
          rect.right < e.clientX ||
          rect.top > e.clientY ||
          rect.bottom < e.clientY
        ) {
          e.currentTarget.close();
        }
      }}
    >
      {isOpen && (
        <SegmentedControl
          name="group-1"
          callback={(val) => {
            setLocationType(val as "physical" | "virtual");
            if (val === "virtual") setPhysicalLocation(null);
          }}
          defaultIndex={locationType === "physical" ? 0 : 1}
          controlRef={controlRef}
          segments={[
            {
              label: "Physical event",
              value: "physical",
              icon: <HiOutlineHome className="size-5" />,
              ref: segment1Ref,
            },
            {
              label: "Virtual event",
              value: "virtual",
              icon: <HiOutlineVideoCamera className="size-5" />,
              ref: segment2Ref,
            },
          ]}
        />
      )}

      {locationType === "physical" ? (
        <div className="mt-7">
          <input
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for a place"
          />

          {suggestions.length > 0 ? (
            <ul className="mt-2 border border-gray-300 rounded-md">
              {suggestions.map((suggestion, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex gap-3 p-3 hover:bg-gray-100 cursor-pointer items-center"
                  >
                    <HiOutlineLocationMarker className="flex-shrink-0" />
                    <div>
                      <p className="text-sm">
                        {suggestion.placePrediction?.mainText?.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {suggestion.placePrediction?.secondaryText?.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : inputValue !== "" ? (
            <div className="flex gap-2 mt-2 bg-gray-100 rounded-md p-2 text-gray-600 items-center">
              <LuSearchX className="flex-shrink-0" />
              <p className="text-sm">No location matches found</p>
            </div>
          ) : (
            <div className="flex gap-2 mt-2 bg-gray-100 rounded-md p-2 text-gray-600">
              <HiOutlineInformationCircle className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Start typing to see suggestions for venues or addresses
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2  bg-gray-100 rounded-md p-2 text-gray-600 mt-7">
          <HiOutlineInformationCircle className="flex-shrink-0 size-5 mt-0.5" />
          <p className="text-sm">
            For virtual events you can share the link with the selected agent
            later
          </p>
        </div>
      )}
    </dialog>
  );
}

export default SelectLocation;
