import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbBulb } from "react-icons/tb";

import InputError from "../../../ui/InputError";

import { gigSchema } from "../schema";
import type { GigFieldFormProps } from "../types";

const gigTitleSchema = gigSchema.pick({
  title: true,
});

type TGigTitleSchema = z.infer<typeof gigTitleSchema>;

function GigTitleForm({
  gigData,
  setGigData,
  renderFormActions,
  onSubmit = () => {},
}: GigFieldFormProps) {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<TGigTitleSchema>({
    resolver: zodResolver(gigTitleSchema),
    mode: "onChange",
  });

  function handleFormSubmit(data: TGigTitleSchema) {
    setGigData((gigData) => ({
      ...gigData,
      title: data.title,
    }));
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label>
        <h1 className="text-2xl mb-5 md:font-medium">
          Kick things off with a clear title.
        </h1>
        <div className="mb-5">
          <input
            id="title"
            {...register("title")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
            defaultValue={gigData.title}
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
      {renderFormActions(isValid)}
    </form>
  );
}

export default GigTitleForm;
