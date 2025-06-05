import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router";
import { HiOutlineBriefcase } from "react-icons/hi";
import { HiOutlineUser } from "react-icons/hi";
import Button from "../../ui/Button";
import ZoomOnHoverCard from "../../ui/ZoomOnHoverCard";

import type { Role } from "../../App.types";

interface ChooseRoleProps {
  signUpRole: Role | null;
  setSignUpRole: Dispatch<SetStateAction<Role | null>>;
  handleContinue: () => void;
}

function ChooseRole({
  signUpRole,
  setSignUpRole,
  handleContinue,
}: ChooseRoleProps) {
  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <h1 className="text-center font-bold text-xl">Create your account</h1>
      <p className="font-bold mb-1">I am a...</p>
      <p className="text-sm text-gray-500">
        Select how you'll be using the platform
      </p>

      <ZoomOnHoverCard
        className={
          signUpRole === "client"
            ? "shadow-md scale-107 pointer-events-none border-slate-300"
            : ""
        }
        onClick={() => setSignUpRole("client")}
      >
        <div className="flex items-center rounded-full bg-[rgb(114,250,147,0.2)] p-2">
          <HiOutlineUser className="text-2xl text-[rgb(114,250,147)]" />
        </div>
        <div>
          <p className="font-bold">Client</p>
          <p className="text-sm text-gray-500">
            I'm looking for agents to represent me
          </p>
        </div>
      </ZoomOnHoverCard>

      <ZoomOnHoverCard
        className={signUpRole === "agent" ? "scale-107" : ""}
        onClick={() => setSignUpRole("agent")}
      >
        <div className="flex items-center rounded-full bg-[rgb(246,196,69,0.2)] p-2">
          <HiOutlineBriefcase className="text-2xl text-[rgb(246,196,69)]" />
        </div>
        <div>
          <p className="font-bold">Agent</p>
          <p className="text-sm text-gray-500">
            I'm offering my services as a representative
          </p>
        </div>
      </ZoomOnHoverCard>
      <Button disabled={!signUpRole} onClick={handleContinue}>
        Continue
      </Button>
      <p className="text-center text-sm font-normal">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default ChooseRole;
