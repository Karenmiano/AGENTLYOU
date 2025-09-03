import { useCreateGig } from "../hooks/useCreateGig";

interface StepNavigationProps {
  handleBack?: () => void;
  isValid: boolean;
  nextStepName: string;
}

function StepNavigation({
  handleBack = () => {},
  isValid,
  nextStepName,
}: StepNavigationProps) {
  const { step } = useCreateGig();

  return (
    <div className="fixed h-20 items-center justify-between flex bottom-0 left-0 right-0 bg-white px-5">
      <button
        className={`rounded-full text-primary py-3  px-5  border-2 border-gray-300 cursor-pointer hover:bg-gray-100 ${
          step === 1 ? "invisible" : ""
        }`}
        onClick={handleBack}
        type="button"
      >
        Back
      </button>

      <button
        type="submit"
        className="rounded-full bg-primary/90 py-3 px-5 text-white  cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        disabled={!isValid}
      >
        Next: {nextStepName}
      </button>
    </div>
  );
}

export default StepNavigation;
