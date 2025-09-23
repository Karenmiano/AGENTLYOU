import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import ClientNav from "../../../../ui/ClientNav";
import { useLocalStorageState } from "../../../../hooks/useLocalStorageState";
import { getLastIncompleteGigStep } from "../helpers";
import type { CreateGigData } from "../types";

function CreateGigLayout() {
  const [createGigData, setCreateGigData] = useLocalStorageState<CreateGigData>(
    {},
    "create-gig-data"
  );
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(
    function () {
      const path = location.pathname;
      switch (path) {
        case "/gigs/new/title":
          setStep(1);
          break;
        case "/gigs/new/description":
          setStep(2);
          break;
        case "/gigs/new/label":
          setStep(3);
          break;
        case "/gigs/new/location&time":
          setStep(4);
          break;
      }
    },
    [location.pathname]
  );

  useEffect(
    function () {
      if (step === 1) return;
      const lastIncompleteStep = getLastIncompleteGigStep(step, createGigData);
      if (lastIncompleteStep) {
        navigate(lastIncompleteStep);
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step]
  );

  return (
    <>
      <ClientNav />
      <progress max="6" value={step} className="progress-bar"></progress>
      <div className="px-4 max-w-5xl mx-auto mb-22">
        <div className="text-gray-500 font-light mb-5">Step {step} of 5</div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <img
            src="/src/assets/stepper.svg"
            alt="Person climbing staircase"
            width="375"
            className="hidden lg:block align-self-center justify-self-center scale-x-[-1]"
          />
          <Outlet
            context={{ createGigData, setCreateGigData, setStep, step }}
          />
        </div>
      </div>
    </>
  );
}

export default CreateGigLayout;
