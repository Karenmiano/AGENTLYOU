import { useNavigate } from "react-router";

import GigCompensationForm from "../../../features/gigs/components/GigCompensationForm";
import StepNavigation from "../../../features/gigs/create/components/StepNavigation";

import { useCreateGig } from "../../../features/gigs/create/hooks/useCreateGig";

function CreateGigCompensationPage() {
  const navigate = useNavigate();
  const { createGigData, setCreateGigData } = useCreateGig();
  return (
    <div>
      <GigCompensationForm
        gigData={createGigData}
        setGigData={setCreateGigData}
        renderFormActions={(isValid: boolean) => (
          <StepNavigation
            handleBack={() => navigate("/gigs/new/location-time")}
            isValid={isValid}
            nextStepName="Review & Publish"
          />
        )}
        onSubmit={() => navigate("/gigs/review")}
      />
    </div>
  );
}

export default CreateGigCompensationPage;
