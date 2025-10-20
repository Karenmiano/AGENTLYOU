import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbBulb } from "react-icons/tb";
import { TbExternalLink } from "react-icons/tb";

import InputError from "../../../ui/InputError";

import { gigSchema } from "../schema";
import type { GigFieldFormProps } from "../types";

const gigDescriptionSchema = gigSchema.pick({
  description: true,
});

type TGigDescriptionSchema = z.infer<typeof gigDescriptionSchema>;

function CreateGigDescriptionForm({
  gigData,
  setGigData,
  renderFormActions,
  onSubmit = () => {},
}: GigFieldFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TGigDescriptionSchema>({
    resolver: zodResolver(gigDescriptionSchema),
    mode: "onChange",
  });

  function handleFormSubmit(data: TGigDescriptionSchema) {
    setGigData((gigData) => ({
      ...gigData,
      description: data.description,
    }));
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label>
        <h1 className="text-2xl mb-5 md:font-medium">
          Now let's get into the details.
        </h1>
        <div className="mb-5">
          <textarea
            id="description"
            {...register("description")}
            className="w-full resize-y rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
            defaultValue={gigData.description}
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
      {renderFormActions(isValid)}
    </form>
  );
}

export default CreateGigDescriptionForm;
