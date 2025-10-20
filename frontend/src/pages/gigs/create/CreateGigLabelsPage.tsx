import { useNavigate } from "react-router";

import GigLabelsForm from "../../../features/gigs/components/GigLabelsForm";
import StepNavigation from "../../../features/gigs/create/components/StepNavigation";

import { useCreateGig } from "../../../features/gigs/create/hooks/useCreateGig";
function CreateGigLabelsPage() {
  const navigate = useNavigate();
  const { createGigData, setCreateGigData } = useCreateGig();
  return (
    <GigLabelsForm
      gigData={createGigData}
      setGigData={setCreateGigData}
      renderFormActions={(isValid: boolean) => (
        <StepNavigation
          handleBack={() => navigate("/gigs/new/description")}
          isValid={isValid}
          nextStepName="Location & Time"
        />
      )}
      onSubmit={() => navigate("/gigs/new/location-time")}
    />
  );
}

export default CreateGigLabelsPage;
