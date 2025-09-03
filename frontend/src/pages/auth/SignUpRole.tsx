import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";

import ZoomOnHoverCard from "../../ui/ZoomOnHoverCard";

import type { Role } from "../../lib/types";

function SignUpRole() {
  const [signUpRole, setSignUpRole] = useState<Role | null>(
    sessionStorage.getItem("signUpRole") as Role | null
  );
  const navigate = useNavigate();

  function handleContinue() {
    if (signUpRole) {
      sessionStorage.setItem("signUpRole", signUpRole);
      navigate("/signup/form");
    }
  }

  return (
    <div className="max-w-fit mx-auto mt-8 px-4 sm:px-0">
      <h1 className="text-center font-bold text-xl mb-5">
        Create your account
      </h1>

      <div className="mb-4">
        <p className="font-bold">I am a...</p>
        <p className="text-sm text-gray-500">
          Select how you'll be using the platform
        </p>
      </div>

      <label htmlFor="client" className="relative block mb-4">
        <ZoomOnHoverCard
          className={
            signUpRole === "client"
              ? "scale-107 shadow-md border-slate-300"
              : ""
          }
          onClick={() => setSignUpRole("client")}
        >
          <input
            type="radio"
            name="signUpRole"
            id="client"
            className="absolute top-3 right-3 size-4 accent-primary"
            checked={signUpRole === "client"}
            readOnly
          />
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
      </label>

      <label htmlFor="agent" className="relative block mb-4">
        <ZoomOnHoverCard
          className={
            signUpRole === "agent" ? "scale-107 shadow-md border-slate-300" : ""
          }
          onClick={() => setSignUpRole("agent")}
        >
          <input
            type="radio"
            name="signUpRole"
            id="agent"
            className="absolute top-3 right-3 size-4 accent-primary"
            checked={signUpRole === "agent"}
            readOnly
          />
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
      </label>

      <button
        disabled={!signUpRole}
        onClick={handleContinue}
        type="button"
        className="w-full rounded-full hover:bg-primary bg-primary/90 py-3 text-center font-semibold text-white outline-none mb-2 cursor-pointer"
      >
        Continue
      </button>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="text-primary hover:underline font-semibold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default SignUpRole;
