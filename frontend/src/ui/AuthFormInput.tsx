import type { UseFormRegister } from "react-hook-form";

import type { TSignUpSchema, ExtractKeys } from "../lib/types";

interface AuthFormInputProps {
  type: string;
  name: ExtractKeys<TSignUpSchema>;
  id: string;
  register: UseFormRegister<TSignUpSchema>;
}

function AuthFormInput({ type, name, id, register }: AuthFormInputProps) {
  return (
    <input
      id={id}
      type={type}
      {...register(name)}
      className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
    />
  );
}

export default AuthFormInput;
