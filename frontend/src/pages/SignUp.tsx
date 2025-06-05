import { useState } from "react";

import ChooseRole from "../features/authentication/ChooseRole";

import type { Role } from "../App.types";

type Step = "choose-role" | "form";

function SignUp() {
  const [signUpRole, setSignUpRole] = useState<Role | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("choose-role");

  function handleContinue() {
    if (signUpRole) {
      setCurrentStep("form");
    }
  }

  return currentStep === "choose-role" ? (
    <ChooseRole
      signUpRole={signUpRole}
      setSignUpRole={setSignUpRole}
      handleContinue={handleContinue}
    />
  ) : (
    <p>The sign up form</p>
  );
}

export default SignUp;
