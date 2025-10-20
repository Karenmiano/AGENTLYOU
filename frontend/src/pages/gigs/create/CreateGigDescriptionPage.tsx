import { useNavigate } from "react-router";

import GigDescriptionForm from "../../../features/gigs/components/GigDescriptionForm";
import StepNavigation from "../../../features/gigs/create/components/StepNavigation";

import { useCreateGig } from "../../../features/gigs/create/hooks/useCreateGig";

function CreateGigDescriptionPage() {
  const navigate = useNavigate();
  const { createGigData, setCreateGigData } = useCreateGig();
  return (
    <GigDescriptionForm
      gigData={createGigData}
      setGigData={setCreateGigData}
      renderFormActions={(isValid: boolean) => (
        <StepNavigation
          handleBack={() => navigate("/gigs/new/title")}
          isValid={isValid}
          nextStepName="Labels"
        />
      )}
      onSubmit={() => navigate("/gigs/new/label")}
    />
  );
}

export default CreateGigDescriptionPage;
