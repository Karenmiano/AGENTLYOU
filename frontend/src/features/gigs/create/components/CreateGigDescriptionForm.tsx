import { z } from "zod/v4";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { TbBulb } from "react-icons/tb";
import { TbExternalLink } from "react-icons/tb";

import StepNavigation from "./StepNavigation";
import InputError from "../../../../ui/InputError";

import { useCreateGig } from "../hooks/useCreateGig";
import { getLastIncompleteGigStep } from "../helpers";
import { createGigSchema } from "../schema";

const createGigDescriptionSchema = createGigSchema.pick({
  description: true,
});

type TCreateGigDescriptionSchema = z.infer<typeof createGigDescriptionSchema>;

function CreateGigDescriptionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TCreateGigDescriptionSchema>({
    resolver: zodResolver(createGigDescriptionSchema),
    mode: "onChange",
  });
  const navigate = useNavigate();

  const { createGigData, setCreateGigData, setStep } = useCreateGig();

  useEffect(
    function () {
      const lastIncompleteStep = getLastIncompleteGigStep(2, createGigData);
      if (lastIncompleteStep) {
        navigate(lastIncompleteStep);
        return;
      }
      setStep(2);
    },
    [setStep, createGigData, navigate]
  );

  function onSubmit(data: TCreateGigDescriptionSchema) {
    setCreateGigData((createGigData) => ({
      ...createGigData,
      description: data.description,
    }));
    navigate("/gigs/new/labels");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <h1 className="text-2xl mb-5 md:font-medium">
          Now let's get into the details.
        </h1>
        <div className="mb-5">
          <textarea
            id="description"
            {...register("description")}
            className="w-full resize-y rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
            defaultValue={createGigData.description}
            rows={10}
          />
          {errors.description && (
            <InputError>{errors.description.message}</InputError>
          )}
        </div>
        <div className="flex mb-3 gap-1/2">
          <TbBulb className="text-2xl" />
          <h2 className="text-lg">Tips</h2>
        </div>
        <p className="font-light text-sm mb-2">
          A good description will start the conversation and help you attract
          someone who's a perfect fit.
        </p>
        <p className="mb-2">Focus on:</p>
        <ul className="[&>li]:font-light [&>li]:text-sm list-disc list-outside [&>li]:mb-2 px-4 mb-2">
          <li>Key tasks and expected deliverables</li>
          <li>Special skills or knowledge needed</li>
          <li>Specific instructions such as dress code</li>
          <li>Supporting files or images can be included as links</li>
        </ul>
        <a className="underline text-primary flex items-center gap-1">
          <span>
            <TbExternalLink />
          </span>{" "}
          See examples
        </a>
      </label>
      <StepNavigation
        handleBack={() => navigate("/gigs/new/title")}
        isValid={isValid}
        nextStepName="Labels"
      />
    </form>
  );
}

export default CreateGigDescriptionForm;
