import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

import InputError from "../../../../ui/InputError";
import StepNavigation from "./StepNavigation";

import { useCreateGig } from "../hooks/useCreateGig";
import { createGigSchema } from "../schema";

const createGigCompensationSchema = createGigSchema.pick({
  compensation: true,
});

type TCreateGigCompensationSchema = z.infer<typeof createGigCompensationSchema>;

function CreateGigCompensationForm() {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm<TCreateGigCompensationSchema>({
    resolver: zodResolver(createGigCompensationSchema),
    mode: "onChange",
  });
  const navigate = useNavigate();
  const { onChange, onBlur, name, ref } = register("compensation", {
    valueAsNumber: true,
  });

  const { createGigData, setCreateGigData } = useCreateGig();

  function onSubmit(data: TCreateGigCompensationSchema) {
    setCreateGigData((createGigData) => ({
      ...createGigData,
      compensation: data.compensation,
    }));
    navigate("/gigs/review");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <h1 className="text-2xl mb-5 md:font-medium">
          Set your budget for this gig.
        </h1>

        <div className="relative mb-5">
          <div className="absolute top-2 left-4 text-gray-600">USD</div>
          <input
            id="compensation"
            name={name}
            ref={ref}
            defaultValue={createGigData.compensation?.toFixed(2) ?? ""}
            onBlur={(e) => {
              if (e.currentTarget.value)
                e.currentTarget.value = Number(e.currentTarget.value).toFixed(
                  2
                );
              onBlur(e);
            }}
            onChange={(e) => {
              if (e.currentTarget.value) {
                const value = e.currentTarget.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1")
                  .replace(/(\.\d{2,2})\d*/g, "$1")
                  .replace(/^\./, "0.");

                e.currentTarget.value = value;

                if (e.currentTarget.value) onChange(e);
              } else
                setError("compensation", {
                  type: "required",
                  message: "This field is required",
                });
            }}
            className="rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm text-right"
          />
          {errors.compensation && (
            <InputError>{errors.compensation.message}</InputError>
          )}
        </div>

        <p className="font-light text-gray-600 text-sm mb-2">
          This is just an estimated budget. You can agree on the final price
          with your agent later.
        </p>
      </label>
      <StepNavigation
        handleBack={() => navigate("/gigs/new/location-time")}
        isValid={isValid}
        nextStepName="Review & Publish"
      />
    </form>
  );
}

export default CreateGigCompensationForm;
