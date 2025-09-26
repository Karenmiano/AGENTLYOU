import DOMPurify from "dompurify";
import { add, roundToNearestMinutes } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiOutlineGlobeAlt } from "react-icons/hi";

import SelectLocation from "./SelectLocation";
import StepNavigation from "./StepNavigation";
import Modal from "../../../../ui/Modal";

import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/datepicker.css";

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

const CustomDateInput = ({ value, onClick, ref }: CustomInputProps) => {
  return (
    <div
      role="button"
      className="bg-gray-200 p-2 mr-0.5 rounded-l-xl hover:bg-gray-300 transition-colors"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </div>
  );
};

const CustomTimeInput = ({ value, onClick, ref }: CustomInputProps) => {
  return (
    <div
      className="bg-gray-200 p-2 rounded-r-xl hover:bg-gray-300 transition-colors"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </div>
  );
};

function CreateGigLocationAndTimeForm() {
  const navigate = useNavigate();

  const [startDateTime, setStartDateTime] = useState(() => {
    // set default start date to 2 days from now at 9:00 AM
    const date = new Date();
    date.setDate(date.getDate() + 2);
    date.setHours(9, 0, 0, 0);
    return date;
  });
  const [endDateTime, setEndDateTime] = useState(() => {
    // set default end date to 2 days from now at 4:00 PM
    const date = new Date();
    date.setDate(date.getDate() + 2);
    date.setHours(16, 0, 0, 0);
    return date;
  });

  const [locationType, setLocationType] = useState<"virtual" | "physical">(
    "physical"
  );
  const [physicalLocation, setPhysicalLocation] =
    useState<google.maps.places.Place | null>(null);

  function handleStartDateTimeChange(date: Date | null) {
    if (!date) return;

    const minStartDateTime = roundToNearestMinutes(
      add(new Date(), { minutes: 30 }),
      {
        nearestTo: 15,
      }
    ); // at least 30 minutes from now, rounded to nearest 15 min to keep interval
    if (date < minStartDateTime) {
      date = minStartDateTime;
    }

    setStartDateTime(date);

    const minEndDateTime = add(date, { minutes: 15 }); // 15 minute interval allowed
    if (endDateTime < minEndDateTime) {
      setEndDateTime(add(date, { minutes: 30 })); // manually setting to 30 minutes after start time
    }
  }

  function handleEndDateTimeChange(date: Date | null) {
    if (!date) return;

    const minEndDateTime = add(startDateTime, { minutes: 15 }); // 15 minute interval allowed
    if (date < minEndDateTime) {
      date = add(startDateTime, { minutes: 30 }); // manually setting to 30 minutes after start time
    }

    setEndDateTime(date);
  }

  return (
    <form>
      <h1 className="text-2xl mb-5 md:font-medium">
        When and where should the agent show up?
      </h1>

      <div className="text-gray-900 mb-5 grid md:grid-cols-[5fr_1fr] gap-3">
        <div className="relative bg-gray-100 p-4 rounded-xl">
          <div className="timeline">
            <div className="grid grid-cols-[auto_120px_100px] items-center">
              <div className="flex items-center gap-3">
                <div className="bg-gray-400 rounded-full size-2.5"></div>
                <div className="text-sm sm:text-base">Start</div>
              </div>
              {/* Start Date Picker */}
              <DatePicker
                selected={startDateTime}
                onChange={handleStartDateTimeChange}
                customInput={<CustomDateInput />}
                dateFormat="MMM d, yyyy"
                enableTabLoop={false}
                minDate={new Date()} // pick from today onwards
                disabledKeyboardNavigation
              />

              {/* Start Time Picker */}
              <DatePicker
                selected={startDateTime}
                onChange={handleStartDateTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                customInput={<CustomTimeInput />}
                filterTime={(time) => {
                  const minStartDateTime = add(new Date(), { minutes: 30 });
                  const selectedDateTime = new Date(time);

                  return (
                    selectedDateTime.getTime() > minStartDateTime.getTime()
                  );
                }}
                showTimeCaption={false}
                enableTabLoop={false}
              />
            </div>

            <div className="grid grid-cols-[auto_120px_100px] mt-1 items-center">
              <div className="flex items-center gap-3">
                <div className="border border-gray-400 rounded-full size-2.5"></div>
                <div className="text-sm sm:text-base">End</div>
              </div>
              {/* End Date Picker */}
              <DatePicker
                selected={endDateTime}
                onChange={handleEndDateTimeChange}
                customInput={<CustomDateInput />}
                enableTabLoop={false}
                dateFormat="MMM d, yyyy"
                minDate={startDateTime}
                disabledKeyboardNavigation
              />

              {/* End Time Picker */}
              <DatePicker
                selected={endDateTime}
                onChange={handleEndDateTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                customInput={<CustomTimeInput />}
                filterTime={(time) => {
                  const selectedDate = new Date(time);

                  return selectedDate.getTime() > startDateTime.getTime();
                }}
                showTimeCaption={false}
                enableTabLoop={false}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl flex gap-1 md:flex-col md:justify-center hover:bg-gray-200 transition-colors cursor-pointer">
          <HiOutlineGlobeAlt className="mt-0.5" />
          <div className="text-sm">GMT+03:00</div>
          <div className="text-sm text-gray-600">Nairobi</div>
        </div>
      </div>

      <Modal>
        <Modal.Open opens="select-location">
          <div className="flex bg-gray-100 p-4 rounded-xl gap-2 text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer">
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

      {physicalLocation && (
        <iframe
          className="w-full border-none rounded-lg mt-4 h-48"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          }
    &q=place_id:${physicalLocation.id}`}
        ></iframe>
      )}

      <StepNavigation
        isValid={true}
        nextStepName="Compensation"
        handleBack={() => navigate("/gigs/new/label")}
      />
    </form>
  );
}

export default CreateGigLocationAndTimeForm;
