import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineEye } from "react-icons/hi2";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { GoArrowLeft } from "react-icons/go";
import toast from "react-hot-toast";
import axios from "axios";

import { api } from "../../api";
import AuthFormInput from "../../ui/AuthFormInput";
import AuthFormLabel from "../../ui/AuthFormLabel";
import InputError from "../../ui/InputError";

import type { TSignUpSchema, ExtractKeys } from "../../lib/types";
import { signUpSchema } from "../../lib/types";

function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const signUpRole = sessionStorage.getItem("signUpRole");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data: TSignUpSchema) {
    if (isSubmitting) return;

    try {
      const response = await api.post("/auth/register/", {
        ...data,
        defaultRole: signUpRole,
      });

      const responseData = response.data;
      console.log("Registration successful:", responseData);
      toast.success("Registration successful!");
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          switch (error.response.status) {
            case 400:
              Object.entries(errorData).forEach(([field, error]) => {
                if (
                  typeof error === "object" &&
                  !Array.isArray(error) &&
                  error !== null
                ) {
                  Object.entries(error).forEach(
                    ([nestedField, nestedError]) => {
                      setError(
                        `${field}.${nestedField}` as ExtractKeys<TSignUpSchema>,
                        {
                          type: "server",
                          message: Array.isArray(nestedError)
                            ? nestedError[0]
                            : nestedError,
                        }
                      );
                    }
                  );
                } else {
                  setError(field as ExtractKeys<TSignUpSchema>, {
                    type: "server",
                    message: Array.isArray(error) ? error[0] : error,
                  });
                }
              });
              break;
            case 409:
              setError("email", {
                type: "server",
                message: errorData.error,
              });
              break;
            default:
              toast.error(
                "An error occured during registration. Please try again."
              );
          }
        } else if (error.request) {
          toast.error(
            "Something went wrong. Please check your internet connection and try again."
          );
        }
      } else {
        toast.error("An error occured during registration. Please try again.");
      }
    }
  }

  return signUpRole ? (
    <div className="px-5 mx-auto mb-10 mt-2 max-w-[550px] sm:px-0">
      <button
        type="button"
        aria-label="Back"
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
      >
        <GoArrowLeft className="text-2xl text-gray-500" />
      </button>
      <form className="mb-2" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl text-center font-bold mb-5">SignUp</h1>
        <div className="mb-3">
          <AuthFormLabel htmlFor="name">Full Name</AuthFormLabel>
          <AuthFormInput
            type="text"
            name="fullName"
            id="fullName"
            register={register}
          />
          {errors.fullName && (
            <InputError>{errors.fullName.message}</InputError>
          )}
        </div>

        <div className="mb-3">
          <AuthFormLabel htmlFor="email">Email Address</AuthFormLabel>
          <AuthFormInput
            type="email"
            name="email"
            id="email"
            register={register}
          />
          {errors.email && <InputError>{errors.email.message}</InputError>}
        </div>

        <div className="mb-3">
          <AuthFormLabel htmlFor="password">Password</AuthFormLabel>
          <div className="relative">
            <AuthFormInput
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              register={register}
            />
            {showPassword ? (
              <HiOutlineEye
                className="absolute top-2/4 right-3 -translate-y-2/4 text-xl"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <HiOutlineEyeSlash
                className="absolute top-2/4 right-3 -translate-y-2/4 text-xl"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {errors.password && (
            <InputError>{errors.password.message}</InputError>
          )}
        </div>

        <div className="mb-3">
          <AuthFormLabel htmlFor="confirmPassword">
            Confirm Password
          </AuthFormLabel>
          <div className="relative">
            <AuthFormInput
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              register={register}
            />
            {showPassword ? (
              <HiOutlineEye
                className="absolute top-2/4 right-3 -translate-y-2/4 text-xl"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <HiOutlineEyeSlash
                className="absolute top-2/4 right-3 -translate-y-2/4 text-xl"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {errors.confirmPassword && (
            <InputError>{errors.confirmPassword.message}</InputError>
          )}
        </div>

        <fieldset className="mb-3 pt-2">
          <legend className="mb-2 font-semibold">Location Details</legend>
          <div className="grid grid-cols-2 gap-x-3">
            <div className="mb-3">
              <AuthFormLabel htmlFor="country">Country</AuthFormLabel>
              <AuthFormInput
                type="text"
                name="location.country"
                id="country"
                register={register}
              />
              {errors.location?.country && (
                <InputError>{errors.location.country.message}</InputError>
              )}
            </div>

            <div className="mb-3">
              <AuthFormLabel htmlFor="STR">
                State/ Region<span className="text-gray-500">(optional)</span>
              </AuthFormLabel>
              <AuthFormInput
                type="text"
                name="location.stateRegion"
                id="stateRegion"
                register={register}
              />
              {errors.location?.stateRegion && (
                <InputError>{errors.location.stateRegion.message}</InputError>
              )}
            </div>

            <div className="mb-3">
              <AuthFormLabel htmlFor="city">City</AuthFormLabel>
              <AuthFormInput
                type="text"
                name="location.city"
                id="city"
                register={register}
              />
              {errors.location?.city && (
                <InputError>{errors.location.city.message}</InputError>
              )}
            </div>
          </div>
        </fieldset>

        <div className="my-4">
          <div className="flex items-center gap-2">
            <input
              id="agreed"
              type="checkbox"
              className="accent-primary size-4"
              {...register("termsAgreed")}
            />
            <label htmlFor="agreed" className="text-sm">
              I agree to the{" "}
              <Link
                to="/terms"
                className="hover:text-primary text-primary/85 underline"
              >
                Terms of Service{" "}
              </Link>
              and{" "}
              <Link
                to="/privacy"
                className="hover:text-primary text-primary/85 underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.termsAgreed && (
            <InputError>{errors.termsAgreed.message}</InputError>
          )}
        </div>

        <button
          className="flex items-center justify-center w-full rounded-full hover:bg-primary bg-primary/90 py-3 font-semibold text-white outline-none transition-colors"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

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
  ) : (
    <Navigate to="/signup/role" replace />
  );
}

export default SignUpForm;
