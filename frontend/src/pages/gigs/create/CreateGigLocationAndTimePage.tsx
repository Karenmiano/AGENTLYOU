import { useNavigate } from "react-router";

import GigLocationAndTimeForm from "../../../features/gigs/components/GigLocationAndTimeForm";
import StepNavigation from "../../../features/gigs/create/components/StepNavigation";

import { useCreateGig } from "../../../features/gigs/create/hooks/useCreateGig";

function CreateGigLocationAndTimePage() {
  const navigate = useNavigate();
  const { createGigData, setCreateGigData } = useCreateGig();
  return (
    <GigLocationAndTimeForm
      gigData={createGigData}
      setGigData={setCreateGigData}
      renderFormActions={(isValid: boolean) => (
        <StepNavigation
          isValid={isValid}
          nextStepName="Compensation"
          handleBack={() => navigate("/gigs/new/label")}
        />
      )}
      onSubmit={() => navigate("/gigs/new/compensation")}
    />
  );
}

export default CreateGigLocationAndTimePage;
