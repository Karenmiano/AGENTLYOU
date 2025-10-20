/*
  This page will be used to review gig details. Will be used in the following cases:
  1. For editing an existing gig - if 'id' query param is present, fetch gig data from backend
  2. After the last step of creating a new gig for review  and publishing/ keeping as draft i.e no 'id'
      query param, fetch gig data from local storage
  3. if no 'id' and no local storage data, redirect to gig creation start page
*/
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import GigLocationAndTimeForm from "../../../features/gigs/components/GigLocationAndTimeForm";
import GigTitleForm from "../../../features/gigs/components/GigTitleForm";
import EditableField from "../../../ui/EditableField";

import { api } from "../../../api";
import { gigSchema } from "../../../features/gigs/schema";
import type { GigData } from "../../../features/gigs/types";

const stepRouteMap = {
  title: "title",
  description: "description",
  labels: "label",
  location: "location-time",
  startDateTime: "location-time",
  endDateTime: "location-time",
  timeZone: "location-time",
  compensation: "compensation",
};

function GigReviewPage() {
  const [gigData, setGigData] = useState<GigData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const gigId = searchParams.get("id");

  useEffect(function () {
    async function fetchGig(id: string) {
      const response = await api.get(`/gigs/${id}/review/`);
      const responseData = await response.data;
      setGigData(responseData);
      setIsLoading(false);
    }

    setIsLoading(true);
    if (gigId) {
      fetchGig(gigId);
    } else {
      // load in progress gig data from local storage
      const storedGig = localStorage.getItem("create-gig-data");

      if (storedGig) {
        const parsedGig = JSON.parse(storedGig);
        const validatedGig = gigSchema.safeParse(parsedGig);
        if (!validatedGig.success) {
          for (const issue of validatedGig.error.issues) {
            const field = issue.path[0];
            if (field in stepRouteMap) {
              // navigate to the step with the first validation error
              navigate(
                `/gigs/new/${stepRouteMap[field as keyof typeof stepRouteMap]}`
              );
              return;
            }
          }
        } else {
          setGigData(validatedGig.data);
          setIsLoading(false);
        }
      } else {
        navigate("gigs/new");
      }
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <EditableField
        onEdit={() => {
          const titleModal = document.getElementById(
            "title"
          ) as HTMLDialogElement;
          titleModal.showModal();
        }}
      >
        <p>Title</p>
        <p>{gigData.title}</p>
      </EditableField>
      <dialog
        id="title"
        className="top-36 left-1/2 -translate-x-1/2 w-120 rounded-lg p-4"
      >
        <GigTitleForm
          gigData={gigData}
          setGigData={setGigData}
          renderFormActions={(isValid: boolean) => (
            <button
              type="submit"
              className="rounded-full bg-primary/90 py-3 px-5 text-white  cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              disabled={!isValid}
            >
              Save
            </button>
          )}
        />
      </dialog>

      <dialog
        id="location-time"
        className="top-36 left-1/2 -translate-x-1/2 w-120 rounded-lg p-4"
      >
        <GigLocationAndTimeForm
          gigData={gigData}
          setGigData={setGigData}
          renderFormActions={(isValid: boolean) => (
            <button
              type="submit"
              className="rounded-full bg-primary/90 py-3 px-5 text-white  cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              disabled={!isValid}
            >
              Save
            </button>
          )}
        />
      </dialog>
    </div>
  );
}

export default GigReviewPage;
