import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { HiOutlineLocationMarker } from "react-icons/hi";

import SelectLocation from "./SelectLocation";
import StepNavigation from "./StepNavigation";
import Modal from "../../../../ui/Modal";
import { useState } from "react";

function CreateGigLocationAndTimeForm() {
  const navigate = useNavigate();

  const [locationType, setLocationType] = useState<"virtual" | "physical">(
    "physical"
  );
  const [physicalLocation, setPhysicalLocation] =
    useState<google.maps.places.Place | null>(null);

  return (
    <form>
      <h1 className="text-2xl mb-5 md:font-medium">
        When and where should the agent show up?
      </h1>

      <Modal>
        <Modal.Open opens="select-location">
          <div className="flex bg-gray-100 p-4 rounded-xl gap-2 text-gray-900 hover:bg-gray-200">
            <HiOutlineLocationMarker className="size-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">
                {physicalLocation
                  ? physicalLocation.displayName
                  : locationType === "virtual"
                  ? "Virtual event"
                  : "Add Event Location"}
              </p>
              <p className="text-sm">
                {physicalLocation ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        physicalLocation.adrFormatAddress ?? ""
                      ),
                    }}
                  />
                ) : locationType === "virtual" ? (
                  ""
                ) : (
                  "Physical or online location"
                )}
              </p>
            </div>
          </div>
        </Modal.Open>
        <Modal.Window name="select-location">
          <SelectLocation
            locationType={locationType}
            setLocationType={setLocationType}
            setPhysicalLocation={setPhysicalLocation}
          />
        </Modal.Window>
      </Modal>

      <StepNavigation
        isValid={true}
        nextStepName="Compensation"
        handleBack={() => navigate("/gigs/new/label")}
      />
    </form>
  );
}

export default CreateGigLocationAndTimeForm;
