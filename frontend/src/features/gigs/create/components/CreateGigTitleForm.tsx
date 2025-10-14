import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { TbBulb } from "react-icons/tb";

import InputError from "../../../../ui/InputError";
import StepNavigation from "./StepNavigation";

import { useCreateGig } from "../hooks/useCreateGig";
import { createGigSchema } from "../schema";

const createGigTitleSchema = createGigSchema.pick({
  title: true,
});

type TCreateGigTitleSchema = z.infer<typeof createGigTitleSchema>;

function CreateGigTitleForm() {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<TCreateGigTitleSchema>({
    resolver: zodResolver(createGigTitleSchema),
    mode: "onChange",
  });
  const { createGigData, setCreateGigData } = useCreateGig();
  const navigate = useNavigate();

  function onSubmit(data: TCreateGigTitleSchema) {
    setCreateGigData((createGigData) => ({
      ...createGigData,
      title: data.title,
    }));
    navigate("/gigs/new/description");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <h1 className="text-2xl mb-5 md:font-medium">
          Kick things off with a clear title.
        </h1>
        <div className="mb-5">
          <input
            id="title"
            {...register("title")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
            defaultValue={createGigData.title}
          />
          {errors.title && <InputError>{errors.title.message}</InputError>}
        </div>
        <div className="flex mb-3 gap-1/2">
          <TbBulb className="text-2xl" />
          <h2 className="text-lg">Tips</h2>
        </div>
        <p className="font-light text-sm mb-2">
          Your title is the first thing agents see, it's your chance to grab
          their attention! Keep it clear and specific so the right people find
          and apply for your gig.
        </p>
        <p className="mb-2">Examples</p>
        <ul className="[&>li]:font-light [&>li]:text-sm list-disc list-outside [&>li]:mb-2 px-4">
          <li>Pitch my startup idea at the innovation fair</li>
          <li>Walk through exhibitor booths at the Real Estate Expo</li>
          <li>Network with investors at the blockchain summit in Singapore</li>
        </ul>
      </label>
      <StepNavigation isValid={isValid} nextStepName="Description" />
    </form>
  );
}

export default CreateGigTitleForm;
