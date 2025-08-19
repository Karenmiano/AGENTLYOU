import { useState } from "react";
import { Outlet } from "react-router";

import ClientNav from "../../../../ui/ClientNav";
import { useLocalStorageState } from "../../../../hooks/useLocalStorageState";
import type { CreateGigData } from "../types";

function CreateGigLayout() {
  const [createGigData, setCreateGigData] = useLocalStorageState<CreateGigData>(
    {},
    "create-gig-data"
  );
  const [step, setStep] = useState(1);

  return (
    <>
      <ClientNav />
      <progress
        max="6"
        value={step}
        className="w-full h-1 [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:bg-gray-950 [&::-webkit-progress-value]:rounded-full bg-gray-100 [&::-moz-progress-bar]:bg-gray-950 [&::-moz-progress-bar]:rounded-full mb-5"
      ></progress>
      <div className="px-4 max-w-5xl mx-auto mb-22">
        <div className="text-gray-500 font-light mb-5">Step {step} of 6</div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <img
            src="/src/assets/stepper.svg"
            alt="Person climbing staircase"
            width="375"
            className="hidden md:block align-self-center justify-self-center scale-x-[-1]"
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
