import { APIProvider } from "@vis.gl/react-google-maps";

import CreateGigLocationAndTimeForm from "../../../features/gigs/create/components/CreateGigLocationAndTimeForm";

function CreateGigLocationAndTimePage() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <CreateGigLocationAndTimeForm />
    </APIProvider>
  );
}

export default CreateGigLocationAndTimePage;
