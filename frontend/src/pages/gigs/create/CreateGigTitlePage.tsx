import { useNavigate } from "react-router";

import GigTitleForm from "../../../features/gigs/components/GigTitleForm";
import StepNavigation from "../../../features/gigs/create/components/StepNavigation";

import { useCreateGig } from "../../../features/gigs/create/hooks/useCreateGig";

function CreateGigTitlePage() {
  const navigate = useNavigate();
  const { createGigData, setCreateGigData } = useCreateGig();

  return (
    <GigTitleForm
      gigData={createGigData}
      setGigData={setCreateGigData}
      renderFormActions={(isValid: boolean) => (
        <StepNavigation isValid={isValid} nextStepName="Description" />
      )}
      onSubmit={() => navigate("/gigs/new/description")}
    />
  );
}

export default CreateGigTitlePage;
